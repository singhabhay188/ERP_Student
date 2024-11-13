import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/db'
import { cookies } from 'next/headers';

export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const user = JSON.parse(cookieStore.get('user')?.value || '{}');
    
    if(!user || user.type !== 'student') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const enrollment = user.id;

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