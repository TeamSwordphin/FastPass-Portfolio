import 'server-only';

import type { RowDataPacket } from 'mysql2';
import { unstable_cache } from 'next/cache';
import { PHASE_PRODUCTION_BUILD } from 'next/constants';
import pool from '@/db/users/mysql';
import { holidayBannerDefaults, isHolidayBannerGradientKey } from '@/lib/constants/site-events';
import { getSiteEventImageUrl } from '@/lib/server/s3';
import type { ActiveSiteEvent } from '@/lib/types/site-events';

const normalizeActiveEvent = (row?: RowDataPacket): ActiveSiteEvent | null => {
	if (!row) return null;
	const bannerMessage =
		typeof row.bannerMessage === 'string' && row.bannerMessage.trim().length > 0 ? row.bannerMessage.trim() : holidayBannerDefaults.message;
	const targetUrl = typeof row.targetUrl === 'string' && row.targetUrl.trim().length > 0 ? row.targetUrl.trim() : holidayBannerDefaults.targetUrl;
	const gradientKey = isHolidayBannerGradientKey(row.gradientKey) ? row.gradientKey : holidayBannerDefaults.gradientKey;
	const name = typeof row.name === 'string' && row.name.trim().length > 0 ? row.name.trim() : holidayBannerDefaults.name;
	const heroImageUrl = getSiteEventImageUrl(row.heroImageKey);

	return {
		id: Number(row.id),
		name,
		bannerMessage,
		targetUrl,
		gradientKey,
		heroImageUrl,
	};
};

const fetchActiveSiteEvent = async (): Promise<ActiveSiteEvent | null> => {
	if (process.env.NEXT_PHASE === PHASE_PRODUCTION_BUILD || process.env.SKIP_DB_ON_BUILD === '1') {
		return null;
	}

	const conn = await pool.getConnection();

	try {
		const [rows] = await conn.query<RowDataPacket[]>(
			'SELECT id, name, bannerMessage, targetUrl, gradientKey, heroImageKey FROM site_events WHERE enabled = 1 ORDER BY updatedAt DESC LIMIT 1'
		);

		return normalizeActiveEvent(rows[0]);
	} catch (error) {
		console.error('Get active site event error:', error);
		return null;
	} finally {
		conn.release();
	}
};

const getActiveSiteEventCached = unstable_cache(fetchActiveSiteEvent, ['active-site-event'], {
	revalidate: 300,
	tags: ['site-events'],
});

export const getActiveSiteEvent = () => getActiveSiteEventCached();
