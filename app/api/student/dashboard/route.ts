import { NextResponse } from 'next/server'
import prisma from '@/db'

export async function GET() {
  try {
    // here we are using fixed enrollment
    const enrollment = "10525502721"

    const student = await prisma.student.findUnique({
      where: {
        enrollment: enrollment,
      },
      select: {
        enrollment: true,
        name: true,
        totalAttended: true,
        imageUrl: true,
        group: {
          select: {
            name: true,
            totalClasses: true,
            timetable: {
              select: {
                class: {
                  select: {
                    day: true,
                    startTime: true,
                    endTime: true,
                    subject: {
                      select: {
                        code: true,
                        title: true,
                      },
                    },
                  },
                  orderBy: [
                    { day: 'asc' },
                    { startTime: 'asc' },
                  ],
                },
              },
            },
          },
        },
      },
    });

    if (!student) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(student)
  } catch (error) {
    console.error('Error fetching student data:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 