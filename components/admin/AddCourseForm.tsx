"use client"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useForm } from "react-hook-form"
import { COLLEGE_ID } from "@/lib/const"
import { CourseFormData } from "@/utils/types"
import useFetch from "@/hooks/useFetch"
import { createCourse } from "@/actions/admin"
import { useRouter } from "next/navigation"
import { Button } from "../ui/button"

const AddCourseForm = ({closeDrawer}:{closeDrawer:()=> void}) => {
    const router = useRouter();

    const { register, handleSubmit, formState: { errors } } = useForm<CourseFormData>({
        defaultValues: {
            collegeId: COLLEGE_ID
        }
    });

    const { loading, error, fn: fetchCreateCourse, data } = useFetch(createCourse);

    const onSubmit = async (data: CourseFormData) => {
        console.log(data)
        await fetchCreateCourse(data);
        console.log(data,error);
        closeDrawer();
        router.refresh();
    }


    return (
        <div className="p-4 pb-0">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="name">Course Name</Label>
                    <Input
                        id="name"
                        className="capitalize"
                        {...register("name", { required: "Course name is required" })}
                        placeholder="Enter course name"
                    />
                    {errors.name && (
                        <p className="text-sm text-red-500">{errors.name.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="subname">Course Subname</Label>
                    <Input
                        id="subname"
                        className="capitalize"
                        {...register("subname", { required: "Course subname is required" })}
                        placeholder="Enter course subname"
                    />
                    {errors.subname && (
                        <p className="text-sm text-red-500">{errors.subname.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="expectedYears">Expected Years</Label>
                    <Input
                        type="number"
                        id="expectedYears"
                        {...register("expectedYears", {
                            required: "Expected years is required",
                            min: { value: 1, message: "Must be at least 1 year" },
                            max: { value: 10, message: "Cannot exceed 10 years" },
                            valueAsNumber: true
                        })}
                        placeholder="Enter expected years (1-10)"
                    />
                    {errors.expectedYears && (
                        <p className="text-sm text-red-500">{errors.expectedYears.message}</p>
                    )}
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

                {!loading && error && <p className="text-red-500 text-sm text-center my-2">An Error Occured while Creating Course</p>}
                <Button className="w-full" type="submit" disabled={loading}>{loading ? 'Creating...' : 'Create Course'}</Button>
            </form>
        </div>
  )
}

export default AddCourseForm