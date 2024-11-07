import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PlusCircle } from 'lucide-react'

async function getCourses() {
  // This function would fetch the courses from your backend
  // For now, we'll use placeholder data
  return [
    { id: '1', name: 'Computer Science', subname: 'BSc', years: 4 },
    { id: '2', name: 'Electrical Engineering', subname: 'BTech', years: 4 },
    { id: '3', name: 'Business Administration', subname: 'BBA', years: 3 },
  ]
}

export default async function CoursesOverview() {
  const courses = await getCourses()

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Courses Overview</h1>
        <Button asChild>
          <Link href="/admin/courses/new">
            <PlusCircle className="mr-2 h-4 w-4" /> Add New Course
          </Link>
        </Button>
      </div>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Subname</TableHead>
            <TableHead>Years</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {courses.map((course) => (
            <TableRow key={course.id}>
              <TableCell className="font-medium">{course.name}</TableCell>
              <TableCell>{course.subname}</TableCell>
              <TableCell>{course.years}</TableCell>
              <TableCell>
                <Button asChild variant="link">
                  <Link href={`/admin/courses/${course.id}`}>View Details</Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}