"use client"
import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import useFetch from "@/hooks/useFetch"
import prisma from "@/db";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import { Group } from "@/utils/types"
import { createAssignment } from "@/actions/teacher"

type AssignmentFormData = {
    title: string;
    description: string;
    dueDate: Date;
    mediaUrl?: string;
    groupId: string;
    teacherId: string;
}

const AddAssignmentForm = ({ closeDrawer, teacherId, groups }: { groups:Group[]; closeDrawer: () => void; teacherId: string; }) => {
    const router = useRouter();
    const [selected, setSelected] = useState<Date>();

    const { register, handleSubmit, formState: { errors }, setValue } = useForm<AssignmentFormData>({
        defaultValues: {
            teacherId: teacherId,
            dueDate: selected,
        }
    });

    const { loading, error, fn: fetchCreateAssignment, data } = useFetch(createAssignment);

    // Add effect to update form when date changes
    useEffect(() => {
        if (selected) {
            const dueDate = new Date(selected);
            dueDate.setHours(23, 59, 59);
            setValue('dueDate', dueDate);
        }
    }, [selected, setValue]);

    const onSubmit = async (data: AssignmentFormData) => {
        try {
            if (!selected) {
                alert("Please select a due date");
                return;
            }

            // Ensure time is set to 23:59:59
            const dueDate = new Date(selected);
            dueDate.setHours(23, 59, 59);

            const res = await fetchCreateAssignment({
                ...data,
                dueDate: dueDate,
            });

            if (res) {
                closeDrawer();
                router.refresh();
            }
        } catch (error) {
            console.error('Failed to create assignment:', error);
        }
    }

    return (
        <div className="p-4 pb-0">
            <form onSubmit={handleSubmit(onSubmit)} className="flex gap-4">
                {/* Left side - Form Fields */}
                <div className="space-y-4 flex-1">
                    <div className="space-y-2">
                        <Label htmlFor="title">Assignment Title</Label>
                        <Input
                            id="title"
                            {...register("title", { required: "Title is required" })}
                            placeholder="Enter assignment title"
                        />
                        {errors.title && (
                            <p className="text-sm text-red-500">{errors.title.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            {...register("description", { required: "Description is required" })}
                            placeholder="Enter assignment description"
                        />
                        {errors.description && (
                            <p className="text-sm text-red-500">{errors.description.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="groupId">Select Group</Label>
                        <Select onValueChange={(value) => setValue('groupId', value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a group" />
                            </SelectTrigger>
                            <SelectContent>
                                {groups.map((group) => (
                                    <SelectItem key={group.id} value={group.id}>
                                        {group.section.year.course.name} - {group.section.year.course.subname || ''} - Sem {group.section.year.semNum} - {group.section.name} - {group.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.groupId && (
                            <p className="text-sm text-red-500">{errors.groupId.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="mediaUrl">Media URL (Optional)</Label>
                        <Input
                            id="mediaUrl"
                            {...register("mediaUrl")}
                            placeholder="Enter media URL if any"
                        />
                    </div>

                    <Button className="w-full" type="submit" disabled={loading || !selected}>
                        {loading ? 'Creating...' : 'Create Assignment'}
                    </Button>

                    {!loading && error && <p className="text-red-500 text-sm text-center my-2">An Error Occurred while Creating Assignment</p>}
                </div>

                {/* Right side - Calendar */}
                <div className="border-l pl-4 flex flex-col">
                    <Label className="mb-2">Due Date</Label>
                    <DayPicker
                        mode="single"
                        selected={selected}
                        onSelect={setSelected}
                        footer={selected ? `Due Date: ${selected.toLocaleDateString()}` : "Select due date"}
                        className="border rounded-md p-3"
                        disabled={{before: new Date()}}
                    />
                    {!selected && <p className="text-sm text-red-500 mt-2">Due date is required</p>}
                </div>
            </form>
        </div>
    )
}

export default AddAssignmentForm