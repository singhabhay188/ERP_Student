'use server';

import prisma from "@/db";

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