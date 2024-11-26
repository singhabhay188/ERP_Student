import prisma from '@/db'
import { getUserData } from '@/utils/auth';

export default async function ManageAssignments() {
  const userData = await getUserData();

  const teacher = await prisma.teacher.findUnique({
    where: { id: userData.id },
    include: {
      subjects: true,
      classes: {
        include: {
          timetable: {
            include: {
              group: {
                include: {
                  section: {
                    include: {
                      year: {
                        include: {
                          course: true
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  })

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Assignments</h1>
        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Create New Assignment
        </button>
      </div>

      {/* Subject-wise Assignment Sections */}
      {teacher?.subjects.map((subject) => (
        <div key={subject.id} className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">{subject.title}</h2>
          
          {/* Sample Assignment Cards */}
          <div className="space-y-4">
            <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">Assignment 1: Introduction</h3>
                  <p className="text-gray-600 text-sm mt-1">Due Date: </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

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