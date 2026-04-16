import { NextRequest, NextResponse } from 'next/server';
import { getUserRole } from '@/lib/users/getRole';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

export async function GET(req: NextRequest) {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session?.user?.id) {
		return NextResponse.json(
			{
				role: null,
			},
			{
				status: 200,
			}
		);
	}

	const role = await getUserRole(session.user.id);

	return NextResponse.json({ role });
}
