import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import prisma from '@/db'

export default async function EnrolledStudents() {
  const cookieStore = await cookies()
  const userCookie = cookieStore.get('user')
  
  if (!userCookie) {
    redirect('/login')
  }

  const userData = JSON.parse(userCookie.value)
  if (userData.type !== 'teacher') {
    redirect('/')
  }

  // Get all unique students from the teacher's classes
  const classes = await prisma.class.findMany({
    where: { teacherId: userData.id },
    include: {
      timetable: {
        include: {
          group: {
            include: {
              students: true,
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
  })

  // Get unique students across all classes
  const studentsMap = new Map()
  classes.forEach(cls => {
    cls.timetable.group?.students.forEach(student => {
      studentsMap.set(student.enrollment, {
        ...student,
        course: cls.timetable.group?.section.year.course.name,
        section: cls.timetable.group?.section.name,
        group: cls.timetable.group?.name
      })
    })
  })
  const students = Array.from(studentsMap.values())

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Enrolled Students</h1>
      <div className="grid gap-4">
        {students.map((student) => (
          <div key={student.enrollment} className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center gap-4">
              {student.imageUrl ? (
                <img src={student.imageUrl} alt={student.name} className="w-12 h-12 rounded-full" />
              ) : (
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-xl">{student.name[0]}</span>
                </div>
              )}
              <div>
                <h3 className="font-semibold">{student.name}</h3>
                <p className="text-sm text-gray-600">Enrollment: {student.enrollment}</p>
                <p className="text-sm text-gray-600">
                  {student.course} - Section {student.section} - Group {student.group}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 