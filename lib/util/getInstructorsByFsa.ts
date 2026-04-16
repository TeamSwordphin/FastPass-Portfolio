import 'server-only';

import pool from '@/db/users/mysql';
import type { RowDataPacket } from 'mysql2';

export interface InstructorWithName extends RowDataPacket {
	id: string;
	name: string;
	calUsername?: string | null;
	instructorBio?: string | null;
	instructorPortraitUrl?: string | null;
	instructorWeight?: number | null;
	vehicleModel?: string | null;
	vehicleYear?: string | null;
	languages?: string[];
}

interface InstructorRow extends RowDataPacket {
	id: string;
	name: string;
	calUsername: string | null;
	instructorBio: string | null;
	instructorPortraitUrl: string | null;
	instructorWeight: number | null;
	vehicleModel: string | null;
	vehicleYear: string | null;
	languages: string | null;
}

/**
 * Get instructors assigned to a given FSA
 */
export async function getInstructorsByFSA(fsa: string): Promise<InstructorWithName[]> {
	if (!fsa) throw new Error('Missing required parameter: fsa');

	const conn = await pool.getConnection();

	try {
		// 1. Get all category IDs for this FSA
		const [areas] = await conn.query<RowDataPacket[]>(`SELECT category_id FROM pickup_areas WHERE name = ?`, [fsa]);

		if (!areas.length) return [];

		const categoryIds = areas.map((a) => a.category_id);

		// 2. Get all instructors for these categories
		const [instructors] = await conn.query<InstructorRow[]>(
			`
      SELECT
        u.id,
        u.name,
        u.calUsername,
        u.instructorBio,
        u.instructorPortraitUrl,
        u.instructorWeight,
        u.vehicleModel,
        u.vehicleYear,
        GROUP_CONCAT(DISTINCT l.name ORDER BY l.name SEPARATOR ',') AS languages
      FROM instructor_pickup_areas ipa
      JOIN user u ON ipa.instructor_userId = u.id
      LEFT JOIN instructor_languages il ON il.instructor_userId = u.id
      LEFT JOIN languages l ON l.id = il.language_id
      WHERE ipa.pickup_category_id IN (?)
      GROUP BY u.id, u.name, u.calUsername, u.instructorBio, u.instructorPortraitUrl, u.instructorWeight, u.vehicleModel, u.vehicleYear
      ORDER BY u.instructorWeight DESC, u.name ASC
      `,
			[categoryIds]
		);

		return instructors.map((instructor) => {
			const rawPortraitUrl = instructor.instructorPortraitUrl;
			const resolvedPortraitUrl =
				rawPortraitUrl && (rawPortraitUrl.startsWith('http') || rawPortraitUrl.startsWith('/api/'))
					? rawPortraitUrl
					: rawPortraitUrl
						? `/api/instructors/portrait?id=${encodeURIComponent(instructor.id)}`
						: null;

			return {
				...instructor,
				calUsername: instructor.calUsername,
				instructorPortraitUrl: resolvedPortraitUrl,
				languages: instructor.languages
					? instructor.languages
							.split(',')
							.map((lang) => lang.trim())
							.filter(Boolean)
					: [],
			};
		});
	} finally {
		conn.release();
	}
}
