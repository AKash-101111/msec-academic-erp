import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const departments = ['CSE', 'ECE', 'EEE', 'MECH', 'CIVIL', 'IT'];
const batches = ['2021-2025', '2022-2026', '2023-2027', '2024-2028'];
const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const subjects = {
    1: ['Engineering Mathematics I', 'Engineering Physics', 'Engineering Chemistry', 'Programming in C', 'Engineering Graphics', 'Communication Skills'],
    2: ['Engineering Mathematics II', 'Data Structures', 'Digital Electronics', 'Object Oriented Programming', 'Environmental Science', 'Professional Ethics'],
    3: ['Database Management', 'Computer Networks', 'Operating Systems', 'Software Engineering', 'Theory of Computation', 'Discrete Mathematics'],
    4: ['Machine Learning', 'Cloud Computing', 'Cyber Security', 'Big Data Analytics', 'Internet of Things', 'Project Work']
};

async function main() {
    console.log('🌱 Starting database seed...');

    // Clear existing data
    await prisma.subjectMark.deleteMany();
    await prisma.academicYear.deleteMany();
    await prisma.attendance.deleteMany();
    await prisma.activities.deleteMany();
    await prisma.studentProfile.deleteMany();
    await prisma.user.deleteMany();

    console.log('✅ Cleared existing data');

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = await prisma.user.create({
        data: {
            name: 'Admin User',
            email: 'admin@msec.edu.in',
            password: adminPassword,
            role: 'ADMIN'
        }
    });
    console.log('✅ Created admin user: admin@msec.edu.in / admin123');

    // Create students (150 students)
    const studentPassword = await bcrypt.hash('student123', 10);
    const students = [];

    for (let i = 1; i <= 150; i++) {
        const dept = departments[Math.floor(Math.random() * departments.length)];
        const batch = batches[Math.floor(Math.random() * batches.length)];
        const rollNumber = `${batch.split('-')[0]}${dept}${String(i).padStart(3, '0')}`;

        const student = await prisma.user.create({
            data: {
                name: `Student ${i}`,
                email: `student${i}@msec.edu.in`,
                password: studentPassword,
                role: 'STUDENT',
                studentProfile: {
                    create: {
                        rollNumber,
                        department: dept,
                        batch,
                        bloodGroup: bloodGroups[Math.floor(Math.random() * bloodGroups.length)],
                        contact: `98${String(Math.floor(Math.random() * 100000000)).padStart(8, '0')}`
                    }
                }
            },
            include: {
                studentProfile: true
            }
        });
        students.push(student);
    }
    console.log('✅ Created 150 student accounts');

    // Add academic years and subject marks
    for (const student of students) {
        if (!student.studentProfile) continue;

        const batchYear = parseInt(student.studentProfile.batch.split('-')[0]);
        const currentYear = 2026;
        const yearsCompleted = Math.min(4, Math.max(1, currentYear - batchYear));

        for (let year = 1; year <= yearsCompleted; year++) {
            const gpa = Math.round((5 + Math.random() * 5) * 100) / 100;

            const academicYear = await prisma.academicYear.create({
                data: {
                    studentId: student.studentProfile.id,
                    year,
                    gpa
                }
            });

            // Add subject marks for each year
            for (const subjectName of subjects[year]) {
                const marks = Math.round((40 + Math.random() * 60) * 100) / 100;
                await prisma.subjectMark.create({
                    data: {
                        academicYearId: academicYear.id,
                        subjectName,
                        marks,
                        unitTest1: Math.round((10 + Math.random() * 15) * 100) / 100,
                        unitTest2: Math.round((10 + Math.random() * 15) * 100) / 100,
                        unitTest3: Math.round((10 + Math.random() * 15) * 100) / 100,
                        iatScore: Math.round((30 + Math.random() * 20) * 100) / 100
                    }
                });
            }
        }
    }
    console.log('✅ Added academic records for all students');

    // Add attendance records
    for (const student of students) {
        if (!student.studentProfile) continue;

        const batchYear = parseInt(student.studentProfile.batch.split('-')[0]);
        const currentYear = 2026;
        const yearsCompleted = Math.min(4, Math.max(1, currentYear - batchYear));
        const currentYearSubjects = subjects[yearsCompleted];

        for (const subjectName of currentYearSubjects) {
            const totalClasses = 40 + Math.floor(Math.random() * 20);
            const attendedClasses = Math.floor(totalClasses * (0.5 + Math.random() * 0.5));
            const attendancePercent = Math.round((attendedClasses / totalClasses) * 100 * 100) / 100;

            await prisma.attendance.create({
                data: {
                    studentId: student.studentProfile.id,
                    subjectName,
                    attendancePercent,
                    totalClasses,
                    attendedClasses
                }
            });
        }
    }
    console.log('✅ Added attendance records for all students');

    // Add activities for some students
    const certifications = [
        { name: 'NPTEL - Python for Data Science', provider: 'NPTEL', year: 2024 },
        { name: 'AWS Cloud Practitioner', provider: 'AWS', year: 2024 },
        { name: 'Google Cloud Associate', provider: 'Google', year: 2023 },
        { name: 'Coursera - Machine Learning', provider: 'Coursera', year: 2024 }
    ];

    const hackathons = [
        { name: 'Smart India Hackathon', position: 'Finalist', year: 2024 },
        { name: 'HackTrix 2024', position: 'Winner', year: 2024 },
        { name: 'Code Sprint', position: 'Top 10', year: 2023 }
    ];

    const internships = [
        { company: 'TCS', role: 'Software Intern', duration: '2 months' },
        { company: 'Infosys', role: 'Data Analyst Intern', duration: '6 weeks' },
        { company: 'Zoho', role: 'Developer Intern', duration: '3 months' }
    ];

    for (let i = 0; i < students.length; i++) {
        const student = students[i];
        if (!student.studentProfile) continue;

        // Add activities for 60% of students
        if (Math.random() > 0.4) {
            await prisma.activities.create({
                data: {
                    studentId: student.studentProfile.id,
                    certifications: Math.random() > 0.5
                        ? certifications.slice(0, Math.floor(Math.random() * 3) + 1)
                        : [],
                    hackathons: Math.random() > 0.7
                        ? hackathons.slice(0, Math.floor(Math.random() * 2) + 1)
                        : [],
                    internships: Math.random() > 0.6
                        ? internships.slice(0, Math.floor(Math.random() * 2) + 1)
                        : [],
                    sports: Math.random() > 0.8
                        ? [{ event: 'Inter-college Cricket', year: 2024 }]
                        : [],
                    extracurricular: Math.random() > 0.7
                        ? [{ activity: 'NSS Volunteer', year: 2024 }]
                        : [],
                    scholarships: Math.random() > 0.9
                        ? [{ name: 'Merit Scholarship', amount: '₹25,000', year: 2024 }]
                        : [],
                    ecube: Math.random() > 0.85
                        ? [{ project: 'Startup Idea Pitch', year: 2024 }]
                        : []
                }
            });
        }
    }
    console.log('✅ Added activities for students');

    console.log('\n🎉 Database seeding completed!');
    console.log('\n📋 Login Credentials:');
    console.log('   Admin: admin@msec.edu.in / admin123');
    console.log('   Student: student1@msec.edu.in / student123');
}

main()
    .catch((e) => {
        console.error('❌ Seeding failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
