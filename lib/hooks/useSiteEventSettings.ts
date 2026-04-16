'use client';

import { useQuery } from '@tanstack/react-query';
import type { ActiveSiteEvent } from '@/lib/types/site-events';

export type SiteEventSettingsResponse = {
	activeEvent: ActiveSiteEvent | null;
};

async function fetchSiteEventSettings(): Promise<SiteEventSettingsResponse> {
	const res = await fetch('/api/site-events');
	const data = await res.json();

	if (!res.ok) {
		throw new Error(data?.error || 'Failed to fetch site events');
	}

	return data as SiteEventSettingsResponse;
}

export function useSiteEventSettings() {
	return useQuery({
		queryKey: ['site-events'],
		queryFn: fetchSiteEventSettings,
		staleTime: 1000 * 60 * 5,
		refetchOnWindowFocus: false,
	});
}
