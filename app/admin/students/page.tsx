import React from 'react'
import prisma from '@/db'
import { COLLEGE_ID } from '@/lib/const'
import AddStudent from '@/components/admin/AddStudent';
import Image from 'next/image';

async function getStudents() {
    const students = await prisma.student.findMany({
        where: {
            collegeId: COLLEGE_ID
        },
        include: {
            group: true
        }
    });
  
    return students;
}

export default async function page() {
    const students = await getStudents();

    return (
        <div className="container mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Students Overview</h1>
                <AddStudent />
            </div>
            <div className='flex flex-col gap-4'>
                {students.map((student) => (
                    <div key={student.enrollment} className='border border-gray-500 p-4 rounded-md flex items-center justify-between'>
                        <div>
                            <h2 className='text-lg font-bold capitalize'>{student.name}</h2>
                            <p className='text-sm text-gray-500'>{student.enrollment}</p>

                            {student.group ? (
                                <p className='text-sm text-gray-500'>{student.group.name}</p>
                            ) : (
                                <p className='text-sm text-gray-500'>No group assigned</p>
                            )}
                        </div>
                        <div className='flex items-center gap-2'>
                            <Image
                                src={student.imageUrl || 'https://cdn-icons-png.flaticon.com/512/6858/6858504.png'}
                                alt={student.name}
                                width={50}
                                height={50}
                                className="rounded-full"
                                unoptimized
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}