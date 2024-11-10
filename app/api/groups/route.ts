import prisma from '@/db'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const groups = await prisma.group.findMany({
      include: {
        section: {
          include: {
            year: {
              include: {
                course: true
              }
            }
          }
        }
      }
    })

    return NextResponse.json(groups)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch groups' }, { status: 500 })
  }
} 