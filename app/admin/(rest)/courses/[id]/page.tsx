import { getCourseDetails } from '@/actions/admin'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { PlusCircle } from 'lucide-react'
import Link from 'next/link'
import MessageDisplayer from '@/components/admin/MessageDisplayer'

export default async function CourseDetails({ params }: { params: { id: string }}) {
  const course = await getCourseDetails(params.id);

  if(!course) return <MessageDisplayer message="Course not found" />;

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <Link 
            href="/admin/courses" 
            className="text-sm text-muted-foreground hover:text-primary mb-2 block"
          >
            ← Back to Courses
          </Link>
          <h1 className="text-3xl font-bold uppercase">{course.name} ({course.subname})</h1>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Course Details</CardTitle>
        </CardHeader>
        <CardContent>
          <p><strong>Name:</strong> {course.name.toUpperCase()}</p>
          <p><strong>Subname:</strong> {course.subname.toUpperCase()}</p>
          <p><strong>Total Years:</strong> {course.years.length/2}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>Semesters and Sections</CardTitle>
          <Button size="sm" disabled>
            <PlusCircle className="mr-2 h-4 w-4" /> Add Semester
          </Button>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {course.years.map((year) => (
              <AccordionItem key={year.id} value={year.id}>
                <AccordionTrigger>Semester {year.semNum}</AccordionTrigger>
                <AccordionContent>
                  <div className="pl-4 space-y-2">
                    <div className="flex justify-between items-center">
                      <h4 className="font-semibold">Sections</h4>
                      <Button size="sm" variant="outline">
                        <PlusCircle className="mr-2 h-4 w-4" /> Add Section
                      </Button>
                    </div>
                    {year.sections?.map((section) => (
                      <div key={section.id} className="flex justify-between items-center p-2 bg-secondary/20 rounded-md">
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