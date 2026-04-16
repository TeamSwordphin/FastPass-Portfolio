import { NextRequest, NextResponse } from 'next/server';
import { getUserAddress } from '@/lib/users/getAddress';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

export async function GET(req: NextRequest) {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session?.user?.id) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	}

	const address = await getUserAddress(session.user.id);
	return NextResponse.json({ address });
}
