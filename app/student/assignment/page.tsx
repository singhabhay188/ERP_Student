import prisma from "@/db";
import { format } from "date-fns";
import { getUserData } from "@/utils/auth";

export default async function ManageAssignments() {
  const {id} = await getUserData();

  if (!id) {
    return <div>Please log in to view assignments</div>;
  }

  const student = await prisma.student.findUnique({
    where: { enrollment:id },
    include: {
      group: {
        include: {
          assignments: {
            include: {
              teacher: true
            },
            orderBy: {
              dueDate: 'asc'
            }
          }
        }
      }
    }
  });

  if (!student?.group) {
    return <div>No group assigned</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Assignments</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Due Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Teacher</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Media</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {student.group.assignments.map((assignment) => (
              <tr key={assignment.id}>
                <td className="px-6 py-4 whitespace-nowrap">{assignment.title}</td>
                <td className="px-6 py-4">{assignment.description}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {format(new Date(assignment.dueDate), 'PPp')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{assignment.teacher.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {assignment.mediaUrl && (
                    <a 
                      href={assignment.mediaUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      View
                    </a>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}