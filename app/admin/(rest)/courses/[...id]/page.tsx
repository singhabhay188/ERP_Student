'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { PlusCircle } from 'lucide-react'

function getCourseDetails(id: string) {
  // This function would fetch the course details from your backend
  // For now, we'll use placeholder data
  return {
    id,
    name: 'Computer Science',
    subname: 'BSc',
    years: 4,
    semesters: [
      {
        id: '1',
        semNum: 1,
        sections: [
          { id: '1', name: 'A' },
          { id: '2', name: 'B' },
        ]
      },
      {
        id: '2',
        semNum: 2,
        sections: [
          { id: '3', name: 'A' },
          { id: '4', name: 'B' },
        ]
      },
    ]
  }
}

export default function CourseDetails({ params }: { params: { id: string } }) {
  const [course, setCourse] = useState(() => getCourseDetails(params.id))

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{course.name} ({course.subname})</h1>
        <Button asChild>
          <Link href={`/admin/courses/${params.id}/edit`}>Edit Course</Link>
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Course Details</CardTitle>
        </CardHeader>
        <CardContent>
          <p><strong>Name:</strong> {course.name}</p>
          <p><strong>Subname:</strong> {course.subname}</p>
          <p><strong>Years:</strong> {course.years}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>Semesters and Sections</CardTitle>
          <Button size="sm">
            <PlusCircle className="mr-2 h-4 w-4" /> Add Semester
          </Button>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {course.semesters.map((semester) => (
              <AccordionItem key={semester.id} value={semester.id}>
                <AccordionTrigger>Semester {semester.semNum}</AccordionTrigger>
                <AccordionContent>
                  <div className="pl-4 space-y-2">
                    <div className="flex justify-between items-center">
                      <h4 className="font-semibold">Sections</h4>
                      <Button size="sm" variant="outline">
                        <PlusCircle className="mr-2 h-4 w-4" /> Add Section
                      </Button>
                    </div>
                    {semester.sections.map((section) => (
                      <div key={section.id} className="flex justify-between items-center">
                        <span>Section {section.name}</span>
                        <Button size="sm" variant="link">View Details</Button>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  )
}