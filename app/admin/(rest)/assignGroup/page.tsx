"use client"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Group, Student } from "@prisma/client"
import { ScrollArea } from "@/components/ui/scroll-area"
import toast, { Toaster } from 'react-hot-toast';

interface StudentWithSelection extends Student {
  isSelected?: boolean
}

export default function AssignGroupPage() {
  const [students, setStudents] = useState<StudentWithSelection[]>([])
  const [groups, setGroups] = useState<Group[]>([])
  const [selectedGroup, setSelectedGroup] = useState<string>("")
  const [selectedStudents, setSelectedStudents] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)

  // Fetch unassigned students and groups
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [studentsRes, groupsRes] = await Promise.all([
          fetch('/api/students/unassigned'),
          fetch('/api/groups')
        ])
        const studentsData = await studentsRes.json()
        const groupsData = await groupsRes.json()
        setStudents(studentsData)
        setGroups(groupsData)
      } catch (error) {
        toast.error('Failed to fetch data')
      } finally {
        setInitialLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleSelectStudent = (enrollment: string) => {
    setSelectedStudents(prev =>
      prev.includes(enrollment)
        ? prev.filter(id => id !== enrollment)
        : [...prev, enrollment]
    )
  }

  const handleSelectAll = () => {
    if (selectedStudents.length === students.length) {
      setSelectedStudents([])
    } else {
      setSelectedStudents(students.map(student => student.enrollment))
    }
  }

  const handleAssignStudents = async () => {
    if (!selectedGroup || selectedStudents.length === 0) return

    setLoading(true)
    try {
      const response = await fetch('/api/students/assign-group', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentIds: selectedStudents,
          groupId: selectedGroup
        })
      })

      if (response.ok) {
        // Remove assigned students from the list
        setStudents(prev =>
          prev.filter(student => !selectedStudents.includes(student.enrollment))
        )
        setSelectedStudents([])
        toast.success('Students assigned successfully')
      }
    } catch (error) {
      toast.error('Failed to assign students')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6">
      <Toaster />
      {/* Overlay Loader */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 bg-white" />
        </div>
      )}
      
      {initialLoading ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
        </div>
      ) : (
        <>
          <h1 className="text-2xl font-bold mb-6">Assign Students to Groups</h1>

          <div className="grid grid-cols-2 gap-6">
            {/* Left Side - Students List */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={selectedStudents.length === students.length}
                      onCheckedChange={handleSelectAll}
                    />
                    <span>Unassigned Students</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {students.length} students
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px] w-full pr-4">
                  <div className="space-y-2">
                    {students.map((student) => (
                      <div
                        key={student.enrollment}
                        className="flex items-center gap-2 p-2 border rounded-lg hover:bg-accent"
                      >
                        <Checkbox
                          checked={selectedStudents.includes(student.enrollment)}
                          onCheckedChange={() => handleSelectStudent(student.enrollment)}
                        />
                        <div>
                          <p className="font-medium">{student.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {student.enrollment}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Right Side - Group Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Select Group</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="mb-6">
                  <Select
                    value={selectedGroup}
                    onValueChange={setSelectedGroup}
                  >
                    <SelectTrigger className="w-[300px]">
                      <SelectValue placeholder="Select Group" />
                    </SelectTrigger>
                    <SelectContent>
                      {groups.map((group) => (
                        <SelectItem key={group.id} value={group.id}>
                          {group.section.year.course.name} - {group.section.year.course.subname || ''} - Year {group.section.year.semNum} - {group.section.name} - {group.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  className="w-full"
                  disabled={!selectedGroup || selectedStudents.length === 0 || loading}
                  onClick={handleAssignStudents}
                >
                  {loading ? 'Assigning...' : `Assign Selected Students (${selectedStudents.length})`}
                </Button>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  )
}