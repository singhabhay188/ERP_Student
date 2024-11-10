import { NextResponse } from 'next/server'
import prisma from '@/db'

export async function POST(request: Request) {
    try {
        const { subjectId, teacherId } = await request.json()

        const updatedSubject = await prisma.subject.update({
            where: { id: subjectId },
            data: {
                teachers: {
                    connect: { id: teacherId }
                }
            }
        })

        return NextResponse.json(updatedSubject)
    } catch (error) {
        console.error('Error adding teacher to subject:', error)
        return NextResponse.json(
            { error: 'Failed to add teacher to subject' },
            { status: 500 }
        )
    }
} 