'use client';

import React from 'react';
import MobileActionsPopover from '@/components/ui/dashboard/MobileActionsPopover';
import { useRouter, usePathname } from 'next/navigation';
import type { Dispatch, SetStateAction } from 'react';
import { isFutureLesson } from '@/lib/util/isFutureLessons';
import type { RoadTestStatus } from '@/lib/types/road-tests';

interface Lesson {
	id: string;
	date: string;
	time: string;
	location: string;
	instructor: string;
	timestamp: number;
	roadTestStatus?: RoadTestStatus;
	roadTestDetails?: {
		pickupTime: string;
		roadTestTime: string;
		pickupLocation: string;
		locationOptionValue: string;
	};
	userId?: string | null;
	name?: string | null;
}

interface LessonsTableProps {
	lessons: Lesson[];
	userId?: string | null;
	openPopoverId: string | null;
	setOpenPopoverId: Dispatch<SetStateAction<string | null>>;
}

export default function LessonsTable({ lessons, userId, openPopoverId, setOpenPopoverId }: LessonsTableProps) {
	const router = useRouter();
	const pathname = usePathname();
	const showUserColumn = pathname === '/dashboard/admin/bookings';
	const showStatusColumn = lessons.some((lesson) => lesson.roadTestStatus);

	const statusConfig: Record<RoadTestStatus, { label: string; className: string }> = {
		pending: {
			label: 'Pending',
			className: 'border-amber-200 bg-amber-50 text-amber-700',
		},
		passed: {
			label: 'Passed',
			className: 'border-emerald-200 bg-emerald-50 text-emerald-700',
		},
		failed: {
			label: 'Failed',
			className: 'border-rose-200 bg-rose-50 text-rose-700',
		},
	};

	const renderStatus = (status?: RoadTestStatus) => {
		const resolved = status ?? 'pending';
		const config = statusConfig[resolved];
		return (
			<span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold ${config.className}`}>{config.label}</span>
		);
	};

	const handleRowClick = (lessonId: string, lessonUserId: string | null = null) => {
		const targetUserId = lessonUserId ?? userId;
		router.push(`/dashboard/lessons-review/${lessonId}?userId=${targetUserId}`);
	};

	const stopPropagation = (e: React.MouseEvent) => {
		e.stopPropagation();
	};

	return (
		<table className="min-w-full bg-white border border-gray-200 shadow-sm rounded-lg">
			<thead className="bg-gray-100 text-gray-700 text-sm font-semibold">
				<tr>
					<th className="py-3 px-4 text-left">#</th>
					<th className="py-3 px-4 text-left">Date</th>
					<th className="py-3 px-4 text-left">Time</th>
					<th className="py-3 px-4 text-left hidden sm:table-cell">Location</th>
					<th className="py-3 px-4 text-left hidden sm:table-cell">Instructor</th>
					{showStatusColumn && <th className="py-3 px-4 text-left hidden sm:table-cell">Status</th>}
					{showUserColumn && <th className="py-3 px-4 text-left hidden sm:table-cell">User</th>}
					<th className="py-3 px-4 text-left hidden sm:table-cell">Actions</th>
					<th className="py-3 px-4 text-left sm:hidden">Menu</th>
				</tr>
			</thead>
			<tbody className="text-sm text-gray-800">
				{lessons.map((lesson, index) => (
					<tr
						key={lesson.id}
						className="border-t border-gray-200 hover:bg-gray-50 relative cursor-pointer"
						onClick={() => handleRowClick(lesson.id, lesson.userId ?? null)}
					>
						<td className="py-3 px-4">{index + 1}</td>
						<td className="py-3 px-4">{lesson.date}</td>
						<td className="py-3 px-4">{lesson.time}</td>
						<td className="py-3 px-4 hidden sm:table-cell">
							<a
								href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(lesson.location)}`}
								target="_blank"
								rel="noopener noreferrer"
								className="text-blue-600 hover:underline"
								onClick={stopPropagation}
							>
								{lesson.location}
							</a>
							{lesson.roadTestDetails && (
								<div className="mt-1 text-xs text-gray-500">
									<div>Pickup time: {lesson.roadTestDetails.pickupTime}</div>
									<div>Road test time: {lesson.roadTestDetails.roadTestTime}</div>
									<div>Pickup location: {lesson.roadTestDetails.pickupLocation}</div>
									<div>Test location: {lesson.roadTestDetails.locationOptionValue}</div>
								</div>
							)}
						</td>
						<td className="py-3 px-4 hidden sm:table-cell">{lesson.instructor}</td>
						{showStatusColumn && <td className="py-3 px-4 hidden sm:table-cell">{renderStatus(lesson.roadTestStatus)}</td>}
						{showUserColumn && <td className="py-3 px-4 hidden sm:table-cell">{lesson.name || 'N/A'}</td>}

						{/* Actions - Desktop */}
						<td className="py-3 px-4 hidden sm:table-cell space-x-2">
							{isFutureLesson(lesson.timestamp) ? (
								(showUserColumn || !showUserColumn) && (
									<>
										<a
											href={`https://cal.com/reschedule/${lesson.id}`}
											target="_blank"
											rel="noopener noreferrer"
											className="text-sm px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
											onClick={stopPropagation}
										>
											Reschedule
										</a>
										<a
											href={`https://cal.com/booking/${lesson.id}?cancel=true&allRemainingBookings=false`}
											target="_blank"
											rel="noopener noreferrer"
											className="text-sm px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
											onClick={stopPropagation}
										>
											Cancel
										</a>
									</>
								)
							) : (
								<span className="text-green-600 font-semibold">Completed</span>
							)}
						</td>

						{/* Actions - Mobile */}
						<td className="py-3 px-4 sm:hidden">
							<div onClick={stopPropagation}>
								<MobileActionsPopover id={lesson.id} openPopoverId={openPopoverId} setOpenPopoverId={setOpenPopoverId}>
									<div>
										<span className="font-semibold">Location: </span>
										<a
											href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(lesson.location)}`}
											target="_blank"
											rel="noopener noreferrer"
											className="text-blue-600 hover:underline"
											onClick={stopPropagation}
										>
											{lesson.location}
										</a>
									</div>
									{lesson.roadTestDetails && (
										<div className="text-xs text-gray-600">
											<div>Pickup time: {lesson.roadTestDetails.pickupTime}</div>
											<div>Road test time: {lesson.roadTestDetails.roadTestTime}</div>
											<div>Pickup location: {lesson.roadTestDetails.pickupLocation}</div>
											<div>Test location: {lesson.roadTestDetails.locationOptionValue}</div>
										</div>
									)}
									{showStatusColumn && (
										<div className="mt-2">
											<span className="font-semibold">Status: </span>
											{renderStatus(lesson.roadTestStatus)}
										</div>
									)}
									<div>
										<span className="font-semibold">Instructor: </span>
										{lesson.instructor}
									</div>
									{showUserColumn && (
										<div>
											<span className="font-semibold">User: </span>
											{lesson.name || 'N/A'}
										</div>
									)}

									<div className="mt-2">
										{isFutureLesson(lesson.timestamp) ? (
											<>
												<a
													href={`https://cal.com/reschedule/${lesson.id}`}
													target="_blank"
													rel="noopener noreferrer"
													className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
													onClick={stopPropagation}
												>
													Reschedule
												</a>
												<a
													href={`https://cal.com/booking/${lesson.id}?cancel=true&allRemainingBookings=false`}
													target="_blank"
													rel="noopener noreferrer"
													className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
													onClick={stopPropagation}
												>
													Cancel
												</a>
											</>
										) : (
											<div className="text-green-600 font-semibold">Completed</div>
										)}
									</div>
								</MobileActionsPopover>
							</div>
						</td>
					</tr>
				))}
			</tbody>
		</table>
	);
}
