import { format } from 'date-fns'
import { WORKING_DAYS, TIME_SLOTS } from '@/utils/const'
import prisma from '@/db'
import { getUserData } from '@/utils/auth';

export default async function ClassSchedule() {
  const userData = await getUserData();

  const teacher = await prisma.teacher.findUnique({
    where: { id: userData.id },
    include: {
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

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Weekly Class Schedule</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
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
                    const classForSlot = teacher?.classes.find(
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
                              {classForSlot.timetable.group?.section?.year?.course?.name} - {classForSlot.timetable.group?.section?.year?.course?.subname} - Sem {classForSlot.timetable.group?.section?.year?.semNum} - {classForSlot.timetable.group?.section?.name} - G{classForSlot.timetable?.group?.name}
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
    </div>
  )
} 