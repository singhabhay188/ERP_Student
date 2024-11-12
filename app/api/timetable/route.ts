import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { groupId, classes } = body

    if (!groupId || !classes || !Array.isArray(classes)) {
      return NextResponse.json(
        { error: 'Invalid request data' },
        { status: 400 }
      )
    }

    // Start a transaction to handle both group and teacher timetables
    await prisma.$transaction(async (tx) => {
      // Delete existing timetable and classes for the group if they exist
      const existingTimetable = await tx.timetable.findUnique({
        where: { groupId },
        include: { class: true }
      })

      //if timetable is found we will delete first the classes then timetable
      if (existingTimetable) {
        await tx.class.deleteMany({
          where: { timetableId: existingTimetable.id }
        });
        await tx.timetable.delete({
          where: { id: existingTimetable.id }
        });
      }

      // Create or update group's timetable
      const groupTimetable = await tx.timetable.upsert({
        where: { groupId },
        create: { groupId },
        update: {}
      });

      // Create classes and update teacher timetables
      for (const classData of classes) {
        const { teacherId, ...classDetails } = classData

        // Create single class with just group timetable and teacher reference
        const newClass = await tx.class.create({
          data: {
            ...classDetails,
            timetableId: groupTimetable.id,  // Link to group's timetable
            teacherId: teacherId             // Direct link to teacher
          }
        })
      }
    })

    return NextResponse.json({ message: 'Timetable updated successfully' })
  } catch (error) {
    console.error('Error updating timetable:', error)
    return NextResponse.json(
      { error: 'Failed to update timetable' },
      { status: 500 }
    )
  }
}

// GET route to fetch timetable for a group
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const groupId = searchParams.get('groupId')

    if (!groupId) {
      return NextResponse.json(
        { error: 'Group ID is required' },
        { status: 400 }
      )
    }

    const timetable = await prisma.timetable.findUnique({
      where: { groupId },
      include: {
        class: {
          include: {
            subject: true,
            teacher: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      }
    })

    return NextResponse.json(timetable)
  } catch (error) {
    console.error('Error fetching timetable:', error)
    return NextResponse.json(
      { error: 'Failed to fetch timetable' },
      { status: 500 }
    )
  }
} 