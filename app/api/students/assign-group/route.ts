import prisma from "@/db"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { studentIds, groupId } = body

    await prisma.student.updateMany({
      where: {
        enrollment: {
          in: studentIds
        }
      },
      data: {
        groupId
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 })
  }
} 