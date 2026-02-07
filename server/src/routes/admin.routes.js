import express from 'express';
import multer from 'multer';
import { PrismaClient } from '@prisma/client';
import { authenticate, isAdmin } from '../middleware/auth.js';
import { parseExcelFile } from '../utils/excelParser.js';

const router = express.Router();
const prisma = new PrismaClient();

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'text/csv'
    ];
    if (allowedTypes.includes(file.mimetype) || file.originalname.match(/\.(xlsx|xls|csv)$/)) {
      cb(null, true);
    } else {
      cb(new Error('Only Excel files (.xlsx, .xls) and CSV files are allowed'));
    }
  }
});

// GET /api/admin/dashboard - Dashboard statistics
router.get('/dashboard', authenticate, isAdmin, async (req, res, next) => {
  try {
    const totalStudents = await prisma.studentProfile.count();
    
    const studentsByBatch = await prisma.studentProfile.groupBy({
      by: ['batch'],
      _count: { id: true }
    });

    const attendanceShortage = await prisma.attendance.findMany({
      where: { attendancePercent: { lt: 75 } },
      select: { studentId: true },
      distinct: ['studentId']
    });

    const performanceRisk = await prisma.academicYear.findMany({
      where: { gpa: { lt: 5.0 } },
      select: { studentId: true },
      distinct: ['studentId']
    });

    res.json({
      success: true,
      data: {
        totalStudents,
        studentsByBatch: studentsByBatch.map(b => ({
          batch: b.batch,
          count: b._count.id
        })),
        attendanceShortageCount: attendanceShortage.length,
        performanceRiskCount: performanceRisk.length
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

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

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
      prisma.studentProfile.findMany({
        where,
        skip,
        take,
        orderBy: { [sortBy]: sortOrder },
        include: {
          user: { select: { name: true, email: true } },
          academicYears: {
            orderBy: { year: 'desc' },
            take: 1,
            select: { gpa: true }
          },
          attendances: {
            select: { attendancePercent: true }
          }
        }
      }),
      prisma.studentProfile.count({ where })
    ]);

    const formattedStudents = students.map(s => {
      const avgAttendance = s.attendances.length > 0
        ? s.attendances.reduce((sum, a) => sum + a.attendancePercent, 0) / s.attendances.length
        : null;
      
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

// POST /api/admin/upload/academics - Upload academic data
router.post('/upload/academics', authenticate, isAdmin, upload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const data = parseExcelFile(req.file.buffer);
    let updated = 0;
    let errors = [];

    for (const row of data) {
      try {
        const student = await prisma.studentProfile.findUnique({
          where: { rollNumber: row.rollNumber }
        });

        if (!student) {
          errors.push(`Student not found: ${row.rollNumber}`);
          continue;
        }

        const academicYear = await prisma.academicYear.upsert({
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
          await prisma.subjectMark.upsert({
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

        updated++;
      } catch (err) {
        errors.push(`Error processing ${row.rollNumber}: ${err.message}`);
      }
    }

    res.json({
      success: true,
      message: `Processed ${updated} records`,
      data: { updated, errors: errors.slice(0, 10) }
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/admin/upload/attendance - Upload attendance data
router.post('/upload/attendance', authenticate, isAdmin, upload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const data = parseExcelFile(req.file.buffer);
    let updated = 0;
    let errors = [];

    for (const row of data) {
      try {
        const student = await prisma.studentProfile.findUnique({
          where: { rollNumber: row.rollNumber }
        });

        if (!student) {
          errors.push(`Student not found: ${row.rollNumber}`);
          continue;
        }

        await prisma.attendance.upsert({
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

        updated++;
      } catch (err) {
        errors.push(`Error processing ${row.rollNumber}: ${err.message}`);
      }
    }

    res.json({
      success: true,
      message: `Processed ${updated} records`,
      data: { updated, errors: errors.slice(0, 10) }
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/admin/upload/activities - Upload activities data
router.post('/upload/activities', authenticate, isAdmin, upload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const data = parseExcelFile(req.file.buffer);
    let updated = 0;
    let errors = [];

    for (const row of data) {
      try {
        const student = await prisma.studentProfile.findUnique({
          where: { rollNumber: row.rollNumber }
        });

        if (!student) {
          errors.push(`Student not found: ${row.rollNumber}`);
          continue;
        }

        await prisma.activities.upsert({
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

        updated++;
      } catch (err) {
        errors.push(`Error processing ${row.rollNumber}: ${err.message}`);
      }
    }

    res.json({
      success: true,
      message: `Processed ${updated} records`,
      data: { updated, errors: errors.slice(0, 10) }
    });
  } catch (error) {
    next(error);
  }
});

export default router;
