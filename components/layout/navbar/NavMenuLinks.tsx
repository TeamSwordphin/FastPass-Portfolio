import Link from 'next/link';

export default function NavMenuLinks({ loginButton }: { loginButton: React.ReactNode }) {
	return (
		<ul className="menu menu-horizontal hidden lg:flex gap-x-4 xl:gap-x-6 whitespace-nowrap overflow-hidden text-ellipsis">
			<li>
				<Link href="/" className="text-xl font-bold">
					Home
				</Link>
			</li>
			<li>
				<Link href="/about" className="text-xl font-bold">
					About
				</Link>
			</li>
			<li>
				<Link href="/pricing" className="text-xl font-bold">
					Pricing
				</Link>
			</li>
			<li>
				<Link href="/videos" className="text-xl font-bold">
					Videos
				</Link>
			</li>
			<li>
				<Link href="/faq" className="text-xl font-bold">
					FAQ
				</Link>
			</li>
			<li>
				<Link href="/reviews" className="text-xl font-bold">
					Reviews
				</Link>
			</li>
			<li>{loginButton}</li>
		</ul>
	);
}
