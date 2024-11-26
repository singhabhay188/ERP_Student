import prisma from '@/db'
import { NextRequest, NextResponse } from 'next/server'

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

export async function POST(req: NextRequest) {
  try {
      const body = await req.json();
      const { title, description, dueDate, mediaUrl, groupId, teacherId } = body;

      // Create assignment using Prisma
      const assignment = await prisma.assignment.create({
          data: {
              title,
              description,
              dueDate,
              mediaUrl,
              groupId,
              teacherId,
          },
      });

      return NextResponse.json(assignment, { status: 201 });

  } catch (error) {
      console.error("Failed to create assignment:", error);
      return NextResponse.json(
          { error: "Failed to create assignment" },
          { status: 500 }
      );
  }
}