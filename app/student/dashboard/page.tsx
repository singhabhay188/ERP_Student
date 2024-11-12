'use client'
import React, { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Loader2 } from "lucide-react"

const daysMap: Record<string, string> = {
  MONDAY: 'Monday',
  TUESDAY: 'Tuesday',
  WEDNESDAY: 'Wednesday',
  THURSDAY: 'Thursday',
  FRIDAY: 'Friday',
  SATURDAY: 'Saturday',
  SUNDAY: 'Sunday',
}

interface StudentData {
  enrollment: string
  name: string
  totalAttended: number
  imageUrl: string | null
  group: {
    name: string
    totalClasses: number
    timetable: {
      class: {
        day: string
        startTime: string
        endTime: string
        subject: {
          code: string
          title: string
        }
      }[]
    }
  }
}

const StudentDashboard = () => {
  const [student, setStudent] = useState<StudentData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const response = await fetch('/api/student/dashboard')
        if (!response.ok) {
          throw new Error('Failed to fetch student data')
        }
        const data = await response.json()
        setStudent(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong')
      } finally {
        setLoading(false)
      }
    }

    fetchStudentData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (error || !student) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-6">
            <p className="text-red-500">
              {error || 'Unable to load student data'}
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const attendancePercentage = Math.round(
    (student.totalAttended / student.group.totalClasses) * 100
  )

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Student Profile Card */}
      <Card>
        <CardContent className="flex items-center gap-6 p-6">
          <Avatar className="h-24 w-24">
            <AvatarImage src={student.imageUrl || undefined} />
            <AvatarFallback>{student.name[0]}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">{student.name}</h1>
            <p className="text-gray-500">Enrollment: {student.enrollment}</p>
            <p className="text-gray-500">Group: {student.group.name}</p>
          </div>
        </CardContent>
      </Card>

      {/* Attendance Overview */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4">Attendance Overview</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Overall Attendance</span>
              <span>{isNaN(attendancePercentage) ? 0 : attendancePercentage}%</span>
            </div>
            <Progress value={attendancePercentage} className="h-2" />
            <div className="flex justify-between text-sm text-gray-500">
              <span>Classes Attended: {student.totalAttended}</span>
              <span>Total Classes: {student.group.totalClasses}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timetable */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4">Class Schedule</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Day</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Subject Code</TableHead>
                <TableHead>Subject</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {student.group.timetable.class.map((classItem, index) => (
                <TableRow key={index}>
                  <TableCell>{daysMap[classItem.day]}</TableCell>
                  <TableCell>
                    {new Date(classItem.startTime).toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })} - {new Date(classItem.endTime).toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </TableCell>
                  <TableCell>{classItem.subject.code}</TableCell>
                  <TableCell>{classItem.subject.title}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

export default StudentDashboard