"use client"
import * as React from "react"
import { PlusCircle } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import AddCourseForm from "./AddCourseForm"
import { useState } from "react"


export default function AddCourse() {
    const [isOpen, setIsOpen] = useState(false);

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
                        <PlusCircle className="mr-2 h-4 w-4" /> Add New Course
                    </div>
                </Button>
            </DrawerTrigger>
            <DrawerContent>
                <div className="mx-auto w-full max-w-md p-3">
                    <DrawerHeader>
                        <DrawerTitle>Create a New Course</DrawerTitle>
                        <DrawerDescription>Enter the details below to create a new course.</DrawerDescription>
                    </DrawerHeader>

                    <AddCourseForm closeDrawer={handleClose}/>

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