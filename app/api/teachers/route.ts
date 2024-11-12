import { NextResponse } from 'next/server'
import prisma from '@/db'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const subjectId = searchParams.get('subjectId')

    if (!subjectId) {
      return new NextResponse('Subject ID is required', { status: 400 })
    }

    const teachers = await prisma.teacher.findMany({
      where: {
        subjects: {
          some: {
            id: subjectId
          }
        }
      },
      select: {
        id: true,
        name: true
      }
    })

    return NextResponse.json(teachers)
  } catch (error) {
    console.error('Error fetching teachers:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
