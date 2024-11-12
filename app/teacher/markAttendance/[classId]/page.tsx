'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import React from 'react'
import { useParams } from 'next/navigation'
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import MessageDisplayer from '@/components/admin/MessageDisplayer'
import { Loader2 } from "lucide-react"
import toast from 'react-hot-toast'

interface Student {
    enrollment: string,
    name: string
}

interface ClassData {
  id: string
  subject: {
    title: string
  }
  startTime: string
  timetable: {
    group: {
      id:string
      name: string
      students: Student[]
    }
  }
}

const MarkAttendancePage = () => {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [classData, setClassData] = useState<ClassData | null>(null)
  const [attendance, setAttendance] = useState<Record<string, boolean>>({})
  const [submitting, setSubmitting] = useState(false)

  const params = useParams<{ classId: string }>();
  const classId = params.classId;
  console.log(classId);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/classes/${classId}`)
        if (!response.ok) {
          throw new Error('Failed to fetch class data')
        }
        const data = await response.json()
        setClassData(data)
        setAttendance(
          Object.fromEntries(
            data.timetable.group.students.map(student => [student.enrollment, false])
          )
        )
      } catch (error) {
        console.error('Error fetching class data:', error)
        router.push('/teacher/markAttendance')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [classId, router])

  if (loading) {
    return <MessageDisplayer message='Loading Please Wait....' />
  }

  if (!classData) {
    return <MessageDisplayer message='Nothing to Display here....' />
  }

  const handleSubmit = async () => {
    try {
      setSubmitting(true)
      const response = await fetch('/api/attendance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          classId: classId,
          attendance,
          groupId: classData.timetable.group.id
        }),
      })
      
      if (!response.ok) throw new Error('Failed to save attendance')
      
      toast.success('Attendance has been saved successfully')
      router.push('/teacher/markAttendance')
    } catch (error) {
      console.error('Failed to save attendance:', error)
      toast.error('Failed to save attendance. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{classData.subject.title}</h1>
        <p className="text-gray-600">
          Group {classData.timetable.group.name} - 
          {new Date(classData.startTime).toLocaleDateString()}
        </p>
      </div>

      <div className="bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Roll No
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Student Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {classData.timetable.group.students.map((student) => (
              <tr key={student.enrollment}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {student.enrollment}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {student.name}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id={`attendance-${student.enrollment}`}
                      checked={attendance[student.enrollment]}
                      onCheckedChange={(checked) => 
                        setAttendance(prev => ({
                          ...prev,
                          [student.enrollment]: checked
                        }))
                      }
                    />
                    <Label htmlFor={`attendance-${student.enrollment}`} className={
                      attendance[student.enrollment] 
                        ? "text-green-600 font-medium" 
                        : "text-red-600 font-medium"
                    }>
                      {attendance[student.enrollment] ? 'Present' : 'Absent'}
                    </Label>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/70 focus:ring-offset-2 disabled:opacity-50 flex items-center gap-2"
        >
          {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
          {submitting ? 'Saving...' : 'Save Attendance'}
        </button>
      </div>
    </div>
  )
}

export default MarkAttendancePage