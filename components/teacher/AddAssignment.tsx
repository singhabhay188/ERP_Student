"use client"
import { useEffect, useState } from "react"
import * as React from "react"
import { PlusCircle } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer"
import AddAssignmentForm from "@/components/teacher/AddAssignmentForm"
import { Group } from '@/utils/types'


export default function AddAssignment({ teacherId } : { teacherId: string }) {
    const [groups, setGroups] = useState<Group[]>([]);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const response = await fetch('/api/groups');
                const data = await response.json();
                setGroups(data);
            } catch (error) {
                console.error('Failed to fetch groups:', error);
            }
        };
        fetchGroups();
    }, []);

    function handleClose() {
        setIsOpen(false);
    }
    function handleOpen() {
        setIsOpen(true);
    }

    return (
        <Drawer open={isOpen} onClose={handleClose}>
            <DrawerTrigger asChild>
                <Button asChild onClick={handleOpen}>
                    <div className="flex items-center gap-3">
                        <PlusCircle className="mr-2 h-4 w-4" /> Add New Assignment
                    </div>
                </Button>
            </DrawerTrigger>
            <DrawerContent>
                <div className="mx-auto w-full max-w-screen-lg p-3">
                    <DrawerHeader>
                        <DrawerTitle>Create a New Assignment</DrawerTitle>
                        <DrawerDescription>Enter the details below to create a new assignment.</DrawerDescription>
                    </DrawerHeader>

                    <AddAssignmentForm groups={groups} closeDrawer={handleClose} teacherId={teacherId}/>

                    <DrawerFooter>
                        <DrawerClose asChild>
                            <Button variant="outline" onClick={handleClose}>Cancel</Button>
                        </DrawerClose>
                    </DrawerFooter>
                </div>
            </DrawerContent>
        </Drawer>
    )
}