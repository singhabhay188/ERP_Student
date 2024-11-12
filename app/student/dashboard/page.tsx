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

const daysMap: Record<string, string> = {
  MONDAY: 'Monday',
  TUESDAY: 'Tuesday',
  WEDNESDAY: 'Wednesday',
  THURSDAY: 'Thursday',
  FRIDAY: 'Friday',
  SATURDAY: 'Saturday',
  SUNDAY: 'Sunday',
}

const StudentDashboard = () => {
  const [student, setStudent] = useState({
    enrollment: 'EN2024001',
    name: 'John Doe',
    totalAttended: 42,
    imageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
    group: {
      name: 'CSE-A1',
      totalClasses: 50,
      timetable: {
        class: [
          {
            day: 'MONDAY',
            startTime: '09:00',
            endTime: '10:00',
            subject: {
              code: 'CS101',
              title: 'Introduction to Programming',
            },
          },
          {
            day: 'MONDAY',
            startTime: '10:00',
            endTime: '11:00',
            subject: {
              code: 'CS102',
              title: 'Data Structures',
            },
          },
          {
            day: 'TUESDAY',
            startTime: '09:00',
            endTime: '10:00',
            subject: {
              code: 'CS103',
              title: 'Database Management',
            },
          },
        ],
      },
    },
  })

  const attendancePercentage = student
    ? Math.round((student.totalAttended / student.group!.totalClasses) * 100)
    : 0

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Student Profile Card */}
      <Card>
        <CardContent className="flex items-center gap-6 p-6">
          <Avatar className="h-24 w-24">
            <AvatarImage src={student?.imageUrl} />
            <AvatarFallback>{student?.name[0]}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">{student?.name}</h1>
            <p className="text-gray-500">Enrollment: {student?.enrollment}</p>
            <p className="text-gray-500">Group: {student?.group?.name}</p>
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
              <span>{attendancePercentage}%</span>
            </div>
            <Progress value={attendancePercentage} className="h-2" />
            <div className="flex justify-between text-sm text-gray-500">
              <span>Classes Attended: {student?.totalAttended}</span>
              <span>Total Classes: {student?.group?.totalClasses}</span>
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
              {student?.group?.timetable?.class.map((classItem, index) => (
                <TableRow key={index}>
                  <TableCell>{daysMap[classItem.day]}</TableCell>
                  <TableCell>
                    {classItem.startTime} - {classItem.endTime}
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