import { headers } from 'next/headers';
import { NextRequest } from 'next/server';
import { Webhook } from 'svix';

const webhookSecret = process.env.CLERK_WEBHOOK_SECRET || '';
if (!webhookSecret) {
    throw new Error("You need a WEBHOOK_SECRET in your .env");
}

async function validateRequest(request: Request) {
    const payloadString = await request.text();
    const headerPayload = await headers();

    const svixHeaders = {
        'svix-id': headerPayload.get('svix-id')!,
        'svix-timestamp': headerPayload.get('svix-timestamp')!,
        'svix-signature': headerPayload.get('svix-signature')!,
    };
    const wh = new Webhook(webhookSecret);
    try {
        return wh.verify(payloadString, svixHeaders) as Event;
    } catch (error) {
        console.error("Error verifying webhook", error);
        return Response.error();
    }

}

type EventType = "user.created" | "user.updated" | "*";

type Event = {
    data: Record<string, string | number>;
    object: "event",
    type: EventType,
}

export async function POST(request: NextRequest) {
    let evt: Event | null = null;
    evt = await validateRequest(request) as Event;
    const eventType: EventType = evt?.type;

    if (eventType === "user.created" || eventType === "user.updated") {
        const { id, ...attributes } = evt.data;
        console.log(id);
        console.log("User attributes", attributes);
    }
    // console.log(payload);
    return new Response(JSON.stringify({ message: 'Received' }), {
        headers: { 'Content-Type': 'application/json' },
    });
}