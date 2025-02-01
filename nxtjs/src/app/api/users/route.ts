export async function POST(req: Request){
    const body = await req.json();
    console.log(body);
    console.log("This is the eeee:", body.eeee);
    return Response.json('Hello this is the users route with no id', {
        status: 200
    })
}