import prisma from "@/db"
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest){
    const body = await req.json();
    const { students } = body;

    let nstudents = []

    try{
        for(let student of students){
            let { enrollment, name, groupId, collegeId, imageUrl } = student;
            let password = enrollment;
    
            const nstudent = await prisma.student.create({
                data:{
                    name,
                    enrollment,
                    password,
                    imageUrl,
                    groupId,
                    collegeId
                }
            });
            nstudents.push(nstudent);
        }
    }
    catch(e){
        console.log(e);
    }

    
    
    return NextResponse.json({students:nstudents});
}