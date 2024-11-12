import { NextResponse } from 'next/server'
import prisma from '@/db'

export async function GET(
    request: Request,
    { params }: { params: { subjectId: string } }
) {
    try {
        // Get all teachers that are not already assigned to this subject
        const teachers = await prisma.teacher.findMany({
            where: {
                NOT: {
                    subjects: {
                        some: {
                            id: params.subjectId
                        }
                    }
                }
            },
            select: {
                id: true,
                name: true,
                username: true
            }
        })

        return NextResponse.json(teachers)
    } catch (error) {
        console.error('Error fetching available teachers:', error)
        return NextResponse.json(
            { error: 'Failed to fetch teachers' },
            { status: 500 }
        )
    }
} 