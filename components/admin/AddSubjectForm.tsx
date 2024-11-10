"use client"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useForm } from "react-hook-form"
import { createSubject } from "@/actions/admin"
import { useRouter } from "next/navigation"
import { Button } from "../ui/button"
import useFetch from "@/hooks/useFetch"

interface SubjectFormData {
    code: string;
    title: string;
}

const AddSubjectForm = ({closeDrawer}:{closeDrawer:()=> void}) => {
    const router = useRouter();

    const { register, handleSubmit, formState: { errors } } = useForm<SubjectFormData>();

    const { loading, error, fn: fetchCreateSubject } = useFetch(createSubject);

    const onSubmit = async (data: SubjectFormData) => {
        try {
            const result = await fetchCreateSubject(data);
            if (result) {
                closeDrawer();
                router.refresh();
            }
        } catch (error) {
            console.error('Failed to create subject:', error);
        }
    }

    return (
        <div className="p-4 pb-0">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="code">Subject Code</Label>
                    <Input
                        id="code"
                        className="uppercase"
                        {...register("code", { required: "Subject code is required" })}
                        placeholder="Enter subject code"
                    />
                    {errors.code && (
                        <p className="text-sm text-red-500">{errors.code.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="title">Subject Title</Label>
                    <Input
                        id="title"
                        {...register("title", { required: "Subject title is required" })}
                        placeholder="Enter subject title"
                    />
                    {errors.title && (
                        <p className="text-sm text-red-500">{errors.title.message}</p>
                    )}
                </div>

                {!loading && error && <p className="text-red-500 text-sm text-center my-2">An Error Occurred while Creating Subject</p>}
                <Button className="w-full" type="submit" disabled={loading}>
                    {loading ? 'Creating...' : 'Create Subject'}
                </Button>
            </form>
        </div>
    )
}

export default AddSubjectForm 