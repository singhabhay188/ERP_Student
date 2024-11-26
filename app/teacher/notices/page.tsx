import { format } from 'date-fns'

export default async function Notices() {
  // Sample notices data (in a real app, this would come from the database)
  const notices = [
    {
      id: 1,
      title: "Mid-term Examination Schedule",
      content: "Mid-term examinations will be conducted from April 1st to April 15th...",
      date: new Date(),
      priority: "high"
    },
    {
      id: 2,
      title: "Faculty Meeting",
      content: "Monthly faculty meeting scheduled for next Monday at 2 PM...",
      date: new Date(),
      priority: "medium"
    }
  ]

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Notices</h1>
        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Create Notice
        </button>
      </div>

      <div className="space-y-4">
        {notices.map((notice) => (
          <div 
            key={notice.id} 
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-semibold">{notice.title}</h2>
                <p className="text-gray-600 mt-2">{notice.content}</p>
                <p className="text-sm text-gray-500 mt-2">
                  Posted on: {format(notice.date, 'PPP')}
                </p>
              </div>
              <span 
                className={`px-3 py-1 rounded-full text-sm ${
                  notice.priority === 'high' 
                    ? 'bg-red-100 text-red-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}
              >
                {notice.priority}
              </span>
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