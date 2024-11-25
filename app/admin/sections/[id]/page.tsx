import { getSection } from '@/actions/admin' // You'll need to create this action
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from 'next/link'
import MessageDisplayer from '@/components/admin/MessageDisplayer'
import AddGroupDialog from '@/components/admin/sections/AddGroupDialog' // You'll need to create this component

export default async function SectionDetails({ params }: { params: { id: string }}) {
  const section = await getSection(params.id);

  if(!section) return <MessageDisplayer message="Section not found" />;

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <Link 
            href={`/admin/courses/${section.year.courseId}`}
            className="text-sm text-muted-foreground hover:text-primary mb-2 block"
          >
            ← Back to Course
          </Link>
          <h1 className="text-3xl font-bold">Section {section.name}</h1>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Groups in this section</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex flex-col gap-4'>
            {section.groups.map((group) => (
              <div key={group.id} className='border border-gray-500 p-4 rounded-md'>
                <h2 className='text-lg font-bold capitalize'>{group.name}</h2>
                <p className='text-sm text-gray-500'>{group.students.length} students</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <AddGroupDialog sectionId={params.id} />
    </div>
  )
}