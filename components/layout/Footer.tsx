import Link from 'next/link';
import { MdEmail, MdPhone } from 'react-icons/md';
import { CONTACT_INFO } from '@/lib/contact-info';

const Footer = () => {
	return (
		<footer className="footer bg-neutral text-neutral-content p-10">
			<div className="max-w-screen-xl mx-auto w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
				<aside className="flex-1">
					<p>
						Fast Pass Driving Academy Ltd.
						<br />
						Copyright © {new Date().getFullYear()} - All Rights Reserved
					</p>
					<div className="mt-1 flex flex-wrap gap-2">
						<Link href="/termsandconditions" className="text-sm text-neutral-content underline hover:text-white">
							Terms of Use
						</Link>
						<span className="text-sm text-neutral-content">|</span>
						<Link href="/privacypolicy" className="text-sm text-neutral-content underline hover:text-white">
							Privacy Policy
						</Link>
						<span className="text-sm text-neutral-content">|</span>
						<Link href="/careers" className="text-sm text-neutral-content underline hover:text-white">
							Careers
						</Link>
					</div>

					<div className="mt-4 space-y-2 text-sm">
						<div className="flex items-center gap-2">
							<MdEmail className="text-lg" aria-hidden />
							<a href={`mailto:${CONTACT_INFO.email}`} className="hover:underline">
								{CONTACT_INFO.email}
							</a>
						</div>
						<div className="flex items-center gap-2">
							<MdPhone className="text-lg" aria-hidden />
							<a href={`tel:${CONTACT_INFO.phoneTel}`} className="hover:underline">
								{CONTACT_INFO.phone}
							</a>
						</div>
					</div>
				</aside>

				<nav className="flex-1">
					<h6 className="footer-title">Social Media</h6>
					<div className="flex gap-2">
						{/* X (Twitter) */}
						{/* <a href="https://x.com" target="_blank" rel="noopener noreferrer" aria-label="X (formerly Twitter)">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="24"
								height="24"
								viewBox="0 0 24 24"
								className="fill-current hover:text-blue-400 transition-colors"
							>
								<path d="M21.455 6.383c-.792.352-1.636.588-2.52.696.907-.543 1.606-1.401 1.94-2.418-.849.501-1.787.866-2.783 1.064-.801-.851-1.934-1.384-3.198-1.384-2.419 0-4.376 1.998-4.376 4.44 0 .347.034.687.1 1.012-3.636-.187-6.859-1.964-9.025-4.675-.375.644-.59 1.39-.59 2.184 0 1.51.763 2.834 1.924 3.609-.708-.021-1.373-.217-1.957-.538v.054c0 2.098 1.475 3.86 3.437 4.254-.341.092-.694.139-1.056.139-.26 0-.513-.025-.759-.073.517 1.618 2.02 2.792 3.791 2.823-1.395 1.086-3.144 1.729-5.05 1.729-.328 0-.654-.019-.976-.057 1.804 1.162 3.946 1.84 6.266 1.84 7.519 0 11.638-6.285 11.638-11.708 0-.178-.005-.356-.014-.532.799-.586 1.492-1.34 2.04-2.19z" />
							</svg>
						</a> */}

						{/* YouTube */}
						<a href="https://youtube.com/@fastpassdrivingacademy?si=2GgIP7AXlkcIKs65" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="24"
								height="24"
								viewBox="0 0 24 24"
								className="fill-current hover:text-red-500 transition-colors"
							>
								<path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"></path>
							</svg>
						</a>

						{/* Facebook */}
						<a
							href="https://www.facebook.com/people/Fast-Pass-Driving-Academy/61575231142109/"
							target="_blank"
							rel="noopener noreferrer"
							aria-label="Facebook"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="24"
								height="24"
								viewBox="0 0 24 24"
								className="fill-current hover:text-blue-600 transition-colors"
							>
								<path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"></path>
							</svg>
						</a>

						{/* TikTok */}
						<a href="https://www.tiktok.com/@fastpassdrivinggta" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 448 512"
								width="23"
								height="23"
								className="fill-current hover:text-pink-500 transition-colors"
							>
								<path d="M448,209.9v95.5c-45.3,0-88.3-14.3-123.2-38.6V385c0,70.5-57.2,127.7-127.7,127.7S69.4,455.5,69.4,385.1c0-66.1,50.8-120.3,115.5-127.1v95.5c-11.8,3.9-20.3,15.1-20.3,28.1,0,16.4,13.3,29.7,29.7,29.7s29.7-13.3,29.7-29.7V0h95.5c4.5,61.6,55.1,110.6,117.5,110.6v99.3H448z" />
							</svg>
						</a>

						{/* Instagram */}
						<a href="https://www.instagram.com/fastpass_drivingacademy/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 448 512"
								width="24"
								height="24"
								className="fill-current hover:text-pink-500 transition-colors"
							>
								<path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9 114.9-51.3 114.9-114.9S287.6 141 224.1 141zm0 189.6c-41.2 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.5 74.7-74.7 74.7zm146.4-194.3c0 14.9-12.1 27-27 27-14.9 0-27-12.1-27-27s12.1-27 27-27 27 12.1 27 27zm76.1 27.2c-.1-54.9-44.7-99.5-99.6-99.6H99.6C44.7 64.5.1 109.1 0 164v184c.1 54.9 44.7 99.5 99.6 99.6h247c54.9-.1 99.5-44.7 99.6-99.6V164zM398.8 348c0 39.1-31.7 70.8-70.8 70.8H120c-39.1 0-70.8-31.7-70.8-70.8V164c0-39.1 31.7-70.8 70.8-70.8h208c39.1 0 70.8 31.7 70.8 70.8v184z" />
							</svg>
						</a>
					</div>
				</nav>
			</div>
		</footer>
	);
};

export default Footer;
