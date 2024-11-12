import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { format } from 'date-fns'

export default async function Events() {
  const cookieStore = await cookies()
  const userCookie = cookieStore.get('user')
  
  if (!userCookie) {
    redirect('/login')
  }

  const userData = JSON.parse(userCookie.value)
  if (userData.type !== 'teacher') {
    redirect('/')
  }

  // Sample events data (in a real app, this would come from the database)
  const events = [
    {
      id: 1,
      title: "Annual Tech Symposium",
      description: "Annual technical symposium featuring student projects and industry speakers",
      date: new Date('2024-04-15'),
      venue: "Main Auditorium",
      type: "technical"
    },
    {
      id: 2,
      title: "Cultural Fest",
      description: "Annual cultural festival celebrating art, music, and dance",
      date: new Date('2024-03-20'),
      venue: "College Ground",
      type: "cultural"
    }
  ]

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">College Events</h1>
        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Add New Event
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {events.map((event) => (
          <div 
            key={event.id}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-semibold">{event.title}</h2>
              <span 
                className={`px-3 py-1 rounded-full text-sm ${
                  event.type === 'technical' 
                    ? 'bg-purple-100 text-purple-800' 
                    : 'bg-pink-100 text-pink-800'
                }`}
              >
                {event.type}
              </span>
            </div>
            <p className="text-gray-600 mb-4">{event.description}</p>
            <div className="text-sm text-gray-500">
              <p>Date: {format(event.date, 'PPP')}</p>
              <p>Venue: {event.venue}</p>
            </div>
            <div className="mt-4 flex gap-2">
              <button className="text-blue-500 hover:text-blue-700">Edit</button>
              <button className="text-red-500 hover:text-red-700">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 