'use client';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { EyeIcon, EyeOffIcon, LockIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import useFetch from "@/hooks/useFetch";
import { adminSignIn } from "@/actions/admin";
import { useRouter } from "next/navigation";

export default function AdminSignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('testing@gmail.com');
  const [password, setPassword] = useState('Tester@1234');
  const {loading,error,fn:fetchAdminSignIn,data} = useFetch(adminSignIn);

  const router = useRouter();
  
  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleSubmit = async (e:React.FormEvent) => {
    e.preventDefault();
    await fetchAdminSignIn({email,password});
  }

  useEffect(()=>{
    if(data) router.push('/admin/dashboard');
  },[data,router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Admin Sign In</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="admin@example.com" value={email} onChange={(e)=>{ setEmail(e.target.value) }} required />
              </div>
              <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={togglePasswordVisibility}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                >
                    {showPassword ? (
                        <EyeOffIcon className="h-4 w-4 text-gray-500" />
                    ) : (
                        <EyeIcon className="h-4 w-4 text-gray-500" />
                    )}
                </Button>
            </div>
        </div>
            </div>
            <Button className="w-full mt-6" type="submit" disabled={loading}>
              <LockIcon className="mr-2 h-4 w-4" /> Sign In
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          {!loading && error && <p className="text-sm w-full text-red-500 text-center">{error.message || 'An Error Occured'}</p>}
        </CardFooter>
      </Card>
    </div>
  )
}