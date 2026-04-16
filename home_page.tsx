import CollagesClient from '@/features/home/CollagesClient';
import StartBDEButton from '@/features/home/StartBDEButton';
import { FaStar, FaCheckCircle, FaArrowRight, FaTimesCircle, FaFlagCheckered } from 'react-icons/fa';
import Image from 'next/image';
import InstructorCard from '@/features/instructor-profiles/InstructorCard';
import MainServices from '@/features/pricing/MainServices';
import { StudentFormProvider } from '@/contexts/BookLessonLocalStorageContext';
import ReviewsList from '@/features/reviews/ReviewComponent';
import { getPublishedReviews } from '@/lib/reviews';
import { getFeaturedInstructors } from '@/lib/featured-instructors';
import Questions from '@/features/faq/Questions';
import { getActiveSiteEvent } from '@/lib/server/site-events';

export const revalidate = 300;

export default async function Home() {
	const reviews = await getPublishedReviews();
	const activeEvent = await getActiveSiteEvent();
	const heroImageSrc = activeEvent?.heroImageUrl || '/images/webp/home/Hero.webp';
	const badgeImages = [
		{ file: 'badge_award_winning.webp', label: 'Award Winning badge' },
		{ file: 'badge_fairpay.webp', label: 'Fair Pay badge' },
		{ file: 'badge_featured.webp', label: 'Featured badge' },
		{ file: 'badge_former_instructor.webp', label: 'Former Instructor badge' },
		{ file: 'badge_mtoapproved.webp', label: 'MTO Approved badge' },
		{ file: 'badge_no_cutting_corners.webp', label: 'No Cutting Corners badge' },
	].map(({ file, label }) => ({
		src: `/images/webp/home/badges/${file}`,
		alt: label,
	}));

	const customerPhotos = Array.from({ length: 16 }, (_, i) => ({
		src: `/images/webp/customers/customer${i + 1}.webp`,
		width: 4,
		height: 3,
		alt: `Customer ${i + 1}`,
	}));

	const jasonReviews = [
		{ name: 'Priya S.', review: 'Jason kept me calm and explained every maneuver with patience.' },
		{ name: 'Ethan R.', review: 'Super clear instructions and safety tips that stuck with me.' },
		{ name: 'Meghan L.', review: 'Felt fully prepared for my test after two lessons with Jason.' },
	];

	const gregReviews = [
		{ name: 'Daniel K.', review: "Greg's calm, methodical style was perfect for my first lessons." },
		{ name: 'Aisha B.', review: 'He broke things down step by step and boosted my confidence.' },
		{ name: 'Leo M.', review: 'High pass rate makes sense - Greg is thorough and encouraging.' },
	];

	const jeffReviews = [
		{ name: 'Sofia T.', review: "Jeff's experience shows - every tip was practical and test-focused." },
		{ name: 'Marcus V.', review: 'He spotted small mistakes and corrected them quickly.' },
		{ name: 'Kaitlyn C.', review: "Best coaching I've had - clear, direct, and results-driven." },
	];

	const fallbackInstructors = [
		{
			image: '/images/webp/instructors/headshots/2.webp',
			name: 'Jason Ho',
			car: 'Toyota Prius',
			languages: ['English'],
			bio: 'YD-trained lead instructor with 2+ years at Kruzee. Featured instructor and 3x award winner known for patience, safety focus, and clear teaching.',
			reviews: jasonReviews,
		},
		{
			image: '/images/webp/instructors/headshots/greg.webp',
			name: 'Greg Laszlo',
			car: 'Toyota Corolla',
			languages: ['English', 'Hungarian'],
			bio: 'Senior instructor with 9+ years at Young Drivers. Calm, methodical, and known for a high pass rate - specializes in anxious or first-time drivers.',
			reviews: gregReviews,
		},
		{
			image: '/images/webp/instructors/headshots/jeff.webp',
			name: 'Jeff Wu',
			car: 'Toyota Prius',
			languages: ['English', 'Mandarin'],
			bio: 'Master instructor teaching since 2004 with top 2 all-time pass rates at YD. Former senior evaluator and trainer.',
			reviews: jeffReviews,
		},
	];

	const featuredInstructors = await getFeaturedInstructors();

	const instructorCards =
		featuredInstructors === null
			? fallbackInstructors
			: featuredInstructors.map((instructor) => {
					const vehicleLabel = instructor.vehicleModel
						? `${instructor.vehicleYear ? `${instructor.vehicleYear} ` : ''}${instructor.vehicleModel}`
						: 'Unknown vehicle';

					return {
						image: instructor.instructorPortraitUrl ?? undefined,
						name: instructor.name,
						car: vehicleLabel,
						languages: instructor.languages.length > 0 ? instructor.languages : ['Unknown'],
						bio: instructor.instructorBio?.trim() || 'No instructor bio available yet.',
						reviews: instructor.reviews,
					};
				});

	const howItWorks = [
		{
			step: '01',
			title: 'Book Online',
			copy: 'Pick a package, choose your instructor, and schedule instantly.',
			image: 'images/webp/home/schedule.webp',
		},
		{
			step: '02',
			title: 'Learn With Confidence',
			copy: 'YD-trained instructors guide you step-by-step with a proven method.',
			image: 'images/webp/home/steeringwheel.webp',
		},
		{
			step: '03',
			title: 'Pass the Road Test',
			copy: 'We prepare you for everything the examiner expects — no surprises.',
			image: 'images/webp/home/road.webp',
		},
	];

	const comparisonRows = [
		{ feature: 'YD-Trained Instructors', fastPass: 'check', youngDrivers: 'check', local: 'x' },
		{ feature: 'Highest Rated in North York', fastPass: 'check', youngDrivers: 'x', local: 'varies' },
		{ feature: 'No Corner Cutting', fastPass: 'check', youngDrivers: 'check', local: 'x' },
		{ feature: 'Fair-Pay = Better Instructors', fastPass: 'check', youngDrivers: 'check', local: 'x' },
		{ feature: 'Winter Safety Training', fastPass: 'check', youngDrivers: 'check', local: 'x' },
		{ feature: 'Road Test Prep', fastPass: 'check', youngDrivers: 'check', local: 'check' },
		{ feature: 'Price', fastPass: '$795', youngDrivers: '$1599', local: '$850' },
	];

	return (
		<div className="pt-32">
			<div className="font-title">
				{/* Hero Section */}
				<section className="bg-gradient-to-br from-blue-50 via-white to-green-50 text-fastpassBlue">
					<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12 pt-8 pb-16">
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
							<div className="space-y-6 order-2 lg:order-1">
								<div>
									<p className="text-sm uppercase tracking-[0.2em] text-fastpassBlue/70 font-semibold">Fast Pass Driving Academy</p>
									<h1 className="mt-2 text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight text-[#0F2845]">
										Smarter, Safer Driving - Without Cutting Corners
									</h1>
									<p className="mt-3 text-lg sm:text-xl font-semibold text-[#0F2845]">North York&apos;s Highest Rated Driving School</p>
								</div>
								<p className="text-lg sm:text-xl text-[#0F2845] max-w-3xl">
									Fast Pass is raising the standard of driver training with award-winning instructors, fair pricing, modern systems, and a
									student-first teaching experience. No yelling. No corner cutting. Just smarter, safer driving.
								</p>

								<div className="flex flex-wrap gap-3">
									<StartBDEButton className="btn bg-green-600 text-white font-semibold text-lg px-6 rounded-full shadow hover:bg-green-700 border-none" />
								</div>
							</div>

							<div className="relative mb-8 w-full sm:max-w-3xl sm:mx-auto lg:mb-0 lg:ml-auto lg:w-[700px] order-1 lg:order-2">
								<div className="absolute inset-0 rounded-[32px] bg-gradient-to-br from-blue-200/60 to-green-200/60 blur-3xl" />
								<div className="relative rounded-[28px] overflow-hidden shadow-2xl border border-white w-full max-w-full ml-auto aspect-[4/3]">
									<Image
										src={heroImageSrc}
										alt="Student and instructor during driving lesson"
										fill
										priority
										sizes="(min-width: 1024px) 700px, 100vw"
										className="object-cover"
									/>
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* Trusted Badges Content */}
				<section className="bg-white text-[#0F2845]">
					<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12 py-10">
						<div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
							<div className="grid w-full grid-cols-3 sm:grid-cols-6 lg:grid-cols-6 gap-4 items-center">
								{badgeImages.map((badge) => (
									<div
										key={badge.src}
										className="flex h-full w-full items-center justify-center rounded-xl border border-fastpassBlue/10 bg-slate-50 px-4 py-6 shadow-sm"
									>
										<Image
											src={badge.src}
											alt={badge.alt}
											width={200}
											height={200}
											sizes="(min-width: 640px) 180px, 40vw"
											className="h-32 w-auto max-w-full object-contain"
										/>
									</div>
								))}
							</div>
						</div>
					</div>
				</section>

				{/* North York's Highest Rated School */}
				<section className="bg-gradient-to-br from-blue-50 via-slate-50 to-green-50 text-[#0F2845]">
					<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12 py-14">
						<div className="mx-auto max-w-3xl space-y-4 text-center rounded-2xl border border-white/60 bg-white/70 px-6 py-8 shadow-lg">
							<p className="text-sm uppercase tracking-[0.2em] text-fastpassBlue/70 font-semibold">North York&apos;s Highest-Rated School</p>
							<h2 className="text-3xl sm:text-4xl font-extrabold">North York&apos;s highest-rated school</h2>
							<p className="text-lg font-semibold text-fastpassBlue">
								<FaStar className="inline text-yellow-500 mr-2" aria-hidden />
								<span className="align-middle">4.9/5 Average Rating</span>
							</p>
							<p className="text-base text-[#0F2845]/80">
								From hundreds of students across Google, community groups, referrals, and returning families. Students choose Fast Pass because we
								deliver better instructors, better service, and better results - at almost half the price of Young Drivers.
							</p>
							<a
								href="/reviews"
								className="inline-flex text-sm font-semibold text-fastpassBlue underline underline-offset-4 hover:text-fastpassBlue/80"
							>
								See Why Students Love Us
							</a>
						</div>
					</div>
				</section>

				{/* Instructors Section */}
				<section className="bg-gradient-to-br from-blue-50 via-slate-50 to-green-50 text-[#0F2845] py-14">
					<div className="max-w-full mx-auto px-4 sm:px-6 2xl:px-64 space-y-8">
						<div className="text-center space-y-3">
							<p className="text-sm uppercase tracking-[0.2em] text-fastpassBlue/70 font-semibold">Meet your Instructors</p>
							<h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F2845]">Award-winning mentors with flawless ratings</h2>
							<p className="text-base text-[#0F2845]/80">Handpicked mentors focused on safety, clarity, and confidence for every student.</p>
						</div>
						<div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
							{instructorCards.map((inst, idx) => (
								<InstructorCard
									key={idx}
									image={inst.image}
									name={inst.name}
									car={inst.car}
									languages={inst.languages}
									bio={inst.bio}
									reviews={inst.reviews}
								/>
							))}
						</div>
					</div>
				</section>

				{/* Fast Pass Difference */}
				<section className="bg-gradient-to-br from-emerald-50 via-white to-slate-50 text-[#0F2845] py-14">
					<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12 space-y-8">
						<div className="text-center space-y-2">
							<p className="text-sm uppercase tracking-[0.2em] text-fastpassBlue/70 font-semibold">What Makes Fast Pass Different</p>
							<h2 className="text-3xl sm:text-4xl font-extrabold">We&apos;re raising industry standards for students and instructors</h2>
						</div>

						<div className="grid gap-6 lg:grid-cols-2">
							<div className="rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-lg">
								<h3 className="text-xl font-semibold mb-4">For Students</h3>
								<ul className="space-y-3">
									{[
										'1-on-1 instruction (never rushed)',
										'Modern lesson structure',
										'Winter safety session included',
										'Clean, safe school vehicles',
										'Transparent pricing (no hidden fees)',
										'Easy online booking + reminders',
									].map((item) => (
										<li key={item} className="flex gap-3 items-start">
											<FaCheckCircle className="mt-1 text-emerald-600" aria-hidden />
											<span>{item}</span>
										</li>
									))}
								</ul>
							</div>

							<div className="rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-lg">
								<h3 className="text-xl font-semibold mb-4">For Instructors</h3>
								<ul className="space-y-3">
									{[
										'Fair pay = better teaching quality',
										'Supportive, professional culture',
										'Long-term development',
										'Zero overloading',
										'Safety-first teaching philosophy',
									].map((item) => (
										<li key={item} className="flex gap-3 items-start">
											<FaCheckCircle className="mt-1 text-emerald-600" aria-hidden />
											<span>{item}</span>
										</li>
									))}
								</ul>
							</div>
						</div>

						<div className="flex justify-center">
							<StartBDEButton
								className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-3 text-white font-semibold shadow-lg hover:bg-emerald-500 transition"
								label={
									<span className="inline-flex items-center gap-2">
										<span>Experience the Fast Pass Difference</span>
										<FaArrowRight aria-hidden />
									</span>
								}
							/>
						</div>
					</div>
				</section>

				{/* How It Works */}
				<section className="bg-white text-[#0F2845] py-14">
					<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12 space-y-10">
						<div className="text-center space-y-2">
							<p className="text-sm uppercase tracking-[0.2em] text-fastpassBlue/70 font-semibold">How it works</p>
							<h2 className="text-3xl sm:text-4xl font-extrabold">A clear three-step path to passing</h2>
						</div>

						<div className="space-y-8">
							<div className="relative max-w-4xl mx-auto">
								<div className="absolute left-6 top-0 bottom-0 hidden sm:block border-l-2 border-emerald-100" aria-hidden />
								{howItWorks.map((step, idx) => (
									<div key={step.step} className="relative pl-14 sm:pl-20 py-4">
										<div className="absolute left-3 sm:left-4 top-6 w-6 h-6 rounded-full bg-white border-2 border-emerald-500 flex items-center justify-center shadow">
											<span className="text-xs font-bold text-emerald-700">{step.step}</span>
										</div>
										<div className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-lg">
											<div className="hidden sm:block w-20 h-16 rounded-lg overflow-hidden relative shadow-inner bg-slate-100">
												<Image src={`/${step.image}`} alt={step.title} fill sizes="80px" className="object-cover" />
											</div>
											<div className="space-y-1">
												<h3 className="text-xl font-semibold flex items-center gap-2">
													<FaCheckCircle className="text-emerald-600" aria-hidden />
													<span>{step.title}</span>
												</h3>
												<p className="text-base text-[#0F2845]/80">{step.copy}</p>
											</div>
										</div>
									</div>
								))}
							</div>
						</div>
					</div>
				</section>

				{/* Fast Pass vs Other Schools */}
				<section className="bg-white text-[#0F2845] py-12">
					<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12 space-y-6">
						<div className="text-center space-y-2">
							<p className="text-sm uppercase tracking-[0.2em] text-fastpassBlue/70 font-semibold">Fast Pass vs Other Schools</p>
							<h2 className="text-3xl sm:text-4xl font-extrabold">Why we’re the better choice</h2>
						</div>

						<div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-lg">
							<table className="min-w-full text-left text-sm">
								<thead className="bg-slate-50 text-[#0F2845]">
									<tr>
										<th className="px-4 py-3 font-semibold">Feature</th>
										<th className="px-4 py-3 font-semibold text-center bg-emerald-50">
											<div className="flex justify-center">
												<Image src="/images/webp/nav/FastNavy.webp" alt="Fast Pass" width={120} height={32} className="h-8 w-auto" />
											</div>
										</th>
										<th className="px-4 py-3 font-semibold text-center">
											<span className="block">Leading</span>
											<span className="block">National Brand</span>
										</th>
										<th className="px-4 py-3 font-semibold text-center">Other Schools</th>
									</tr>
								</thead>
								<tbody>
									{comparisonRows.map((row, idx) => {
										const isPriceRow = row.feature === 'Price';

										return (
											<tr key={row.feature} className={isPriceRow ? 'bg-emerald-50/60' : idx % 2 === 0 ? 'bg-white' : 'bg-slate-100'}>
												<td className={`px-4 py-3 font-medium ${isPriceRow ? 'text-fastpassBlue font-bold' : ''}`}>{row.feature}</td>
												{(['fastPass', 'youngDrivers', 'local'] as const).map((col) => {
													const value = row[col];
													const highlightPrice = isPriceRow && col === 'fastPass';
													return (
														<td
															key={col}
															className={`px-4 py-6 text-center ${
																isPriceRow ? 'text-lg sm:text-xl font-bold text-slate-900' : 'text-2xl'
															} ${col === 'fastPass' ? 'bg-emerald-50/80 font-semibold' : ''}`}
														>
															{value === 'check' && <FaCheckCircle className="mx-auto text-emerald-600" aria-hidden />}
															{value === 'x' && <FaTimesCircle className="mx-auto text-rose-500" aria-hidden />}
															{value === 'varies' && <span className="text-sm text-slate-600">varies</span>}
															{value !== 'check' && value !== 'x' && value !== 'varies' && (
																<span
																	className={`inline-flex items-center justify-center rounded-full px-4 py-1 ${
																		highlightPrice ? 'border-2 border-emerald-600 bg-emerald-100/80 text-emerald-700 shadow-sm' : ''
																	}`}
																>
																	{value}
																</span>
															)}
														</td>
													);
												})}
											</tr>
										);
									})}
								</tbody>
							</table>
						</div>
					</div>
				</section>

				{/* Packages & Pricing */}
				<section className="bg-gradient-to-br from-white via-white to-emerald-50 text-[#0F2845] py-14">
					<div className="mx-auto max-w-full px-4 sm:px-6 lg:px-12 space-y-6">
						<div className="text-center space-y-2">
							<p className="text-sm uppercase tracking-[0.2em] text-fastpassBlue/70 font-semibold">Packages &amp; Pricing</p>
							<h2 className="text-3xl sm:text-4xl font-extrabold">The Best Value in North York</h2>
							<p className="text-base text-[#0F2845]/80">
								Half the cost of the <span className="text-[#ec344b]">Leading National Brand</span>. Same quality — for{' '}
								<span className="inline-flex items-center rounded-full bg-emerald-100/80 px-3 py-0.5 text-lg font-semibold text-emerald-700 shadow-sm">
									half the price
								</span>
								!
							</p>
						</div>
						<div className=" bg-transparent p-6">
							<StudentFormProvider>
								<MainServices />
							</StudentFormProvider>
						</div>
					</div>
				</section>

				{/* Reviews Section */}
				<section className="bg-white text-[#0F2845] py-12">
					<div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-6">
						<div className="text-center space-y-2">
							<p className="text-sm uppercase tracking-[0.2em] text-fastpassBlue/70 font-semibold">5-Star Reviews</p>
							<h2 className="text-3xl sm:text-4xl font-extrabold">What other students are saying</h2>
						</div>
						{reviews.length === 0 ? (
							<p className="text-center text-gray-600">Reviews are loading, please check back later.</p>
						) : (
							<ReviewsList reviews={reviews} maxCount={3} />
						)}
						<div className="flex justify-center">
							<a
								href="/reviews"
								className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-3 text-white font-semibold shadow-lg hover:bg-emerald-500 transition"
							>
								See All Reviews
								<FaArrowRight aria-hidden />
							</a>
						</div>
					</div>
				</section>

				{/* FAQ Section */}
				<section className="bg-gradient-to-br from-slate-50 via-white to-emerald-50 text-[#0F2845] py-12">
					<div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-6">
						<div className="text-center space-y-2">
							<p className="text-sm uppercase tracking-[0.2em] text-fastpassBlue/70 font-semibold">FAQs</p>
							<h2 className="text-3xl sm:text-4xl font-extrabold">Frequently Asked Questions</h2>
						</div>
						<Questions />
						<div className="flex justify-center">
							<StartBDEButton
								label={
									<span className="inline-flex items-center gap-2">
										Get the Best Value in North York
										<FaArrowRight aria-hidden />
									</span>
								}
								className="rounded-full bg-emerald-600 px-6 py-3 text-white font-semibold shadow-lg hover:bg-emerald-500 transition"
							/>
						</div>
					</div>
				</section>

				<section className="bg-white py-12">
					<div className="mx-auto max-w-full px-4 sm:px-6 lg:px-32">
						<CollagesClient photos={customerPhotos} />
					</div>
				</section>

				{/* Final CTA */}
				<section className="bg-gradient-to-br from-emerald-600 via-emerald-500 to-blue-500 text-white py-12">
					<div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center space-y-4 py-16">
						<h2 className="text-3xl sm:text-4xl font-extrabold">Ready to Learn Smarter, Safer Driving?</h2>
						<p className="text-lg sm:text-xl text-white/90">Join North York&apos;s Highest Rated School — No Corner Cutting.</p>
						<div className="flex justify-center">
							<StartBDEButton
								label="Get Started Today"
								icon={<FaFlagCheckered aria-hidden />}
								className="inline-flex items-center gap-2 rounded-full bg-white text-emerald-700 px-6 py-3 text-lg font-semibold shadow-lg hover:bg-emerald-50 transition"
							/>
						</div>
					</div>
				</section>
			</div>
		</div>
	);
}
