import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import prisma from '@/db'
import { COLLEGE_ID } from '@/lib/const'
import AddCourse from '@/components/admin/AddCourse'

async function getCourses() {
  let courses = await prisma.course.findMany({
    where: {
      collegeId: COLLEGE_ID
    },
    include: {
      years: true
    }
  });

  return courses;
}

export default async function CoursesOverview() {
  const courses = await getCourses();
  console.log(courses);

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Courses Overview</h1>
        <AddCourse />
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
              <TableCell className="font-medium capitalize">{course.name}</TableCell>
              <TableCell className="text-muted-foreground uppercase">{course.subname}</TableCell>
              <TableCell>{course.years?.length/2 || 0}</TableCell>
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