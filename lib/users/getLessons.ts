import pool from '@/db/users/mysql';
import type { RowDataPacket } from 'mysql2';

interface LessonRow {
	bookingId: string;
}

export async function getLessonsAndRemaining(userId: string): Promise<{
	lessons: LessonRow[];
	remainingLessons: number;
	maxBookingsAllowed: number;
	bdeCompletionStatus: boolean;
	bdeLevel: number;
}> {
	const conn = await pool.getConnection();

	try {
		const [lessonRows] = await conn.query<RowDataPacket[]>('SELECT bookingId FROM lessons WHERE userId = ?', [userId]);

		const [userRows] = await conn.query<RowDataPacket[]>('SELECT maxBookingsAllowed, bdeCompletionStatus, bdeLevel FROM user WHERE id = ?', [userId]);

		const lessons: LessonRow[] = lessonRows.map((row) => ({
			bookingId: row.bookingId as string,
		}));

		const maxBookingsAllowed = userRows[0]?.maxBookingsAllowed ?? 0;
		const remainingLessons = Math.max(maxBookingsAllowed - lessons.length, 0);
		const bdeCompletionStatus = Boolean(userRows[0]?.bdeCompletionStatus);
		const bdeLevel = Number(userRows[0]?.bdeLevel ?? 0);

		return {
			lessons,
			remainingLessons,
			maxBookingsAllowed,
			bdeCompletionStatus,
			bdeLevel,
		};
	} finally {
		conn.release();
	}
}
