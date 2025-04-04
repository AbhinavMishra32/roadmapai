import { NextRequest, NextResponse } from 'next/server';

export async function GET(){
    return NextResponse.json({
        hello: "world",
    });
}

export async function POST(req: NextRequest){
    const data = await req.json();
    return NextResponse.json({"this is the data": data})
}