"use client"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useForm } from "react-hook-form"
import { COLLEGE_ID } from "@/lib/const"
import { createStudent } from "@/actions/admin"
import { useRouter } from "next/navigation"
import { Button } from "../ui/button"
import { useEffect } from "react"
import useFetch from "@/hooks/useFetch"
import { StudentFormData } from "@/utils/types"


const AddStudentForm = ({closeDrawer}:{closeDrawer:()=> void}) => {
    const router = useRouter();

    const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<StudentFormData>({
        defaultValues: {
            collegeId: COLLEGE_ID,
            password: ''
        }
    });

    const enrollment = watch('enrollment');
    useEffect(() => {
        setValue('password', enrollment || '');
    }, [enrollment]);

    const { loading, error, fn: fetchCreateStudent, data } = useFetch(createStudent);

    const onSubmit = async (data: StudentFormData) => {
        try {
            const result = await fetchCreateStudent(data);
            if (result) {
                closeDrawer();
                router.refresh();
            }
        } catch (error) {
            console.error('Failed to create student:', error);
        }
    }

    return (
        <div className="p-4 pb-0">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="enrollment">Enrollment Number</Label>
                    <Input
                        id="enrollment"
                        {...register("enrollment", { required: "Enrollment number is required" })}
                        placeholder="Enter enrollment number"
                    />
                    {errors.enrollment && (
                        <p className="text-sm text-red-500">{errors.enrollment.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="name">Student Name</Label>
                    <Input
                        id="name"
                        className="capitalize"
                        {...register("name", { required: "Student name is required" })}
                        placeholder="Enter student name"
                    />
                    {errors.name && (
                        <p className="text-sm text-red-500">{errors.name.message}</p>
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

                {!loading && error && <p className="text-red-500 text-sm text-center my-2">An Error Occurred while Creating Student</p>}
                <Button className="w-full" type="submit" disabled={loading}>{loading ? 'Creating...' : 'Create Student'}</Button>
            </form>
        </div>
    )
}

export default AddStudentForm