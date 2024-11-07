import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen, Users } from 'lucide-react'
import { getDashboardData } from "@/actions/admin";

export default async function AdminDashboard() {
  const collegeId = "f0eced64-b793-4294-ae81-3c5352656098";
  const data = await getDashboardData(collegeId);
  if(!data || !data.college) return <div>Error Loading College Info</div>


  return (
    <div className="max-w-screen-2xl mx-auto p-6 space-y-10">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <div className="flex flex-col gap-4 border-2 border-gray-500 rounded-lg p-4">
        <h1 className="text-xl font-bold">College Details</h1>
        <h2 className="text-xl font-bold">{data.college.name}</h2>
        <p className="text-sm text-gray-500">{data.college.address}</p>
        <p className="text-sm text-gray-500">{data.college.pincode}</p>
      </div>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
          <BookOpen className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.totalCourses}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Students</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.totalStudents}</div>
        </CardContent>
      </Card>
    </div>
  )
}