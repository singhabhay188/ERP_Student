'use server';

import prisma from "@/db";
import { CourseFormData, StudentFormData, TeacherFormData } from "@/utils/types";

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
    try {
        data.name = data.name.toLowerCase();
        data.subname = data.subname.toLowerCase();

        // Check for existing course
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

        const totalSemesters = data.expectedYears * 2;

        // Create course and semesters in a transaction
        const course = await prisma.$transaction(async (tx) => {
            const course = await tx.course.create({
                data: {
                    name: data.name,
                    subname: data.subname,
                    collegeId: data.collegeId,
                },
            });

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

        return { success: true, data: course };  // Explicit success response
    } catch (error) {
        if (error instanceof Error) {
            throw error;
        }
        throw new Error('Failed to create course');
    }
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

export async function createStudent(data: StudentFormData) {
    // Check for existing student with same enrollment
    const existingStudent = await prisma.student.findUnique({
        where: {
            enrollment: data.enrollment
        }
    });

    if (existingStudent) {
        throw new Error('A student with this enrollment number already exists');
    }

    // Create the student
    return await prisma.student.create({
        data: {
            enrollment: data.enrollment,
            name: data.name.toLowerCase(),
            password: data.password,
            collegeId: data.collegeId,
            totalAttended: 0  // Setting default value as per schema
        }
    });
}

export async function createTeacher(data: TeacherFormData) {
    // Check for existing teacher with same username
    const existingTeacher = await prisma.teacher.findFirst({
        where: {
            username: data.username.toLowerCase()
        }
    });

    if (existingTeacher) {
        throw new Error('A teacher with this username already exists');
    }

    return await prisma.$transaction(async (tx) => {
        // Create timetable first
        const timetable = await tx.timetable.create({
            data: {}
        });

        const teacher = await tx.teacher.create({
            data: {
                name: data.name.toLowerCase(),
                username: data.username.toLowerCase(),
                password: data.password,
                collegeId: data.collegeId,
                timetableId: timetable.id
            }
        });

        await tx.timetable.update({
            where: { id: timetable.id },
            data: { teacherId: teacher.id }
        });

        return teacher;
    });
}

export async function getSection(id: string) {
    const section = await prisma.section.findUnique({
        where: { id },
        include: {
            year: true,
            groups: {
                include: {
                    students: true,
                }
            }
        }
    });
    return section;
}

export async function createGroup(sectionId: string, name: string) {
    const group = await prisma.group.create({
        data: {
            name,
            sectionId,
        }
    });
    return group;
}

export async function createSubject(data: { code: string; title: string }) {
    // Check for existing subject with same code
    const existingSubject = await prisma.subject.findFirst({
        where: {
            code: data.code.toUpperCase()
        }
    });

    if (existingSubject) {
        throw new Error('A subject with this code already exists');
    }

    // Create the subject
    return await prisma.subject.create({
        data: {
            code: data.code.toUpperCase(),
            title: data.title
        }
    });
}
