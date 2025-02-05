import { WebhookEvent } from '@clerk/nextjs/server';
import { headers } from 'next/headers';
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
        return wh.verify(payloadString, svixHeaders) as WebhookEvent;
    } catch (error) {
        console.error("Error verifying webhook", error);
        return Response.error();
    }
}

export async function POST(request: Request) {
    return new Response(JSON.stringify({ message: 'Received' }), {
        headers: { 'Content-Type': 'application/json' },
    });
    // console.log("Received webhook");
    // const payload = await validateRequest(request);
    // console.log(payload);
    // return new Response(JSON.stringify({ message: 'Received' }), {
    //     headers: { 'Content-Type': 'application/json' },
    // });
}