'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Logo({ scrolled }: { scrolled: boolean }) {
	const pathname = usePathname();
	const isHoliday = pathname?.endsWith('/holiday');
	const imageSrc = isHoliday ? '/images/webp/nav/LogoTransparent_holiday.webp' : '/images/webp/nav/LogoTransparent.webp';

	return (
		<div className="flex-shrink-0">
			<Link href="/" className="text-3xl block">
				<Image
					src={imageSrc}
					alt="Logo"
					className={`transition-all duration-300 ease-in-out ${scrolled ? 'h-12' : 'h-20'} w-auto`}
					width={150}
					height={50}
				/>
			</Link>
		</div>
	);
}
