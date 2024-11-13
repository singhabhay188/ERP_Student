'use client'
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { useState } from "react"

export default function page() {
  const [loading, setLoading] = useState(false);
  if(localStorage.getItem('user')){
    let user = JSON.parse(localStorage.getItem('user') || '{}');
    window.location.href = `/${user.type}/dashboard`;
  }

  const handleSubmit = async (type: 'admin' | 'teacher' | 'student', event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if(loading) return;
    setLoading(true);
    const formData = new FormData(event.currentTarget);
    
    try {
      const response = await fetch('/api/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type,
          ...(type === 'student' 
            ? { enrollment: formData.get('enrollment') }
            : { username: formData.get('username') }
          ),
          password: formData.get('password'),
        }),
      });

      const data = await response.json();

      console.log(data);
      
      if (response.ok) {
        localStorage.setItem('user', JSON.stringify({
          type: data.type,
          id: data.id
        }));

        // WE WILL SEND TO CORESPONDNG DASHBOARD
        window.location.href = `/${data.type}/dashboard`;
      } else {
        alert(data.message || 'Login failed');
      }
    } catch (error) {
      alert('An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center">
      <h1 className="text-xl font-semibold mb-6">Welcome to Attendance ERP Portal</h1>
      <Tabs defaultValue="student" className="w-[400px]">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="admin">Admin</TabsTrigger>
          <TabsTrigger value="teacher">Teacher</TabsTrigger>
          <TabsTrigger value="student">Student</TabsTrigger>
        </TabsList>
        <TabsContent value="admin">
          <Card>
            <form onSubmit={(e) => handleSubmit('admin', e)}>
              <CardHeader>
                <CardTitle className="text-center">Welcome Admin</CardTitle>
                <CardDescription className="text-center">
                  Sign In using your credentials
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="space-y-1">
                  <Label htmlFor="admin-username">Username</Label>
                  <Input 
                    id="admin-username" 
                    name="username"
                    placeholder="admin123" 
                    required
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="admin-password">Password</Label>
                  <Input 
                    id="admin-password" 
                    name="password"
                    type="password"
                    placeholder="*****" 
                    required
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Signing In...' : 'Sign In'}</Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
        <TabsContent value="teacher">
          <Card>
            <form onSubmit={(e) => handleSubmit('teacher', e)}>
              <CardHeader>
                <CardTitle className="text-center">Welcome Teacher</CardTitle>
                <CardDescription className="text-center">
                  Sign In using your credentials
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="space-y-1">
                  <Label htmlFor="teacher-username">Username</Label>
                  <Input 
                    id="teacher-username" 
                    name="username"
                    placeholder="david4455" 
                    required
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="teacher-password">Password</Label>
                  <Input 
                    id="teacher-password" 
                    name="password"
                    type="password"
                    placeholder="*****" 
                    required
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Signing In...' : 'Sign In'}</Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
        <TabsContent value="student">
          <Card>
            <form onSubmit={(e) => handleSubmit('student', e)}>
              <CardHeader>
                <CardTitle className="text-center">Welcome Student</CardTitle>
                <CardDescription className="text-center">
                  Sign In using your credentials
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="space-y-1">
                  <Label htmlFor="enrollment">Enrollment No</Label>
                  <Input 
                    id="enrollment" 
                    name="enrollment"
                    placeholder="10525502721" 
                    required
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="student-password">Password</Label>
                  <Input 
                    id="student-password" 
                    name="password"
                    type="password"
                    placeholder="*****" 
                    required
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Signing In...' : 'Sign In'}</Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}