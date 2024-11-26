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