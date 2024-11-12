import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import prisma from '@/db'
import { useParams } from 'next/navigation'

export async function GET(
  request: Request,
  { params }: { params: { classId: string } }
) {
  try {
    const cookieStore = cookies()
    const userCookie = (await cookieStore).get('user')
    
    if (!userCookie) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { classId } = await params

    const classData = await prisma.class.findUnique({
      where: { id:classId },
      include: {
        subject: true,
        timetable: {
          include: {
            group: {
              include: {
                students: {
                  orderBy: { enrollment: 'asc' }
                }
              }
            }
          }
        }
      }
    })

    if (!classData) {
      return new NextResponse('Class not found', { status: 404 })
    }

    return NextResponse.json(classData)
  } catch (error) {
    console.error('Error fetching class data:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 