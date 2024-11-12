import prisma from "@/db"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const students = await prisma.student.findMany({
      where: {
        groupId: null
      },
      orderBy: {
        name: 'asc'
      }
    })
    return NextResponse.json(students)
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 })
  }
} 