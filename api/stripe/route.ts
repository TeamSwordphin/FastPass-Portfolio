import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { handleWebhookEvent } from '@/server/stripeservices';

import { stripe } from '@/lib/stripe';

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET as string;

export async function POST(req: Request) {
	const sig = req.headers.get('stripe-signature');

	if (!sig || !endpointSecret) {
		console.log('Missing signature or endpoint secret');
		return NextResponse.json({ error: 'Missing Stripe signature or webhook secret' }, { status: 400 });
	}

	try {
		// Get the raw request body
		const rawBody = await req.arrayBuffer();
		const bodyBuffer = Buffer.from(rawBody);

		// Verify the signature
		const event = stripe.webhooks.constructEvent(bodyBuffer, sig, endpointSecret);

		await handleWebhookEvent(event);

		return NextResponse.json({ received: true });
	} catch (err: any) {
		console.error('Webhook signature verification failed:', err.message);
		return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
	}
}
