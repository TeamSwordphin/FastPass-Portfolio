'use client';

import dynamic from 'next/dynamic';
import ScrollingHeader from './NavScrollingHeader';
import type { ActiveSiteEvent } from '@/lib/types/site-events';

const LoginButton = dynamic(() => import('@/features/auth/login/Login'), {
	ssr: false,
});

export default function NavBarClient({ activeEvent }: { activeEvent: ActiveSiteEvent | null }) {
	return <ScrollingHeader loginButton={<LoginButton />} activeEvent={activeEvent} />;
}
