import pool from '@/db/users/mysql';

export async function getUserRole(userId: string): Promise<string | null> {
	const conn = await pool.getConnection();
	try {
		const [rows] = await conn.query('SELECT role FROM user WHERE id = ?', [userId]);
		return (rows as any[])[0]?.role || null;
	} finally {
		conn.release();
	}
}
