import { cookies } from 'next/headers'
import { format } from 'date-fns'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import prisma from '@/db'
import { Day } from '@prisma/client'
import { getTodayDay } from '@/utils/const'

export default async function TodaysClasses() {
  const cookieStore = await cookies()
  const userCookie = cookieStore.get('user')
  
  if (!userCookie) {
    redirect('/login')
  }

  const userData = JSON.parse(userCookie.value)
  if (userData.type !== 'teacher') {
    redirect('/')
  }

  const today = getTodayDay() as Day
  const currentTime = new Date()

  const teacher = await prisma.teacher.findUnique({
    where: { id: userData.id },
    include: {
      classes: {
        where: { day: today },
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

  const sortedClasses = teacher?.classes.sort((a, b) => 
    new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
  )

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Today's Classes</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedClasses?.map((cls) => {
          const startTime = new Date(cls.startTime)
          const endTime = new Date(cls.endTime)
          const isPast = endTime < currentTime
          const isCurrent = startTime <= currentTime && currentTime <= endTime
          const isFuture = startTime > currentTime

          return (
            <Link 
              key={cls.id} 
              href={`/teacher/markAttendance/${cls.id}`}
              className={`block no-underline transition-all duration-200 ${
                isPast ? 'opacity-75' : ''
              }`}
            >
              <div className={`rounded-lg border shadow-sm p-6 h-full ${
                isCurrent ? 'bg-green-50 border-green-200' :
                isPast ? 'bg-gray-50 border-gray-200' :
                'bg-white border-blue-200 hover:border-blue-400'
              }`}>
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    isCurrent ? 'bg-green-100 text-green-800' :
                    isPast ? 'bg-gray-100 text-gray-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {isCurrent ? 'Ongoing' :
                     isPast ? 'Completed' :
                     'Upcoming'}
                  </span>
                  <span className="text-sm text-gray-600">
                    {format(startTime, 'HH:mm')} - {format(endTime, 'HH:mm')}
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {cls.subject.title}
                </h3>

                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                    </svg>
                    <span className='capitalize'>
                      {cls.timetable.group?.section?.year?.course?.name} {cls.timetable.group?.section?.year?.course?.subname}
                    </span>
                  </div>

                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                    </svg>
                    <span>
                      Section {cls.timetable.group?.section?.name}
                    </span>
                  </div>

                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
                    </svg>
                    <span>
                      Group {cls.timetable.group?.name}
                    </span>
                  </div>
                </div>

                {!isPast && (
                  <div className="mt-4 flex justify-end">
                    <span className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500">
                      Mark Attendance 
                      <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
                      </svg>
                    </span>
                  </div>
                )}
              </div>
            </Link>
          )
        })}
        {(!sortedClasses || sortedClasses.length === 0) && (
          <div className="col-span-full text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No classes today</h3>
            <p className="mt-1 text-sm text-gray-500">You don't have any classes scheduled for today.</p>
          </div>
        )}
      </div>
    </div>
  )
} 