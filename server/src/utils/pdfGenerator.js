import PDFDocument from 'pdfkit';
import { analyzePerformanceTrend, analyzeAttendance, calculateRiskScore } from '../services/analytics.js';

/**
 * Generate an enhanced comprehensive student report PDF with analytics
 * @param {Object} student - Student data with all relations
 * @returns {Promise<Buffer>} - PDF buffer
 */
export async function generateStudentReport(student) {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument({
                margin: 50,
                size: 'A4'
            });

            const chunks = [];
            doc.on('data', chunk => chunks.push(chunk));
            doc.on('end', () => resolve(Buffer.concat(chunks)));
            doc.on('error', reject);

            // Calculate analytics
            const perfAnalysis = analyzePerformanceTrend(student.academicYears);
            const attAnalysis = analyzeAttendance(student.attendances);
            const riskScore = calculateRiskScore(student);

            // Colors
            const primaryColor = '#1e40af';
            const secondaryColor = '#475569';
            const accentColor = '#059669';
            const warningColor = '#f59e0b';
            const dangerColor = '#dc2626';

            // ========== HEADER ==========
            doc.fontSize(26)
                .fillColor(primaryColor)
                .text('MSEC Academic ERP', { align: 'center' });

            doc.fontSize(16)
                .fillColor(secondaryColor)
                .text('Comprehensive Student Performance Report', { align: 'center' });

            doc.moveDown(0.3);
            drawLine(doc);
            doc.moveDown();

            // ========== PERSONAL INFORMATION ==========
            doc.fontSize(18)
                .fillColor(primaryColor)
                .text('Personal Information');

            doc.moveDown(0.5);

            const info = [
                ['Name', student.user.name],
                ['Roll Number', student.rollNumber],
                ['Department', student.department],
                ['Batch', student.batch],
                ['Email', student.user.email],
                ['Blood Group', student.bloodGroup || 'N/A'],
                ['Contact', student.contact || 'N/A']
            ];

            doc.fontSize(11).fillColor('#1f2937');
            info.forEach(([label, value]) => {
                doc.text(`${label}: `, { continued: true })
                    .fillColor(secondaryColor)
                    .text(value)
                    .fillColor('#1f2937');
            });

            doc.moveDown();

            // ========== PERFORMANCE SUMMARY ==========
            doc.fontSize(18)
                .fillColor(primaryColor)
                .text('Performance Summary');

            doc.moveDown(0.5);

            // GPA Overview
            if (perfAnalysis.averageGpa !== null) {
                const gpaColor = perfAnalysis.averageGpa >= 8 ? accentColor :
                    perfAnalysis.averageGpa >= 6 ? warningColor : dangerColor;

                doc.fontSize(12)
                    .fillColor('#1f2937')
                    .text('Average GPA: ', { continued: true })
                    .fillColor(gpaColor)
                    .text(perfAnalysis.averageGpa.toFixed(2));

                doc.fillColor('#1f2937')
                    .text('Trend: ', { continued: true })
                    .fillColor(perfAnalysis.trendDirection === 'improving' ? accentColor :
                        perfAnalysis.trendDirection === 'declining' ? dangerColor : secondaryColor)
                    .text(perfAnalysis.trendDirection.toUpperCase());

                if (perfAnalysis.improvement !== null) {
                    doc.fillColor('#1f2937')
                        .text('Recent Change: ', { continued: true })
                        .fillColor(perfAnalysis.improvement > 0 ? accentColor : dangerColor)
                        .text(`${perfAnalysis.improvement > 0 ? '+' : ''}${perfAnalysis.improvement.toFixed(2)}`);
                }
            }

            doc.moveDown(0.5);

            // Attendance Overview
            if (attAnalysis.overall > 0) {
                const attColor = attAnalysis.overall >= 75 ? accentColor :
                    attAnalysis.overall >= 60 ? warningColor : dangerColor;

                doc.fontSize(12)
                    .fillColor('#1f2937')
                    .text('Overall Attendance: ', { continued: true })
                    .fillColor(attColor)
                    .text(`${attAnalysis.overall.toFixed(1)}%`);

                doc.fillColor('#1f2937')
                    .text('Status: ', { continued: true })
                    .fillColor(attColor)
                    .text(attAnalysis.status.toUpperCase());
            }

            doc.moveDown();

            // ========== RISK ASSESSMENT ==========
            if (riskScore.score > 0) {
                const riskColor = riskScore.level === 'high' ? dangerColor :
                    riskScore.level === 'medium' ? warningColor : accentColor;

                doc.fontSize(18)
                    .fillColor(primaryColor)
                    .text('Risk Assessment');

                doc.moveDown(0.5);

                doc.fontSize(12)
                    .fillColor('#1f2937')
                    .text('Risk Level: ', { continued: true })
                    .fillColor(riskColor)
                    .text(riskScore.level.toUpperCase());

                doc.fillColor('#1f2937')
                    .text('Risk Score: ', { continued: true })
                    .fillColor(riskColor)
                    .text(`${riskScore.score}/100`);

                if (riskScore.factors.length > 0) {
                    doc.fillColor('#1f2937')
                        .text('Factors:');
                    riskScore.factors.forEach(factor => {
                        doc.fontSize(10)
                            .fillColor(secondaryColor)
                            .text(`  • ${factor}`);
                    });
                }

                doc.moveDown();
            }

            // ========== ACADEMIC PERFORMANCE ==========
            doc.fontSize(18)
                .fillColor(primaryColor)
                .text('Academic Performance');

            doc.moveDown(0.5);

            if (student.academicYears && student.academicYears.length > 0) {
                student.academicYears.forEach(year => {
                    doc.fontSize(14)
                        .fillColor(accentColor)
                        .text(`Year ${year.year} - GPA: ${year.gpa || 'N/A'}`);

                    if (year.subjectMarks && year.subjectMarks.length > 0) {
                        doc.fontSize(10).fillColor(secondaryColor);
                        year.subjectMarks.forEach(subject => {
                            const marks = subject.marks !== null ? subject.marks.toFixed(0) : 'N/A';
                            const marksColor = subject.marks >= 80 ? accentColor :
                                subject.marks >= 60 ? warningColor : dangerColor;
                            doc.fillColor('#1f2937')
                                .text(`  • ${subject.subjectName}: `, { continued: true })
                                .fillColor(marksColor)
                                .text(marks);
                        });
                    }
                    doc.moveDown(0.5);
                });
            } else {
                doc.fontSize(11)
                    .fillColor(secondaryColor)
                    .text('No academic records available');
            }

            doc.moveDown();

            // ========== ATTENDANCE SUMMARY ==========
            doc.fontSize(18)
                .fillColor(primaryColor)
                .text('Attendance Summary');

            doc.moveDown(0.5);

            if (student.attendances && student.attendances.length > 0) {
                const overallAttendance = student.attendances.reduce((sum, a) =>
                    sum + a.attendancePercent, 0) / student.attendances.length;

                let attendanceColor = accentColor;
                if (overallAttendance < 60) attendanceColor = dangerColor;
                else if (overallAttendance < 75) attendanceColor = warningColor;

                doc.fontSize(13)
                    .fillColor(attendanceColor)
                    .text(`Overall Attendance: ${overallAttendance.toFixed(2)}%`);

                doc.moveDown(0.5);
                doc.fontSize(10).fillColor(secondaryColor);

                student.attendances.forEach(att => {
                    let color = accentColor;
                    if (att.attendancePercent < 60) color = dangerColor;
                    else if (att.attendancePercent < 75) color = warningColor;

                    doc.fillColor('#1f2937')
                        .text(`  • ${att.subjectName}: `, { continued: true })
                        .fillColor(color)
                        .text(`${att.attendancePercent.toFixed(1)}%`);
                });
            } else {
                doc.fontSize(11)
                    .fillColor(secondaryColor)
                    .text('No attendance records available');
            }

            doc.moveDown();

            // ========== ACTIVITIES & ACHIEVEMENTS ==========
            doc.fontSize(18)
                .fillColor(primaryColor)
                .text('Holistic Development');

            doc.moveDown(0.5);

            if (student.activities) {
                const activities = student.activities;
                const sections = [
                    { name: 'Internships', data: activities.internships },
                    { name: 'Certifications', data: activities.certifications },
                    { name: 'Hackathons', data: activities.hackathons },
                    { name: 'Scholarships', data: activities.scholarships },
                    { name: 'Sports', data: activities.sports },
                    { name: 'Extra-curricular', data: activities.extracurricular },
                    { name: 'E-Cube', data: activities.ecube }
                ];

                sections.forEach(section => {
                    if (section.data && Array.isArray(section.data) && section.data.length > 0) {
                        doc.fontSize(13)
                            .fillColor(accentColor)
                            .text(section.name);

                        doc.fontSize(10).fillColor(secondaryColor);
                        section.data.forEach(item => {
                            if (typeof item === 'string') {
                                doc.text(`  • ${item}`);
                            } else if (typeof item === 'object') {
                                const description = item.name || item.title || item.description ||
                                    item.company || item.event || JSON.stringify(item);
                                doc.text(`  • ${description}`);
                            }
                        });
                        doc.moveDown(0.4);
                    }
                });
            } else {
                doc.fontSize(11)
                    .fillColor(secondaryColor)
                    .text('No activities recorded');
            }

            // ========== RECOMMENDATIONS ==========
            doc.moveDown();
            doc.fontSize(18)
                .fillColor(primaryColor)
                .text('Recommendations');

            doc.moveDown(0.5);

            doc.fontSize(11)
                .fillColor('#1f2937')
                .text(`• ${perfAnalysis.recommendation}`);

            doc.text(`• ${attAnalysis.recommendation}`);

            // ========== FOOTER ==========
            doc.moveDown(2);
            drawLine(doc);

            doc.moveDown(0.5);
            doc.fontSize(9)
                .fillColor(secondaryColor)
                .text(`Generated on: ${new Date().toLocaleDateString('en-IN', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                })}`, { align: 'center' });

            doc.text('MSEC Academic ERP - Confidential', { align: 'center' });

            doc.end();
        } catch (error) {
            reject(error);
        }
    });
}

function drawLine(doc) {
    doc.strokeColor('#e2e8f0')
        .lineWidth(1)
        .moveTo(50, doc.y)
        .lineTo(545, doc.y)
        .stroke();
}
