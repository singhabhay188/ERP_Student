import AddAssignment from '@/components/teacher/AddAssignment';
import { getUserData } from '@/utils/auth';
import prisma from '@/db';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarIcon, ClockIcon, UsersIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';

export default async function ManageAssignments() {
  const userData = await getUserData();
  
  const assignments = await prisma.assignment.findMany({
    where: {
      teacherId: userData.id
    },
    include: {
      group: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Assignments Overview</h1>
        <AddAssignment teacherId={userData.id}/>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {assignments.map((assignment) => (
          <Card key={assignment.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl">{assignment.title}</CardTitle>
                <Badge variant={new Date(assignment.dueDate) < new Date() ? "destructive" : "default"}>
                  {new Date(assignment.dueDate) < new Date() ? "Overdue" : "Active"}
                </Badge>
              </div>
              <CardDescription className="flex items-center gap-2">
                <UsersIcon className="w-4 h-4" />
                {assignment.group.name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">{assignment.description}</p>
              <div className="flex flex-col gap-2 text-sm">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4 text-muted-foreground" />
                  <span>Due: {format(new Date(assignment.dueDate), 'PPP')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <ClockIcon className="w-4 h-4 text-muted-foreground" />
                  <span>Posted: {format(new Date(assignment.createdAt), 'PPP')}</span>
                </div>
                {assignment.mediaUrl && (
                  <a 
                    href={assignment.mediaUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline mt-2"
                  >
                    View Attachment
                  </a>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {assignments.length === 0 && (
        <div className="text-center py-10">
          <p className="text-muted-foreground">No assignments created yet.</p>
        </div>
      )}
    </div>
  );
}