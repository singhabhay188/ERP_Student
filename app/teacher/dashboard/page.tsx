import { cookies } from 'next/headers'
import { format } from 'date-fns'
import { WORKING_DAYS, TIME_SLOTS, getTodayDay } from '@/utils/const'
import { redirect } from 'next/navigation'
import prisma from '@/db'

export default async function TeacherHome() {
  const cookieStore = await cookies()
  const userCookie = cookieStore.get('user')
  // {"type":"teacher","id":"15a561fb-5913-47c4-b8d4-8b9e6c64de72"}
  
  if (!userCookie) {
    redirect('/login')
  }

  const userData = JSON.parse(userCookie.value)
  if (userData.type !== 'teacher') {
    redirect('/')
  }

  const teacher = await prisma.teacher.findUnique({
    where: { id: userData.id },
    include: {
      subjects: true,
      college: true,
      classes: {
        include: {
          subject: true,
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

  if (!teacher) {
    return <div className='p-8'>Teacher not found</div>
  }

  const today = new Date()
  const currentDay = getTodayDay()

  return (
    <div className="container mx-auto p-6">
      {/* Teacher Profile Section */}
      <div className="mb-8 bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center gap-6">
          {teacher.imageUrl ? (
            <img src={teacher.imageUrl} alt={teacher.name} width={64} height={64} className="rounded-full object-cover" />
          ) : (
            <div className="h-16 w-16 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-2xl">{teacher.name[0]}</span>
            </div>
          )}
          <div>
            <h1 className="text-3xl capitalize font-bold">{teacher.name}</h1>
            <p className="text-gray-600">Username: {teacher.username}</p>
          </div>
        </div>
      </div>

      {/* Subjects Section */}
      <div className="mb-8 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-4">My Subjects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {teacher.subjects.map((subject) => (
            <div
              key={subject.id}
              className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <h3 className="font-semibold">{subject.title}</h3>
              <p className="text-sm text-gray-600">Code: {subject.code}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Timetable Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-4">My Timetable</h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] border-collapse border">
            <thead>
              <tr className="bg-gray-50">
                <th className="border p-2">Time</th>
                {WORKING_DAYS.map((day) => (
                  <th key={day} className="border p-2">
                    {day.charAt(0) + day.slice(1).toLowerCase()}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TIME_SLOTS.map((slot, index) => (
                <tr key={index}>
                  <td className="border p-2 text-sm font-medium">
                    {slot.start} - {slot.end}
                  </td>
                  {WORKING_DAYS.map((day) => {
                    const classForSlot = teacher.classes.find(
                      (cls) => 
                        cls.day === day &&
                        format(new Date(cls.startTime).toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }), 'HH:mm') === slot.start
                    )
                    
                    return (
                      <td key={day} className="border p-2">
                        {classForSlot ? (
                          <div className="text-sm">
                            <div className="font-semibold">{classForSlot.subject.title}</div>
                            <div className="text-gray-600 capitalize">
                              {/* we have to create class detaills  */}
                              {classForSlot.timetable.group?.section?.year?.course?.name} - {classForSlot.timetable.group?.section?.year?.course?.subname} - {classForSlot.timetable.group?.section?.name} - G{classForSlot.timetable?.group?.name}
                            </div>
                          </div>
                        ) : (
                          <div className="text-gray-400">-</div>
                        )}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Today's Classes Quick View - Updated Section */}
      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-4">Today's Classes</h2>
        <div className="space-y-4">
          {teacher.classes
            .filter(cls => cls.day === currentDay)
            .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
            .map((cls) => (
              <div 
                key={cls.id} 
                className="flex items-center justify-between border-b pb-4 hover:bg-gray-50 p-4 rounded-lg"
              >
                <div>
                  <h3 className="font-semibold">{cls.subject.title}</h3>
                  <p className="text-sm text-gray-600">
                    {cls.timetable.group?.section?.year?.course?.name} - {' '}
                    {cls.timetable.group?.section?.year?.course?.subname} - {' '}
                    {cls.timetable.group?.section?.name} - G{cls.timetable.group?.name}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">
                    {format(new Date(cls.startTime), 'hh:mm a')}
                  </p>
                  <p className="text-sm text-gray-600">
                    to {format(new Date(cls.endTime), 'hh:mm a')}
                  </p>
                </div>
              </div>
            ))}
          {teacher.classes.filter(cls => cls.day === currentDay).length === 0 && (
            <div className="text-center text-gray-500 py-4">
              No classes scheduled for today
            </div>
          )}
        </div>
      </div>
    </div>
  )
}