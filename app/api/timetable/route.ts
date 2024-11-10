import prisma from '@/db'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const groupId = searchParams.get('groupId')

  if (!groupId) {
    return NextResponse.json({ error: 'Group ID is required' }, { status: 400 })
  }

  try {
    const timetable = await prisma.timetable.findUnique({
      where: { groupId },
      include: {
        class: {
          include: {
            subject: true
          }
        }
      }
    })

    return NextResponse.json(timetable)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch timetable' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const body = await request.json()
  const { groupId, classes } = body

  try {
    // Create or update timetable
    const timetable = await prisma.timetable.upsert({
      where: { groupId },
      create: { groupId },
      update: {},
    })

    // Delete existing classes
    await prisma.class.deleteMany({
      where: { timetableId: timetable.id }
    })

    // Create new classes
    const classPromises = classes.map((classData: any) =>
      prisma.class.create({
        data: {
          day: classData.day,
          startTime: new Date(classData.startTime),
          endTime: new Date(classData.endTime),
          subjectId: classData.subjectId,
          timetableId: timetable.id
        }
      })
    )

    await Promise.all(classPromises)

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save timetable' }, { status: 500 })
  }
} 