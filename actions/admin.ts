'use server';

import prisma from "@/db";
import { CourseFormData } from "@/utils/types";

export async function adminSignIn({email,password}:{email:string,password:string}) {
    await new Promise((resolve) => setTimeout(resolve, 2000));

    if(email === 'testing@gmail.com' && password === 'Tester@1234'){
        return true;
    }
    else throw new Error('Invalid email or password');
}

export async function getDashboardData(collegeId: string) {
    const data = await prisma.college.findUnique({
        where: {
            id: collegeId,
        },
        include: {
            courses: {
                include: {
                    _count: { // Count the number of courses directly
                        select: {
                            years: true, // count of years per course
                        },
                    },
                    years: {
                        include: {
                            sections: {
                                include: {
                                    groups: {
                                        include: {
                                            _count: {
                                                select: {
                                                    students: true, // count of students per group
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
    });

    // Initialize counts
    let totalStudents = 0;
    let totalCourses = 0;

    if (data && data.courses) {
        // Count total number of courses
        totalCourses = data.courses.length;

        // Calculate total number of students by summing the students per group
        data.courses.forEach(course => {
            course.years.forEach(year => {
                year.sections.forEach(section => {
                    section.groups.forEach(group => {
                        totalStudents += group._count.students; // Sum the student count from each group
                    });
                });
            });
        });
    }

    return {
        college: data, // Return full college data with courses, years, sections, and groups
        totalStudents, // Return total number of students
        totalCourses, // Return total number of courses
    };
}

export async function createCourse(data: CourseFormData) {
    data.name = data.name.toLowerCase();
    data.subname = data.subname.toLowerCase();

    // Check for existing course with same name and subname
    const existingCourse = await prisma.course.findFirst({
        where: {
            AND: [
                { name: data.name },
                { subname: data.subname },
                { collegeId: data.collegeId }
            ]
        }
    });

    if (existingCourse) {
        throw new Error('A course with this name and subname already exists');
    }

    // Calculate total number of semesters (2 per year)
    const totalSemesters = data.expectedYears * 2;

    // Create course and semesters in a transaction
    return await prisma.$transaction(async (tx) => {
        // Create the course first
        const course = await tx.course.create({
            data: {
                name: data.name,
                subname: data.subname,
                collegeId: data.collegeId,
            },
        });

        // Create semesters for the course
        const semesterPromises = Array.from({ length: totalSemesters }, (_, i) => {
            return tx.semester.create({
                data: {
                    semNum: i + 1,
                    courseId: course.id,
                }
            });
        });

        await Promise.all(semesterPromises);

        return course;
    });
}

export async function getCourseDetails(id: string) {
    if(!id) throw new Error('Course ID is required');
    const course = await prisma.course.findUnique({
        where: { id },
        include: {
            years: {
                include: {
                    sections: {
                        include: {
                            groups: true
                        }
                    }
                }
            }
        }
    });
    if(!course) return null;
    return course;
}

export async function createSection(semesterId: string, name: string) {
    if (!semesterId || !name) throw new Error('Semester ID and name are required');
    
    const existingSection = await prisma.section.findFirst({
        where: {
            yearId:semesterId,
            name
        }
    });

    if (existingSection) {
        throw new Error('A section with this name already exists in this semester');
    }

    return await prisma.section.create({
        data: {
            name,
            yearId: semesterId
        }
    });
}
