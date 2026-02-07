import express from 'express';
import { authenticate, isStudent, isAdminOrStudent } from '../middleware/auth.js';
import { generateStudentReport } from '../utils/pdfGenerator.js';
import { analyzePerformanceTrend, analyzeAttendance, generateStudentInsights } from '../services/analytics.js';
import prisma from '../utils/prisma.js';

const router = express.Router();

// GET /api/student/profile - Get student's full profile
router.get('/profile', authenticate, isAdminOrStudent, async (req, res, next) => {
    try {
        let studentId;

        if (req.user.role === 'STUDENT') {
            studentId = req.user.studentProfile?.id;
        } else {
            studentId = req.query.studentId;
        }

        if (!studentId) {
            return res.status(400).json({
                success: false,
                message: 'Student ID required'
            });
        }

        const student = await prisma.studentProfile.findUnique({
            where: { id: studentId },
            select: {
                id: true,
                rollNumber: true,
                department: true,
                batch: true,
                bloodGroup: true,
                contact: true,
                user: { 
                    select: { 
                        id: true, 
                        name: true, 
                        email: true 
                    } 
                },
                academicYears: {
                    orderBy: { year: 'asc' },
                    select: {
                        year: true,
                        gpa: true,
                        subjectMarks: {
                            orderBy: { subjectName: 'asc' },
                            select: {
                                subjectName: true,
                                marks: true,
                                unitTest1: true,
                                unitTest2: true,
                                unitTest3: true,
                                iatScore: true
                            }
                        }
                    }
                },
                attendances: {
                    orderBy: { subjectName: 'asc' },
                    select: {
                        subjectName: true,
                        attendancePercent: true,
                        totalClasses: true,
                        attendedClasses: true
                    }
                },
                activities: {
                    select: {
                        internships: true,
                        scholarships: true,
                        ecube: true,
                        extracurricular: true,
                        sports: true,
                        certifications: true,
                        hackathons: true
                    }
                }
            }
        });

        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student profile not found'
            });
        }

        // Calculate overall attendance
        const overallAttendance = student.attendances.length > 0
            ? student.attendances.reduce((sum, a) => sum + a.attendancePercent, 0) / student.attendances.length
            : null;

        res.json({
            success: true,
            data: {
                profile: {
                    id: student.id,
                    name: student.user.name,
                    email: student.user.email,
                    rollNumber: student.rollNumber,
                    department: student.department,
                    batch: student.batch,
                    bloodGroup: student.bloodGroup,
                    contact: student.contact
                },
                academics: student.academicYears.map(ay => ({
                    year: ay.year,
                    gpa: ay.gpa,
                    subjects: ay.subjectMarks
                })),
                attendance: {
                    overall: overallAttendance ? Math.round(overallAttendance * 100) / 100 : null,
                    subjects: student.attendances
                },
                activities: student.activities
            }
        });
    } catch (error) {
        next(error);
    }
});

// GET /api/student/attendance - Get attendance details
router.get('/attendance', authenticate, isAdminOrStudent, async (req, res, next) => {
    try {
        let studentId;

        if (req.user.role === 'STUDENT') {
            studentId = req.user.studentProfile?.id;
        } else {
            studentId = req.query.studentId;
        }

        if (!studentId) {
            return res.status(400).json({
                success: false,
                message: 'Student ID required'
            });
        }

        const attendances = await prisma.attendance.findMany({
            where: { studentId },
            orderBy: { subjectName: 'asc' }
        });

        const overall = attendances.length > 0
            ? attendances.reduce((sum, a) => sum + a.attendancePercent, 0) / attendances.length
            : 0;

        const shortageSubjects = attendances.filter(a => a.attendancePercent < 75);

        res.json({
            success: true,
            data: {
                overall: Math.round(overall * 100) / 100,
                subjects: attendances,
                shortageWarning: shortageSubjects.length > 0,
                shortageSubjects: shortageSubjects.map(s => s.subjectName)
            }
        });
    } catch (error) {
        next(error);
    }
});

// GET /api/student/activities - Get all activities
router.get('/activities', authenticate, isAdminOrStudent, async (req, res, next) => {
    try {
        let studentId;

        if (req.user.role === 'STUDENT') {
            studentId = req.user.studentProfile?.id;
        } else {
            studentId = req.query.studentId;
        }

        if (!studentId) {
            return res.status(400).json({
                success: false,
                message: 'Student ID required'
            });
        }

        const activities = await prisma.activities.findUnique({
            where: { studentId }
        });

        res.json({
            success: true,
            data: {
                activities: activities || {
                    internships: [],
                    scholarships: [],
                    ecube: [],
                    extracurricular: [],
                    sports: [],
                    certifications: [],
                    hackathons: []
                }
            }
        });
    } catch (error) {
        next(error);
    }
});

// GET /api/student/performance-trend - Academic performance trend
router.get('/performance-trend', authenticate, isAdminOrStudent, async (req, res, next) => {
    try {
        let studentId;

        if (req.user.role === 'STUDENT') {
            studentId = req.user.studentProfile?.id;
        } else {
            studentId = req.query.studentId;
        }

        if (!studentId) {
            return res.status(400).json({
                success: false,
                message: 'Student ID required'
            });
        }

        const academicYears = await prisma.academicYear.findMany({
            where: { studentId },
            orderBy: { year: 'asc' },
            select: {
                year: true,
                gpa: true
            }
        });

        const trend = academicYears.map(ay => ({
            year: `Year ${ay.year}`,
            gpa: ay.gpa
        }));

        // Calculate trend direction
        let trendDirection = 'stable';
        if (trend.length >= 2) {
            const latestGpa = trend[trend.length - 1].gpa;
            const previousGpa = trend[trend.length - 2].gpa;
            if (latestGpa && previousGpa) {
                if (latestGpa > previousGpa) trendDirection = 'improving';
                else if (latestGpa < previousGpa) trendDirection = 'declining';
            }
        }

        res.json({
            success: true,
            data: {
                trend,
                trendDirection
            }
        });
    } catch (error) {
        next(error);
    }
});

// GET /api/student/attendance-trend - Attendance trend
router.get('/attendance-trend', authenticate, isAdminOrStudent, async (req, res, next) => {
    try {
        let studentId;

        if (req.user.role === 'STUDENT') {
            studentId = req.user.studentProfile?.id;
        } else {
            studentId = req.query.studentId;
        }

        if (!studentId) {
            return res.status(400).json({
                success: false,
                message: 'Student ID required'
            });
        }

        const attendances = await prisma.attendance.findMany({
            where: { studentId },
            orderBy: { subjectName: 'asc' },
            select: {
                subjectName: true,
                attendancePercent: true
            }
        });

        res.json({
            success: true,
            data: {
                subjects: attendances.map(a => ({
                    name: a.subjectName,
                    percentage: a.attendancePercent
                }))
            }
        });
    } catch (error) {
        next(error);
    }
});

// GET /api/student/insights - Get comprehensive student insights
router.get('/insights', authenticate, isAdminOrStudent, async (req, res, next) => {
    try {
        let studentId;

        if (req.user.role === 'STUDENT') {
            studentId = req.user.studentProfile?.id;
        } else {
            studentId = req.query.studentId;
        }

        if (!studentId) {
            return res.status(400).json({
                success: false,
                message: 'Student ID required'
            });
        }

        const student = await prisma.studentProfile.findUnique({
            where: { id: studentId },
            include: {
                user: { select: { name: true, email: true } },
                academicYears: {
                    orderBy: { year: 'asc' },
                    include: { subjectMarks: true }
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

        const insights = generateStudentInsights(student);

        res.json({
            success: true,
            data: insights
        });
    } catch (error) {
        next(error);
    }
});

// GET /api/student/report/pdf - Generate PDF report
router.get('/report/pdf', authenticate, isAdminOrStudent, async (req, res, next) => {
    try {
        let studentId;

        if (req.user.role === 'STUDENT') {
            studentId = req.user.studentProfile?.id;
        } else {
            studentId = req.query.studentId;
        }

        if (!studentId) {
            return res.status(400).json({
                success: false,
                message: 'Student ID required'
            });
        }

        const student = await prisma.studentProfile.findUnique({
            where: { id: studentId },
            include: {
                user: { select: { name: true, email: true } },
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

        const pdfBuffer = await generateStudentReport(student);

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${student.rollNumber}_report.pdf"`);
        res.send(pdfBuffer);
    } catch (error) {
        next(error);
    }
});

export default router;
