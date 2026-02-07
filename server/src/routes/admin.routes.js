import express from 'express';
import multer from 'multer';
import { authenticate, isAdmin } from '../middleware/auth.js';
import { parseExcelFile } from '../utils/excelParser.js';
import prisma from '../utils/prisma.js';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Reduced to 5MB for safety
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'application/vnd.ms-excel', // .xls
      'text/csv'
    ];

    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only Excel (.xlsx, .xls) and CSV files are allowed.'));
    }
  }
});

// GET /api/admin/dashboard - Dashboard statistics
router.get('/dashboard', authenticate, isAdmin, async (req, res, next) => {
  try {
    // Optimized: Parallel execution of all queries
    const [totalStudents, studentsByBatch, attendanceShortage, performanceRisk] =
      await Promise.all([
        prisma.studentProfile.count(),

        prisma.studentProfile.groupBy({
          by: ['batch'],
          _count: { id: true },
          orderBy: { batch: 'desc' }
        }),

        // Optimized: Use aggregation instead of fetching all records
        prisma.$queryRaw`
          SELECT COUNT(DISTINCT "studentId") as count
          FROM "Attendance"
          WHERE "attendancePercent" < 75
        `,

        // Optimized: Use aggregation instead of fetching all records
        prisma.$queryRaw`
          SELECT COUNT(DISTINCT "studentId") as count
          FROM "AcademicYear"
          WHERE "gpa" < 5.0
        `
      ]);

    res.json({
      success: true,
      data: {
        totalStudents,
        studentsByBatch: studentsByBatch.map(b => ({
          batch: b.batch,
          count: b._count.id
        })),
        attendanceShortageCount: Number(attendanceShortage[0].count),
        performanceRiskCount: Number(performanceRisk[0].count)
      }
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/admin/students - Paginated student list with filters
router.get('/students', authenticate, isAdmin, async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 20,
      batch,
      department,
      search,
      sortBy = 'rollNumber',
      sortOrder = 'asc'
    } = req.query;

    // Whitelist allowed sort fields to prevent schema disclosure
    const allowedSortFields = ['rollNumber', 'department', 'batch'];
    const safeSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'rollNumber';
    const safeSortOrder = ['asc', 'desc'].includes(sortOrder) ? sortOrder : 'asc';

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = Math.min(parseInt(limit), 100); // Cap limit to prevent DoS

    const where = {};

    if (batch) where.batch = batch;
    if (department) where.department = department;
    if (search) {
      where.OR = [
        { rollNumber: { contains: search, mode: 'insensitive' } },
        { user: { name: { contains: search, mode: 'insensitive' } } }
      ];
    }

    const [students, total] = await Promise.all([
      // Optimized: Fetch only necessary fields, not all attendances
      prisma.studentProfile.findMany({
        where,
        skip,
        take,
        orderBy: { [safeSortBy]: safeSortOrder },
        select: {
          id: true,
          rollNumber: true,
          department: true,
          batch: true,
          user: {
            select: {
              name: true,
              email: true
            }
          },
          academicYears: {
            orderBy: { year: 'desc' },
            take: 1,
            select: { gpa: true }
          }
        }
      }),
      prisma.studentProfile.count({ where })
    ]);

    // Optimized: Batch fetch attendance averages instead of N+1
    const studentIds = students.map(s => s.id);
    const attendanceAggregates = studentIds.length > 0
      ? await prisma.attendance.groupBy({
        by: ['studentId'],
        where: { studentId: { in: studentIds } },
        _avg: { attendancePercent: true }
      })
      : [];

    // Create lookup map for O(1) access
    const attendanceMap = new Map(
      attendanceAggregates.map(a => [a.studentId, a._avg.attendancePercent])
    );

    const formattedStudents = students.map(s => {
      const avgAttendance = attendanceMap.get(s.id) || null;
      const latestGpa = s.academicYears[0]?.gpa || null;

      let riskStatus = 'Normal';
      if (avgAttendance !== null && avgAttendance < 75) riskStatus = 'Attendance Risk';
      if (latestGpa !== null && latestGpa < 5.0) riskStatus = 'Performance Risk';
      if ((avgAttendance !== null && avgAttendance < 75) && (latestGpa !== null && latestGpa < 5.0)) {
        riskStatus = 'High Risk';
      }

      return {
        id: s.id,
        name: s.user.name,
        email: s.user.email,
        rollNumber: s.rollNumber,
        department: s.department,
        batch: s.batch,
        gpa: latestGpa,
        attendancePercent: avgAttendance ? Math.round(avgAttendance * 100) / 100 : null,
        riskStatus
      };
    });

    res.json({
      success: true,
      data: {
        students: formattedStudents,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages: Math.ceil(total / take)
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/admin/student/:id - Single student details
router.get('/student/:id', authenticate, isAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;

    const student = await prisma.studentProfile.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true, email: true } },
        academicYears: {
          orderBy: { year: 'asc' },
          include: {
            subjectMarks: true
          }
        },
        attendances: true,
        activities: true
      }
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    res.json({
      success: true,
      data: { student }
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/admin/batches - Get all unique batches
router.get('/batches', authenticate, isAdmin, async (req, res, next) => {
  try {
    const batches = await prisma.studentProfile.findMany({
      select: { batch: true },
      distinct: ['batch'],
      orderBy: { batch: 'desc' }
    });

    res.json({
      success: true,
      data: { batches: batches.map(b => b.batch) }
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/admin/departments - Get all unique departments
router.get('/departments', authenticate, isAdmin, async (req, res, next) => {
  try {
    const departments = await prisma.studentProfile.findMany({
      select: { department: true },
      distinct: ['department'],
      orderBy: { department: 'asc' }
    });

    res.json({
      success: true,
      data: { departments: departments.map(d => d.department) }
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/admin/upload/academics - Upload academic data (Transactional)
router.post('/upload/academics', authenticate, isAdmin, upload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const data = parseExcelFile(req.file.buffer);

    // Use transaction for all-or-nothing atomicity
    const results = await prisma.$transaction(async (tx) => {
      let updatedCount = 0;

      for (const row of data) {
        if (!row.rollNumber) continue;

        const student = await tx.studentProfile.findUnique({
          where: { rollNumber: row.rollNumber.toString() }
        });

        if (!student) {
          throw new Error(`Critical Error: Student with roll number ${row.rollNumber} not found. Operation aborted.`);
        }

        const academicYear = await tx.academicYear.upsert({
          where: {
            studentId_year: {
              studentId: student.id,
              year: parseInt(row.year)
            }
          },
          update: { gpa: parseFloat(row.gpa) || null },
          create: {
            studentId: student.id,
            year: parseInt(row.year),
            gpa: parseFloat(row.gpa) || null
          }
        });

        if (row.subjectName) {
          await tx.subjectMark.upsert({
            where: {
              academicYearId_subjectName: {
                academicYearId: academicYear.id,
                subjectName: row.subjectName
              }
            },
            update: {
              marks: parseFloat(row.marks) || null,
              unitTest1: parseFloat(row.unitTest1) || null,
              unitTest2: parseFloat(row.unitTest2) || null,
              unitTest3: parseFloat(row.unitTest3) || null,
              iatScore: parseFloat(row.iatScore) || null
            },
            create: {
              academicYearId: academicYear.id,
              subjectName: row.subjectName,
              marks: parseFloat(row.marks) || null,
              unitTest1: parseFloat(row.unitTest1) || null,
              unitTest2: parseFloat(row.unitTest2) || null,
              unitTest3: parseFloat(row.unitTest3) || null,
              iatScore: parseFloat(row.iatScore) || null
            }
          });
        }
        updatedCount++;
      }
      return updatedCount;
    });

    res.json({
      success: true,
      message: `Successfully processed ${results} academic records.`,
      data: { updated: results }
    });
  } catch (error) {
    // Transaction will automatically rollback on error
    next(error);
  }
});

// POST /api/admin/upload/attendance - Upload attendance data (Transactional)
router.post('/upload/attendance', authenticate, isAdmin, upload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const data = parseExcelFile(req.file.buffer);

    const results = await prisma.$transaction(async (tx) => {
      let updatedCount = 0;

      for (const row of data) {
        if (!row.rollNumber) continue;

        const student = await tx.studentProfile.findUnique({
          where: { rollNumber: row.rollNumber.toString() }
        });

        if (!student) {
          throw new Error(`Critical Error: Student with roll number ${row.rollNumber} not found. Operation aborted.`);
        }

        await tx.attendance.upsert({
          where: {
            studentId_subjectName: {
              studentId: student.id,
              subjectName: row.subjectName
            }
          },
          update: {
            attendancePercent: parseFloat(row.attendancePercent),
            totalClasses: parseInt(row.totalClasses) || null,
            attendedClasses: parseInt(row.attendedClasses) || null
          },
          create: {
            studentId: student.id,
            subjectName: row.subjectName,
            attendancePercent: parseFloat(row.attendancePercent),
            totalClasses: parseInt(row.totalClasses) || null,
            attendedClasses: parseInt(row.attendedClasses) || null
          }
        });

        updatedCount++;
      }
      return updatedCount;
    });

    res.json({
      success: true,
      message: `Successfully processed ${results} attendance records.`,
      data: { updated: results }
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/admin/upload/activities - Upload activities data (Transactional)
router.post('/upload/activities', authenticate, isAdmin, upload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const data = parseExcelFile(req.file.buffer);

    const results = await prisma.$transaction(async (tx) => {
      let updatedCount = 0;

      for (const row of data) {
        if (!row.rollNumber) continue;

        const student = await tx.studentProfile.findUnique({
          where: { rollNumber: row.rollNumber.toString() }
        });

        if (!student) {
          throw new Error(`Critical Error: Student with roll number ${row.rollNumber} not found. Operation aborted.`);
        }

        await tx.activities.upsert({
          where: { studentId: student.id },
          update: {
            internships: row.internships ? JSON.parse(row.internships) : undefined,
            scholarships: row.scholarships ? JSON.parse(row.scholarships) : undefined,
            ecube: row.ecube ? JSON.parse(row.ecube) : undefined,
            extracurricular: row.extracurricular ? JSON.parse(row.extracurricular) : undefined,
            sports: row.sports ? JSON.parse(row.sports) : undefined,
            certifications: row.certifications ? JSON.parse(row.certifications) : undefined,
            hackathons: row.hackathons ? JSON.parse(row.hackathons) : undefined
          },
          create: {
            studentId: student.id,
            internships: row.internships ? JSON.parse(row.internships) : null,
            scholarships: row.scholarships ? JSON.parse(row.scholarships) : null,
            ecube: row.ecube ? JSON.parse(row.ecube) : null,
            extracurricular: row.extracurricular ? JSON.parse(row.extracurricular) : null,
            sports: row.sports ? JSON.parse(row.sports) : null,
            certifications: row.certifications ? JSON.parse(row.certifications) : null,
            hackathons: row.hackathons ? JSON.parse(row.hackathons) : null
          }
        });

        updatedCount++;
      }
      return updatedCount;
    });

    res.json({
      success: true,
      message: `Successfully processed ${results} activity records.`,
      data: { updated: results }
    });
  } catch (error) {
    next(error);
  }
});

export default router;
