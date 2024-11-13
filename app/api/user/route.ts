import { NextRequest, NextResponse } from "next/server";
import prisma from "@/db";

export const GET = () => {
    return NextResponse.json({message: 'Hello world'});
}

export const POST = async (req: NextRequest) => {
    try {
        const body = await req.json();
        const { enrollment='', username='', password = '', type='' } = body;

        let user = null;
        let id = '';

        if (type === 'student') {
            user = await prisma.student.findUnique({
                where: { enrollment,password }
            });
            console.log(user);
            if(user) id = user.enrollment;
        }
        else if (type === 'teacher') {
            user = await prisma.teacher.findFirst({
                where: { username,password }
            });
            if(user) id = user.id;
        }
        else if (type === 'admin') {
            if(username==='admin@gmail.com' && password==='admin123'){
                user = { id:'aVerySecretAdminId' }
                id = user.id;
            }
        }
        else {
            return NextResponse.json({ error: 'Invalid user type' }, { status: 400 });
        }

        console.log(user);

        if (!user) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        const response = NextResponse.json({ id, type });
        response.cookies.set('user', JSON.stringify({ id, type }));
        return response;
    }
    catch (e) {
        return NextResponse.json({ error: 'Server Error' }, { status: 500 });
    }
}