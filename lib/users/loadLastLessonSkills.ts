import pool from '@/db/users/mysql';
import type { RowDataPacket } from 'mysql2';

interface LessonRow extends RowDataPacket {
	bookingId: string;
	createdAt: Date;
}

interface LessonSkillRow extends RowDataPacket {
	skillId: number;
	score: number;
}

export async function loadLastLessons(userId: string, newBookingId: string): Promise<{ skills: LessonSkillRow[] }> {
	const conn = await pool.getConnection();

	try {
		const [lessonRows] = await conn.query<LessonRow[]>(
			'SELECT bookingId, createdAt FROM lessons WHERE userId = ? AND bookingId <> ? ORDER BY createdAt DESC LIMIT 1',
			[userId, newBookingId]
		);

		if (lessonRows.length === 0) {
			return { skills: [] };
		}

		const { bookingId: recentBookingId } = lessonRows[0];

		const [skillRows] = await conn.query<LessonSkillRow[]>('SELECT skillId, score FROM lesson_skills WHERE bookingId = ?', [recentBookingId]);

		if (skillRows.length === 0) {
			return { skills: [] };
		}

		const insertValues = skillRows.map(({ skillId, score }) => [newBookingId, skillId, score]);
		await conn.query('INSERT IGNORE INTO lesson_skills (bookingId, skillId, score) VALUES ?', [insertValues]);

		console.log(`Inserted ${insertValues.length} skills for bookingId ${newBookingId} from recent lesson ${recentBookingId}.`);

		return { skills: skillRows };
	} finally {
		conn.release();
	}
}
