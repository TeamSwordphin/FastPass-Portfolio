import pool from '@/db/users/mysql';
import type { RowDataPacket } from 'mysql2';

interface LessonRow {
	bookingId: string;
}

export async function getRoadTestsAndRemaining(userId: string): Promise<{
	lessons: LessonRow[];
	remainingLessons: number;
	maxRoadTests: number;
}> {
	const conn = await pool.getConnection();

	try {
		const [lessonRows] = await conn.query<RowDataPacket[]>('SELECT bookingId FROM roadTests WHERE userId = ?', [userId]);

		const [userRows] = await conn.query<RowDataPacket[]>('SELECT maxRoadTests FROM user WHERE id = ?', [userId]);

		const lessons: LessonRow[] = lessonRows.map((row) => ({
			bookingId: row.bookingId as string,
		}));

		const maxRoadTests = userRows[0]?.maxRoadTests ?? 0;
		const remainingLessons = Math.max(maxRoadTests - lessons.length, 0);

		return {
			lessons,
			remainingLessons,
			maxRoadTests,
		};
	} finally {
		conn.release();
	}
}
