import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function AcademicCalendar() {
  // Sample calendar events (in a real app, this would come from the database)
  const events = [
    {
      id: 1,
      title: "Semester Start",
      date: "2024-01-15",
      type: "academic"
    },
    {
      id: 2,
      title: "Mid-term Examinations",
      date: "2024-04-01",
      type: "exam"
    },
    {
      id: 3,
      title: "Summer Break",
      date: "2024-05-15",
      type: "holiday"
    }
  ]

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Academic Calendar</h1>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="grid gap-4">
          {events.map((event) => (
            <div 
              key={event.id}
              className="border-l-4 pl-4 py-2 hover:bg-gray-50"
              style={{
                borderColor: 
                  event.type === 'academic' ? '#3B82F6' : 
                  event.type === 'exam' ? '#EF4444' : 
                  '#10B981'
              }}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{event.title}</h3>
                  <p className="text-sm text-gray-600">{event.date}</p>
                </div>
                <span 
                  className={`px-2 py-1 rounded text-xs ${
                    event.type === 'academic' ? 'bg-blue-100 text-blue-800' :
                    event.type === 'exam' ? 'bg-red-100 text-red-800' :
                    'bg-green-100 text-green-800'
                  }`}
                >
                  {event.type}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 