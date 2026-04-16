'use server';

import { NextRequest, NextResponse } from 'next/server';
import pool from '@/db/users/mysql';
import type { RowDataPacket } from 'mysql2';
import { auth } from '@/lib/auth';

export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }) {
	const { id } = await context.params;
	const messageId = Number(id);

	if (isNaN(messageId)) {
		return NextResponse.json({ error: 'Invalid message ID' }, { status: 400 });
	}

	const session = await auth.api.getSession({ headers: req.headers });
	if (!session?.user?.id) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	}

	const userId = session.user.id;

	try {
		const conn = await pool.getConnection();

		const [result] = await conn.query<RowDataPacket[]>(`UPDATE messages SET \`read\` = 1 WHERE id = ? AND (userId = ? OR userId IS NULL)`, [
			messageId,
			userId,
		]);

		conn.release();

		const affectedRows = (result as any).affectedRows ?? 0;
		if (affectedRows === 0) {
			return NextResponse.json({ error: 'Message not found or already read' }, { status: 404 });
		}

		return NextResponse.json({ success: true, message: 'Message marked as read' });
	} catch (err) {
		console.error('Failed to mark message as read:', err);
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
}
