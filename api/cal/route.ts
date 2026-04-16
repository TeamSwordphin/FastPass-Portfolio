import { NextRequest } from 'next/server';
import crypto from 'crypto';
import { handleWebhookEvent } from '@/server/calservices';

export async function POST(req: NextRequest) {
	try {
		const rawBody = await req.text();
		const signature = req.headers.get('x-cal-signature-256');
		const secret = process.env.ZCAL_WEBHOOK_SECRET;

		if (!secret || !signature) {
			return new Response('Unauthorized', {
				status: 401,
			});
		}

		const hmac = crypto.createHmac('sha256', secret);
		hmac.update(rawBody, 'utf8');
		const expectedSignature = hmac.digest('hex');

		const isValid = crypto.timingSafeEqual(Buffer.from(expectedSignature), Buffer.from(signature));

		if (!isValid) {
			return new Response('Invalid signature', {
				status: 401,
			});
		}

		await handleWebhookEvent(JSON.parse(rawBody));

		return new Response('Success', {
			status: 200,
		});
	} catch (err) {
		console.error('Webhook handler error:', err);
		return new Response('Server error', {
			status: 500,
		});
	}
}
