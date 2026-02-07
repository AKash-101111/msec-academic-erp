/**
 * Advanced Analytics Service for Student Performance Analysis
 */

/**
 * Calculate GPA trend and provide insights
 */
export function analyzePerformanceTrend(academicYears) {
    if (!academicYears || academicYears.length === 0) {
        return {
            trend: [],
            trendDirection: 'stable',
            averageGpa: null,
            improvement: null,
            recommendation: 'No academic data available'
        };
    }

    const sortedYears = [...academicYears].sort((a, b) => a.year - b.year);
    const trend = sortedYears.map(y => ({
        year: `Year ${y.year}`,
        gpa: y.gpa || 0
    }));

    // Calculate trend direction
    const validGpas = sortedYears.filter(y => y.gpa !== null && y.gpa !== undefined);
    if (validGpas.length < 2) {
        return {
            trend,
            trendDirection: 'stable',
            averageGpa: validGpas[0]?.gpa || null,
            improvement: null,
            recommendation: 'More data needed for trend analysis'
        };
    }

    const latestGpa = validGpas[validGpas.length - 1].gpa;
    const previousGpa = validGpas[validGpas.length - 2].gpa;
    const averageGpa = validGpas.reduce((sum, y) => sum + y.gpa, 0) / validGpas.length;

    let trendDirection = 'stable';
    let improvement = latestGpa - previousGpa;

    if (improvement > 0.5) {
        trendDirection = 'improving';
    } else if (improvement < -0.5) {
        trendDirection = 'declining';
    }

    // Generate recommendation
    let recommendation;
    if (trendDirection === 'improving') {
        recommendation = 'Excellent progress! Continue with your current study methods.';
    } else if (trendDirection === 'declining') {
        recommendation = 'Consider seeking academic support and reviewing study strategies.';
    } else if (latestGpa < 5.0) {
        recommendation = 'Focus on improving performance. Consider tutoring or study groups.';
    } else if (latestGpa >= 8.0) {
        recommendation = 'Outstanding performance! Maintain your excellence.';
    } else {
        recommendation = 'Good performance. Keep up the consistent work.';
    }

    return {
        trend,
        trendDirection,
        averageGpa: parseFloat(averageGpa.toFixed(2)),
        improvement: parseFloat(improvement.toFixed(2)),
        recommendation
    };
}

/**
 * Calculate attendance insights and warnings
 */
export function analyzeAttendance(attendances) {
    if (!attendances || attendances.length === 0) {
        return {
            overall: 0,
            status: 'critical',
            shortageCount: 0,
            criticalSubjects: [],
            recommendation: 'No attendance data available'
        };
    }

    const overall = attendances.reduce((sum, a) => sum + a.attendancePercent, 0) / attendances.length;

    const criticalSubjects = attendances.filter(a => a.attendancePercent < 60);
    const warningSubjects = attendances.filter(a => a.attendancePercent >= 60 && a.attendancePercent < 75);
    const shortageCount = criticalSubjects.length + warningSubjects.length;

    let status = 'good';
    let recommendation;

    if (overall < 60) {
        status = 'critical';
        recommendation = 'URGENT: Your attendance is critically low. Risk of academic action. Attend all remaining classes.';
    } else if (overall < 75) {
        status = 'warning';
        recommendation = 'WARNING: You are below 75% attendance. Improve immediately to avoid restrictions.';
    } else if (overall < 85) {
        status = 'good';
        recommendation = 'Attendance is satisfactory. Maintain consistency.';
    } else {
        status = 'excellent';
        recommendation = 'Excellent attendance record! Keep it up.';
    }

    return {
        overall: parseFloat(overall.toFixed(2)),
        status,
        shortageCount,
        criticalSubjects: criticalSubjects.map(s => s.subjectName),
        warningSubjects: warningSubjects.map(s => s.subjectName),
        recommendation
    };
}

/**
 * Calculate risk score for a student (0-100, higher is more risk)
 */
export function calculateRiskScore(student) {
    let riskScore = 0;
    const factors = [];

    // GPA risk (up to 40 points)
    const latestGpa = student.academicYears?.[student.academicYears.length - 1]?.gpa;
    if (latestGpa !== null && latestGpa !== undefined) {
        if (latestGpa < 4.0) {
            riskScore += 40;
            factors.push('Very low GPA');
        } else if (latestGpa < 5.0) {
            riskScore += 30;
            factors.push('Low GPA');
        } else if (latestGpa < 6.0) {
            riskScore += 15;
            factors.push('Below average GPA');
        }
    }

    // Attendance risk (up to 40 points)
    if (student.attendances && student.attendances.length > 0) {
        const avgAttendance = student.attendances.reduce((sum, a) => sum + a.attendancePercent, 0) / student.attendances.length;
        if (avgAttendance < 60) {
            riskScore += 40;
            factors.push('Critical attendance shortage');
        } else if (avgAttendance < 75) {
            riskScore += 25;
            factors.push('Attendance below required 75%');
        } else if (avgAttendance < 80) {
            riskScore += 10;
            factors.push('Low attendance');
        }
    }

    // Performance trend (up to 20 points)
    if (student.academicYears && student.academicYears.length >= 2) {
        const validYears = student.academicYears.filter(y => y.gpa !== null);
        if (validYears.length >= 2) {
            const latest = validYears[validYears.length - 1].gpa;
            const previous = validYears[validYears.length - 2].gpa;
            const decline = previous - latest;

            if (decline > 1.0) {
                riskScore += 20;
                factors.push('GPA declining rapidly');
            } else if (decline > 0.5) {
                riskScore += 10;
                factors.push('GPA declining');
            }
        }
    }

    let riskLevel = 'low';
    if (riskScore >= 60) riskLevel = 'high';
    else if (riskScore >= 30) riskLevel = 'medium';

    return {
        score: riskScore,
        level: riskLevel,
        factors
    };
}

/**
 * Generate comprehensive student insights
 */
export function generateStudentInsights(student) {
    const performanceAnalysis = analyzePerformanceTrend(student.academicYears);
    const attendanceAnalysis = analyzeAttendance(student.attendances);
    const riskAssessment = calculateRiskScore(student);

    const strengths = [];
    const areasForImprovement = [];

    // Identify strengths
    if (performanceAnalysis.averageGpa >= 8.0) {
        strengths.push('Excellent academic performance');
    }
    if (attendanceAnalysis.overall >= 90) {
        strengths.push('Outstanding attendance record');
    }
    if (performanceAnalysis.trendDirection === 'improving') {
        strengths.push('Consistent academic improvement');
    }
    if (student.activities) {
        if (student.activities.certifications?.length > 0) {
            strengths.push('Pursuing additional certifications');
        }
        if (student.activities.internships?.length > 0) {
            strengths.push('Gaining industry experience');
        }
    }

    // Identify areas for improvement
    if (performanceAnalysis.averageGpa < 6.0) {
        areasForImprovement.push('Academic performance needs attention');
    }
    if (attendanceAnalysis.overall < 75) {
        areasForImprovement.push('Attendance below minimum requirement');
    }
    if (performanceAnalysis.trendDirection === 'declining') {
        areasForImprovement.push('Address declining academic trend');
    }
    if (attendanceAnalysis.criticalSubjects.length > 0) {
        areasForImprovement.push(`Critical attendance in ${attendanceAnalysis.criticalSubjects.length} subject(s)`);
    }

    return {
        performance: performanceAnalysis,
        attendance: attendanceAnalysis,
        risk: riskAssessment,
        strengths,
        areasForImprovement,
        overallStatus: riskAssessment.level === 'high' ? 'needs_intervention' :
            riskAssessment.level === 'medium' ? 'monitoring_required' : 'on_track'
    };
}
