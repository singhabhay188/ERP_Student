import { getCourseDetails } from '@/actions/admin'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { PlusCircle } from 'lucide-react'
import Link from 'next/link'
import MessageDisplayer from '@/components/admin/MessageDisplayer'
import { createSection } from '@/actions/admin'
import AddSectionDialog from '@/components/admin/courses/AddSectionDialog'

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
                <AccordionTrigger>
                  <div className="flex justify-between items-center w-full pr-4">
                    <span>Semester {year.semNum}</span>
                    <span className="text-sm text-muted-foreground">
                      {year.sections?.length || 0} Sections
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="pl-4 space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="font-semibold">Sections</h4>
                      <AddSectionDialog semesterId={year.id} />
                    </div>
                    
                    {year.sections?.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No sections found</p>
                    ) : (
                      <div className="grid gap-2">
                        {year.sections?.map((section) => (
                          <div 
                            key={section.id} 
                            className="flex justify-between items-center p-3 bg-secondary/20 rounded-md hover:bg-secondary/30 transition-colors"
                          >
                            <div>
                              <span className="font-medium">Section {section.name}</span>
                              <span className="text-sm text-muted-foreground ml-2">
                                ({section.groups?.length || 0} Groups)
                              </span>
                            </div>
                            <Button size="sm" variant="link" asChild>
                              <Link href={`/admin/sections/${section.id}`}>
                                View Details
                              </Link>
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
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