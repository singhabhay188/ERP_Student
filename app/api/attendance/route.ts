import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import prisma from '@/db'

export async function POST(request: Request) {
  try {
    const cookieStore = cookies()
    const userCookie = (await cookieStore).get('user')
    
    if (!userCookie) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { classId, attendance, groupId } = await request.json()

    // Validate input
    if (!classId || !attendance || !groupId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Verify class exists and belongs to the group
    const classExists = await prisma.class.findFirst({
      where: {
        id: classId,
        timetable: {
          groupId: groupId
        }
      }
    })

    if (!classExists) {
      return NextResponse.json(
        { error: 'Invalid class or group' },
        { status: 400 }
      )
    }

    // Check for existing attendance records for this class
    const existingAttendance = await prisma.attendance.findFirst({
      where: {
        classId: classId
      }
    })

    if (existingAttendance) {
      return NextResponse.json(
        { error: 'Attendance already marked for this class' },
        { status: 400 }
      )
    }

    // Create attendance records and update student totals in a transaction
    await prisma.$transaction(async (tx) => {
      // Create attendance records
      const attendanceRecords = Object.entries(attendance).map(([studentId, isPresent]) => ({
        classId,
        studentEnrollment: studentId,
        isPresent: Boolean(isPresent),
        date: new Date(),
      }))

      await tx.attendance.createMany({
        data: attendanceRecords
      })

      // Update totalAttended for each present student
      for (const [studentId, isPresent] of Object.entries(attendance)) {
        if (isPresent) {
          await tx.student.update({
            where: { enrollment: studentId },
            data: {
              totalAttended: {
                increment: 1
              }
            }
          })
        }
      }

      // Update group's totalClasses
      await tx.group.update({
        where: { id: groupId },
        data: {
          totalClasses: {
            increment: 1
          }
        }
      })
    })

    return NextResponse.json({ 
      success: true,
      message: 'Attendance marked successfully'
    })

  } catch (error) {
    console.error('Error saving attendance:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
} 