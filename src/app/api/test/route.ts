import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    // sample function
    return NextResponse.json({ message: "Received" }, { status: 200 });
}