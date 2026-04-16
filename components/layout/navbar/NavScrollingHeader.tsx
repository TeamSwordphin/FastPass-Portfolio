'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

import Logo from './NavLogo';
import NavLinks from './NavMenuLinks';
import MobileMenu from './NavMenuMobile';
import HolidayBanner from './HolidayBanner';
import type { ActiveSiteEvent } from '@/lib/types/site-events';

type NavScrollingHeaderProps = {
	loginButton: React.ReactNode;
	activeEvent: ActiveSiteEvent | null;
};

export default function ScrollingHeader({ loginButton, activeEvent }: NavScrollingHeaderProps) {
	const [scrolled, setScrolled] = useState(false);
	const [drawerOpen, setDrawerOpen] = useState(false);

	const pathname = usePathname();
	const isHoliday = pathname?.endsWith('/holiday');

	useEffect(() => {
		const handleScroll = () => setScrolled(window.scrollY > 10);
		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

	const defaultBg = 'bg-gray-950 bg-opacity-80 lg:bg-transparent';
	const holidayBg = 'bg-gray-950 bg-opacity-50';

	return (
		<div className="fixed top-0 w-full z-50">
			<div
				className={`w-full shadow-sm transition-all duration-300 ${
					scrolled && !drawerOpen ? 'bg-gray-950 bg-opacity-95' : isHoliday ? holidayBg : defaultBg
				}`}
			>
				<div className="max-w-7xl mx-auto w-full px-4 lg:px-8 py-6 flex items-center justify-between flex-nowrap gap-4 min-w-0">
					<Logo scrolled={scrolled} />

					<div className="flex items-center justify-end flex-grow min-w-0">
						<NavLinks loginButton={loginButton} />
						<MobileMenu loginButton={loginButton} setDrawerOpen={setDrawerOpen} />
					</div>
				</div>
			</div>

			{activeEvent && <HolidayBanner message={activeEvent.bannerMessage} gradientKey={activeEvent.gradientKey} href={activeEvent.targetUrl} />}
		</div>
	);
}
