import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { getMessages, addMessage } from '@/lib/messages';

export async function GET(req: NextRequest) {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session?.user?.id) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	}

	const messages = await getMessages(session.user.id);

	return NextResponse.json(messages, { status: 200 });
}
