import React from 'react'
import AddSubject from '@/components/admin/AddSubject'
import prisma from '@/db'

export async function getSubjects() {
    return await prisma.subject.findMany({
        orderBy: {
            code: 'asc'
        }
    });
}

export default async function page() {
  const subjects = await getSubjects();

  return (
    <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Subjects Overview</h1>
            <AddSubject />
        </div>
        <div className='flex flex-col gap-4'>
            {subjects.map((subject) => (
                <a 
                    href={`/admin/subjects/${subject.id}`} 
                    key={subject.id} 
                    className='border border-gray-500 p-4 rounded-md hover:bg-gray-50 transition-colors'
                >
                    <h2 className='text-lg font-bold uppercase'>{subject.code}</h2>
                    <p className='text-sm text-gray-500 capitalize'>{subject.title}</p>
                </a>
            ))}
        </div>
    </div>
  )
}