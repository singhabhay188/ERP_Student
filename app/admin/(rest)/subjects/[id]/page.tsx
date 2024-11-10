import prisma from '@/db'
import { notFound } from 'next/navigation'
import AddTeacherToSubject from '@/components/admin/AddTeacherToSubject'

async function getSubjectWithTeachers(id: string) {
    const subject = await prisma.subject.findUnique({
        where: { id },
        include: {
            teachers: true
        }
    })
    if (!subject) notFound()
    return subject
}

export default async function SubjectPage({ params }: { params: { id: string } }) {
    const subject = await getSubjectWithTeachers(params.id)

    return (
        <div className="container mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold uppercase">{subject.code}</h1>
                    <p className="text-gray-500 capitalize">{subject.title}</p>
                </div>
                <AddTeacherToSubject subjectId={subject.id} />
            </div>

            <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">Teachers</h2>
                <div className="grid gap-4">
                    {subject.teachers.map((teacher) => (
                        <div key={teacher.id} className="border p-4 rounded-md">
                            <p className="font-medium uppercase">{teacher.name}</p>
                            <p className="text-sm text-gray-500">Username: <span className="font-medium">{teacher.username}</span></p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
} 