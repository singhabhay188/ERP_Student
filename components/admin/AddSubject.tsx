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
import AddSubjectForm from "@/components/admin/AddSubjectForm"
import { useState } from "react"

export default function AddSubject() {
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
                    <div className="flex items-center cursor-pointer">
                        <PlusCircle className="mr-2 h-4 w-4" /> Add New Subject
                    </div>
                </Button>
            </DrawerTrigger>
            <DrawerContent>
                <div className="mx-auto w-full max-w-md p-3">
                    <DrawerHeader>
                        <DrawerTitle>Create a New Subject</DrawerTitle>
                        <DrawerDescription>Enter the subject details below.</DrawerDescription>
                    </DrawerHeader>

                    <AddSubjectForm closeDrawer={handleClose}/>

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