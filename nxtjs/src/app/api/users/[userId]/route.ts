import data from "@/data.json";

export async function GET(request: Request, { params }: {params: Promise<{userId: string}>}){
    const userId = (await params).userId;
    const user = data.filter(user => user.id.toString() === userId)
    return Response.json({
        "user": user,
    })
}