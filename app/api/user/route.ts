import { NextRequest, NextResponse } from "next/server";

export const GET = () => {
    return NextResponse.json({message: 'Hello world'});
}

export const POST = async (req: NextRequest) => {
    try{
        const body = await req.json();
    
        if (body.username === 'admin' && body.password === 'admin') {
            return NextResponse.json({user:{id: 1, name: 'J Smith', email: ''}});
        }
        throw new Error('Invalid credentials');
    }
    catch(e){
        return NextResponse.json({error: 'Invalid credentials or Server Error'}, {status: 401});
    }
}