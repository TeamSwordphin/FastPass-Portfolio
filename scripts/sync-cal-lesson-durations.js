import dotenv from 'dotenv';
import pool from '../db/users/mysql.js';

dotenv.config({
	path: '.env.local',
});

const CAL_API_KEY = process.env.CAL_API_KEY;
const CAL_ORGANIZATION_ID = process.env.CAL_ORGANIZATION_ID;

if (!CAL_API_KEY || !CAL_ORGANIZATION_ID) {
	throw new Error('Missing CAL_API_KEY or CAL_ORGANIZATION_ID in .env.local.');
}

const TAKE = Number(process.env.CAL_SYNC_TAKE ?? 100);
const STATUS = process.env.CAL_SYNC_STATUS ?? 'past';
const CAL_API_VERSION = process.env.CAL_API_VERSION ?? '2024-08-13';

function getDurationMinutes(booking) {
	const startIso = booking?.startTime ?? booking?.start;
	const endIso = booking?.endTime ?? booking?.end;

	if (startIso && endIso) {
		const start = new Date(startIso);
		const end = new Date(endIso);
		const diffMs = end.getTime() - start.getTime();

		if (!Number.isNaN(diffMs)) {
			return Math.max(0, Math.round(diffMs / 60000));
		}
	}

	const lengthFallback = Number(booking?.length);
	if (Number.isFinite(lengthFallback)) {
		return Math.max(0, Math.round(lengthFallback));
	}

	const durationFallback = Number(booking?.duration);
	if (Number.isFinite(durationFallback)) {
		return Math.max(0, Math.round(durationFallback));
	}

	return null;
}

function getBookingStartDate(booking) {
	const startIso = booking?.startTime ?? booking?.start;
	if (!startIso) return null;

	const start = new Date(startIso);
	if (Number.isNaN(start.getTime())) return null;

	return start;
}

async function fetchBookingsPage(page) {
	const url = new URL(`https://api.cal.com/v2/organizations/${CAL_ORGANIZATION_ID}/bookings`);
	url.searchParams.set('take', String(TAKE));
	url.searchParams.set('status', STATUS);
	url.searchParams.set('page', String(page));
	url.searchParams.set('sortUpdatedAt', 'desc');

	const response = await fetch(url.toString(), {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${CAL_API_KEY}`,
			'cal-api-version': CAL_API_VERSION,
		},
	});

	if (!response.ok) {
		const errorText = await response.text();
		throw new Error(`Cal.com request failed (${response.status}): ${errorText}`);
	}

	return response.json();
}

async function syncDurations() {
	let page = 1;
	let updatedLessonsCount = 0;
	let updatedRoadTestsCount = 0;
	let totalBookings = 0;

	while (true) {
		const payload = await fetchBookingsPage(page);
		const bookings = Array.isArray(payload?.data) ? payload.data : [];

		totalBookings += bookings.length;

		for (const booking of bookings) {
			const bookingUid = booking?.uid;
			if (!bookingUid) {
				console.warn('Skipping booking without uid.');
				continue;
			}

			const durationMinutes = getDurationMinutes(booking);
			const roadTestDate = getBookingStartDate(booking);
			if (durationMinutes === null) {
				console.warn(`Skipping booking ${bookingUid} due to missing start/end.`);
				continue;
			}

			const [result] = await pool.query('UPDATE lessons SET durationMinutes = ? WHERE bookingId = ?', [durationMinutes, bookingUid]);

			if (result?.affectedRows > 0) {
				updatedLessonsCount += result.affectedRows;
				console.log(`Updated lesson ${bookingUid} -> ${durationMinutes} minutes.`);
			}

			if (roadTestDate) {
				await pool.query('UPDATE lessons SET meetingDate = ? WHERE bookingId = ?', [roadTestDate, bookingUid]);
			}

			const [roadTestResult] = await pool.query('UPDATE roadTests SET durationMinutes = ? WHERE bookingId = ?', [durationMinutes, bookingUid]);

			if (roadTestResult?.affectedRows > 0) {
				updatedRoadTestsCount += roadTestResult.affectedRows;
				console.log(`Updated road test ${bookingUid} -> ${durationMinutes} minutes.`);
			}

			if (roadTestDate) {
				await pool.query('UPDATE roadTests SET roadTestDate = ? WHERE bookingId = ?', [roadTestDate, bookingUid]);
			}
		}

		const pagination = payload?.pagination;
		if (!pagination?.hasNextPage) {
			break;
		}

		page = (pagination.currentPage ?? page) + 1;
	}

	console.log(`Done. Updated ${updatedLessonsCount} lesson(s), ${updatedRoadTestsCount} road test(s) from ${totalBookings} booking(s).`);
}

async function main() {
	try {
		await syncDurations();
	} finally {
		await pool.end();
	}
}

main().catch((error) => {
	console.error('Failed to sync lesson durations:', error);
	process.exitCode = 1;
});
