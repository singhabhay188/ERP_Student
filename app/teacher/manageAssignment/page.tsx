import AddAssignment from '@/components/teacher/AddAssignment';
import { getUserData } from '@/utils/auth';

export default async function ManageAssignments() {
  const userData = await getUserData();

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Assignments Overview</h1>
        <AddAssignment teacherId={userData.id}/>
      </div>
      <div className='flex flex-col gap-4'>
        <p>Assignmet 1</p>
        <p>Assignmet 2</p>
      </div>
    </div>
  )
}