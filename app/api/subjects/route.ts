import prisma from '@/db'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const subjects = await prisma.subject.findMany()
    return NextResponse.json(subjects)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch subjects' }, { status: 500 })
  }
} 