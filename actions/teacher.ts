"use server"
import { AssignmentFormData } from "@/utils/types";
import prisma from '@/db'

export async function createAssignment(data: AssignmentFormData) {
    try {
        const { title, description, dueDate, mediaUrl, groupId, teacherId } = data;

        const assignment = await prisma.assignment.create({
            data: {
                title,
                description,
                dueDate,
                mediaUrl,
                groupId,
                teacherId,
            },
        });

        return { success: true, data: assignment };
    } catch (error) {
        if (error instanceof Error) {
            throw error;
        }
        throw new Error('Failed to create course');
    }
}