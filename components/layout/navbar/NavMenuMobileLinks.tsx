// NavMenuMobileLinks.tsx (server)
import Link from 'next/link';

export default function NavMenuMobileLinks({ onClick, loginButton }: { onClick?: () => void; loginButton: React.ReactNode }) {
	return (
		<ul className="menu p-2 space-y-2">
			<li>
				<Link href="/" className="text-xl font-bold" onClick={onClick}>
					Home
				</Link>
			</li>
			<li>
				<Link href="/about" className="text-xl font-bold" onClick={onClick}>
					About
				</Link>
			</li>
			<li>
				<Link href="/pricing" className="text-xl font-bold" onClick={onClick}>
					Pricing
				</Link>
			</li>
			<li>
				<Link href="/videos" className="text-xl font-bold" onClick={onClick}>
					Videos
				</Link>
			</li>
			<li>
				<Link href="/faq" className="text-xl font-bold" onClick={onClick}>
					FAQ
				</Link>
			</li>
			<li>
				<Link href="/reviews" className="text-xl font-bold" onClick={onClick}>
					Reviews
				</Link>
			</li>
			<li>{loginButton}</li>
		</ul>
	);
}
