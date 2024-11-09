import React from 'react'
import prisma from '@/db'
import { COLLEGE_ID } from '@/lib/const'
import AddTeacher from '@/components/admin/AddTeacher'

async function getTeachers() {
    const teachers = await prisma.teacher.findMany({
        where: {
            collegeId: COLLEGE_ID
        }
    });
    return teachers;
}

export default async function Page() {
    const teachers = await getTeachers();

    return (
        <div className="container mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Teachers Overview</h1>
                <AddTeacher />
            </div>
            <div className='flex flex-col gap-4'>
                {teachers.map((teacher) => (
                    <div key={teacher.id} className='border border-gray-500 p-4 rounded-md'>
                        <h2 className='text-lg font-bold capitalize'>{teacher.name}</h2>
                        <p className='text-sm text-gray-500'>Username: <span className='font-bold'>{teacher.username}</span></p>
                    </div>
                ))}
            </div>
        </div>
    )
}