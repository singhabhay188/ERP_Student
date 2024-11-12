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

    const { classId, attendance } = await request.json()

    // Create attendance records
    const attendanceRecords = Object.entries(attendance).map(([studentId, isPresent]) => ({
      classId,
      studentEnrollment:studentId,
      isPresent: isPresent ? true : false,
      date: new Date(),
    }))

    await prisma.attendance.createMany({
      data: attendanceRecords
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving attendance:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 