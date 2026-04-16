import pool from '@/db/users/mysql';

export async function getUserAddress(userId: string): Promise<string | null> {
	const conn = await pool.getConnection();
	try {
		const [rows] = await conn.query('SELECT address FROM user WHERE id = ?', [userId]);
		return (rows as any[])[0]?.address || null;
	} finally {
		conn.release();
	}
}
