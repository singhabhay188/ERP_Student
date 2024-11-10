'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

type Teacher = {
    id: string
    name: string
    username: string
}

export default function AddTeacherToSubject({ subjectId }: { subjectId: string }) {
    const [isOpen, setIsOpen] = useState(false)
    const [teachers, setTeachers] = useState<Teacher[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const router = useRouter()

    // Fetch available teachers when modal opens
    useEffect(() => {
        if (isOpen) {
            fetchTeachers()
        }
    }, [isOpen])

    const fetchTeachers = async () => {
        setIsLoading(true)
        try {
            const response = await fetch(`/api/teachers/available/${subjectId}`)
            if (!response.ok) throw new Error('Failed to fetch teachers')
            const data = await response.json()
            setTeachers(data)
        } catch (error) {
            console.error('Error fetching teachers:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsSubmitting(true)
        const formData = new FormData(e.currentTarget)
        const teacherId = formData.get('teacherId')

        try {
            const response = await fetch('/api/subjects/add-teacher', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    subjectId,
                    teacherId,
                }),
            })

            if (!response.ok) throw new Error('Failed to add teacher')
            
            setIsOpen(false)
            router.refresh()
        } catch (error) {
            console.error('Error adding teacher:', error)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <>
            <Button
                onClick={() => setIsOpen(true)}
                variant="default"
            >
                Add Teacher
            </Button>

            {isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg w-96">
                        <h2 className="text-xl font-bold mb-4">Add Teacher to Subject</h2>
                        <form onSubmit={handleSubmit}>
                            <select
                                name="teacherId"
                                className="w-full border p-2 rounded-md mb-4"
                                required
                                disabled={isLoading || isSubmitting}
                            >
                                <option value="">Select a teacher</option>
                                {isLoading ? (
                                    <option disabled>Loading teachers...</option>
                                ) : teachers.length === 0 ? (
                                    <option disabled>No available teachers</option>
                                ) : (
                                    teachers.map((teacher) => (
                                        <option key={teacher.id} value={teacher.id}>
                                            {teacher.name.toUpperCase()} ({teacher.username})
                                        </option>
                                    ))
                                )}
                            </select>
                            <div className="flex justify-end gap-2">
                                <Button
                                    type="button"
                                    onClick={() => setIsOpen(false)}
                                    variant="outline"
                                    disabled={isSubmitting}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isLoading || isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Adding...
                                        </>
                                    ) : (
                                        'Add'
                                    )}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    )
} 