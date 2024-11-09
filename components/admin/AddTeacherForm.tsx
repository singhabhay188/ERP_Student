"use client"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useForm } from "react-hook-form"
import { COLLEGE_ID } from "@/lib/const"
import { createTeacher } from "@/actions/admin"
import { useRouter } from "next/navigation"
import useFetch from "@/hooks/useFetch"
import { TeacherFormData } from "@/utils/types"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"

const AddTeacherForm = ({closeDrawer}:{closeDrawer:()=> void}) => {
    const router = useRouter();

    const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<TeacherFormData>({
        defaultValues: {
            collegeId: COLLEGE_ID,
            password: ''
        }
    });

    const username = watch('username');
    useEffect(() => {
        setValue('password', username || '');
    }, [username, setValue]);

    const { loading, error, fn: fetchCreateTeacher } = useFetch(createTeacher);

    const onSubmit = async (data: TeacherFormData) => {
        try {
            const result = await fetchCreateTeacher(data);
            if (result) {
                closeDrawer();
                router.refresh();
            }
        } catch (error) {
            console.error('Failed to create teacher:', error);
        }
    }

    return (
        <div className="p-4 pb-0">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="name">Teacher Name</Label>
                    <Input
                        id="name"
                        className="capitalize"
                        {...register("name", { required: "Teacher name is required" })}
                        placeholder="Enter teacher name"
                    />
                    {errors.name && (
                        <p className="text-sm text-red-500">{errors.name.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                        id="username"
                        {...register("username", { 
                            required: "Username is required",
                            minLength: {
                                value: 3,
                                message: "Username must be at least 3 characters"
                            }
                        })}
                        placeholder="Enter username"
                    />
                    {errors.username && (
                        <p className="text-sm text-red-500">{errors.username.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                        id="password"
                        type="text"
                        {...register("password")}
                        disabled
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="collegeId">College ID</Label>
                    <Input
                        id="collegeId"
                        {...register("collegeId")}
                        disabled
                        value={COLLEGE_ID}
                    />
                </div>

                {!loading && error && <p className="text-red-500 text-sm text-center my-2">An Error Occurred while Creating Teacher</p>}
                <Button className="w-full" type="submit" disabled={loading}>{loading ? 'Creating...' : 'Create Teacher'}</Button>
            </form>
        </div>
    )
}

export default AddTeacherForm;
