import pool from '@/db/users/mysql';
import type { RowDataPacket } from 'mysql2';
import { getCalUserBookings, type CalBooking } from '@/lib/cal/instructorBookings';
import { isRoadTestStatus, type RoadTestStatus } from '@/lib/types/road-tests';

type ScheduleType = 'lessons' | 'road-tests';

type ScheduleRow = {
	bookingId: string;
	userId: string;
	createdAt: string | Date;
	roadTestStatus?: RoadTestStatus;
};

type UserInfo = {
	name: string;
	maxAllowed: number;
	phone: string | null;
	address: string | null;
};

type ScheduleItem = {
	bookingId: string;
	userId: string;
	name: string;
	phone: string | null;
	address: string | null;
	maxLessons?: number;
	currentLesson?: number;
	maxRoadTests?: number;
	currentTest?: number;
	calBooking?: CalBooking;
	roadTestStatus?: RoadTestStatus;
};

const SCHEDULE_CONFIG: Record<
	ScheduleType,
	{
		table: string;
		maxField: string;
		currentKey: 'currentLesson' | 'currentTest';
		maxKey: 'maxLessons' | 'maxRoadTests';
	}
> = {
	lessons: {
		table: 'lessons',
		maxField: 'maxBookingsAllowed',
		currentKey: 'currentLesson',
		maxKey: 'maxLessons',
	},
	'road-tests': {
		table: 'roadTests',
		maxField: 'maxRoadTests',
		currentKey: 'currentTest',
		maxKey: 'maxRoadTests',
	},
};

export async function getInstructorScheduleItems(instructorId: string, type: ScheduleType): Promise<ScheduleItem[]> {
	const config = SCHEDULE_CONFIG[type];
	const conn = await pool.getConnection();

	try {
		const statusSelect = type === 'road-tests' ? ', status' : '';
		const [rows] = await conn.query<RowDataPacket[]>(
			`SELECT bookingId, userId, createdAt${statusSelect} FROM ${config.table} WHERE instructorUserId = ? AND bookingId IS NOT NULL`,
			[instructorId]
		);

		if (rows.length === 0) {
			return [];
		}

		const scheduleRows = rows.map((row) => {
			const rawStatus = row.status;
			const roadTestStatus = isRoadTestStatus(rawStatus) ? rawStatus : undefined;

			return {
				bookingId: String(row.bookingId),
				userId: String(row.userId),
				createdAt: row.createdAt,
				roadTestStatus,
			};
		});

		const [calRows] = await conn.query<RowDataPacket[]>('SELECT calUserId FROM user WHERE id = ? LIMIT 1', [instructorId]);
		const calUserId = calRows[0]?.calUserId;
		const bookingIds = new Set(scheduleRows.map((row) => row.bookingId).filter(Boolean));
		const calBookings = calUserId ? await getCalUserBookings(calUserId, bookingIds) : new Map();

		const uniqueUserIds = [...new Set(scheduleRows.map((row) => row.userId))];
		if (uniqueUserIds.length === 0) {
			return [];
		}

		const [userRows] = await conn.query<RowDataPacket[]>(
			`SELECT id, name, ${config.maxField}, phone, address FROM user WHERE id IN (${uniqueUserIds.map(() => '?').join(',')})`,
			uniqueUserIds
		);

		const userMap = new Map<string, UserInfo>();
		for (const row of userRows) {
			userMap.set(String(row.id), {
				name: row.name,
				maxAllowed: Number((row as Record<string, any>)[config.maxField] ?? 0),
				phone: row.phone ?? null,
				address: row.address ?? null,
			});
		}

		const now = new Date();
		const byUser = new Map<string, ScheduleRow[]>();
		for (const row of scheduleRows) {
			if (!byUser.has(row.userId)) {
				byUser.set(row.userId, []);
			}
			byUser.get(row.userId)!.push(row);
		}

		return scheduleRows.map((row) => {
			const userData = userMap.get(row.userId) || {
				name: 'Unknown',
				maxAllowed: 0,
				phone: null,
				address: null,
			};

			const userItems = byUser.get(row.userId) || [];
			const currentCount = userItems.filter((item) => new Date(item.createdAt) <= now).length;
			const calBooking = calBookings.get(row.bookingId);

			const item: ScheduleItem = {
				bookingId: row.bookingId,
				userId: row.userId,
				name: userData.name,
				phone: userData.phone,
				address: userData.address,
				calBooking,
				roadTestStatus: row.roadTestStatus,
			};
			item[config.maxKey] = userData.maxAllowed;
			item[config.currentKey] = currentCount;

			return item;
		});
	} finally {
		conn.release();
	}
}
