'use client';

import { useEffect, useMemo, useRef } from 'react';

const defaultStartTime = '09:00';
const pickerItemHeight = 30;
const pickerVisibleItems = 13;
const pickerPadding = (pickerItemHeight * pickerVisibleItems - pickerItemHeight) / 2;

function parseTimeValue(value: string) {
	const [rawHours, rawMinutes] = value.split(':');
	const hours = Number(rawHours);
	const minutes = Number(rawMinutes);
	if (!Number.isFinite(hours) || !Number.isFinite(minutes)) {
		return { hours: 0, minutes: 0 };
	}
	return { hours, minutes };
}

function formatTimeValue(hours: number, minutes: number) {
	const clampedHours = Math.min(23, Math.max(0, hours));
	const clampedMinutes = Math.min(59, Math.max(0, minutes));
	return `${clampedHours.toString().padStart(2, '0')}:${clampedMinutes.toString().padStart(2, '0')}`;
}

function to24Hour(hour12: number, meridiem: string) {
	const baseHour = hour12 % 12;
	return meridiem === 'PM' ? baseHour + 12 : baseHour;
}

function timeToMinutes(value: string) {
	const parsed = parseTimeValue(value);
	return parsed.hours * 60 + parsed.minutes;
}

function OptionCarousel<T extends string | number>({
	label,
	value,
	options,
	onChange,
	formatOption,
}: {
	label: string;
	value: T;
	options: T[];
	onChange: (nextValue: T) => void;
	formatOption?: (option: T) => string;
}) {
	const containerRef = useRef<HTMLDivElement | null>(null);
	const isDraggingRef = useRef(false);
	const isPointerCapturedRef = useRef(false);
	const isPointerDownRef = useRef(false);
	const activePointerIdRef = useRef<number | null>(null);
	const dragStartY = useRef(0);
	const dragStartScroll = useRef(0);
	const scrollBehaviorRef = useRef<'auto' | 'smooth'>('smooth');
	const dragThreshold = 3;

	const selectedIndex = Math.max(0, options.indexOf(value));
	const formatValue = (option: T) => {
		if (formatOption) return formatOption(option);
		if (typeof option === 'number') return option.toString().padStart(2, '0');
		return option;
	};

	useEffect(() => {
		const container = containerRef.current;
		if (!container) return;
		const targetScrollTop = selectedIndex * pickerItemHeight;
		if (Math.abs(container.scrollTop - targetScrollTop) > 1) {
			container.scrollTo({ top: targetScrollTop, behavior: scrollBehaviorRef.current });
		}
		scrollBehaviorRef.current = 'smooth';
	}, [selectedIndex]);

	const handleScroll = () => {
		const container = containerRef.current;
		if (!container) return;
		scrollBehaviorRef.current = 'auto';
		const index = Math.round(container.scrollTop / pickerItemHeight);
		const clampedIndex = Math.max(0, Math.min(options.length - 1, index));
		const nextValue = options[clampedIndex];
		if (nextValue !== value) {
			onChange(nextValue);
		}
	};

	const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
		const container = containerRef.current;
		if (!container) return;
		isDraggingRef.current = false;
		isPointerCapturedRef.current = false;
		isPointerDownRef.current = true;
		activePointerIdRef.current = event.pointerId;
		scrollBehaviorRef.current = 'auto';
		dragStartY.current = event.clientY;
		dragStartScroll.current = container.scrollTop;
	};

	const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
		const container = containerRef.current;
		if (!container) return;
		if (!isPointerDownRef.current || activePointerIdRef.current !== event.pointerId) return;
		if (event.buttons === 0) {
			isDraggingRef.current = false;
			isPointerDownRef.current = false;
			activePointerIdRef.current = null;
			if (isPointerCapturedRef.current) {
				container.releasePointerCapture(event.pointerId);
				isPointerCapturedRef.current = false;
			}
			return;
		}
		const delta = event.clientY - dragStartY.current;
		if (!isPointerCapturedRef.current && Math.abs(delta) >= dragThreshold) {
			isPointerCapturedRef.current = true;
			isDraggingRef.current = true;
			container.setPointerCapture(event.pointerId);
		}
		if (!isDraggingRef.current) return;
		container.scrollTop = dragStartScroll.current - delta;
	};

	const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
		const container = containerRef.current;
		if (!container) return;
		isDraggingRef.current = false;
		isPointerDownRef.current = false;
		activePointerIdRef.current = null;
		if (isPointerCapturedRef.current) {
			container.releasePointerCapture(event.pointerId);
		}
		isPointerCapturedRef.current = false;
	};

	return (
		<div className="flex flex-col items-center gap-2">
			<span className="text-xs font-medium text-gray-600">{label}</span>
			<div
				ref={containerRef}
				className="relative w-24 overflow-y-auto snap-y snap-mandatory rounded-md border border-gray-200 bg-white text-center scrollbar-none md:w-28 lg:w-32"
				style={{ height: pickerItemHeight * pickerVisibleItems, paddingTop: pickerPadding, paddingBottom: pickerPadding }}
				onScroll={handleScroll}
				onPointerDown={handlePointerDown}
				onPointerMove={handlePointerMove}
				onPointerUp={handlePointerUp}
				onPointerLeave={handlePointerUp}
				onClick={(event) => event.stopPropagation()}
			>
				<div
					className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-md border border-fastpassBlue/40 bg-fastpassBlue/10"
					style={{ height: pickerItemHeight, width: '80%' }}
				/>
				{options.map((option) => {
					const isSelected = option === value;
					return (
						<button
							key={option}
							type="button"
							onClick={(event) => {
								event.stopPropagation();
								scrollBehaviorRef.current = 'auto';
								onChange(option);
							}}
							style={{ height: pickerItemHeight }}
							className={`w-full snap-center text-base transition ${isSelected ? 'font-semibold text-fastpassBlue' : 'text-gray-500'}`}
						>
							{formatValue(option)}
						</button>
					);
				})}
			</div>
		</div>
	);
}

export type TimeCarouselProps = {
	value: string;
	onChange: (nextValue: string) => void;
	minTime?: string;
};

export default function TimeCarousel({ value, onChange, minTime }: TimeCarouselProps) {
	const parsed = parseTimeValue(value || defaultStartTime);
	const hours24 = Number.isFinite(parsed.hours) ? parsed.hours : 0;
	const rawMinutes = Number.isFinite(parsed.minutes) ? parsed.minutes : 0;
	const hourOptions = useMemo(() => Array.from({ length: 12 }, (_, index) => index + 1), []);
	const minuteOptions = useMemo(() => Array.from({ length: 12 }, (_, index) => index * 5), []);
	const meridiemOptions = useMemo(() => ['AM', 'PM'], []);
	const meridiem = hours24 >= 12 ? 'PM' : 'AM';
	const hour12 = hours24 % 12 === 0 ? 12 : hours24 % 12;
	const roundedMinutes = Math.min(55, Math.max(0, Math.round(rawMinutes / 5) * 5));
	const minTimeMinutes = minTime ? timeToMinutes(minTime) : null;

	const isAfterMinTime = (nextHour: number, nextMinutes: number, nextMeridiem: string) => {
		if (minTimeMinutes === null) return true;
		return to24Hour(nextHour, nextMeridiem) * 60 + nextMinutes > minTimeMinutes;
	};

	const getValidHoursFor = (nextMeridiem: string) => {
		if (minTimeMinutes === null) return hourOptions;
		return hourOptions.filter((nextHour) => minuteOptions.some((nextMinutes) => isAfterMinTime(nextHour, nextMinutes, nextMeridiem)));
	};

	const getValidMinutesFor = (nextHour: number, nextMeridiem: string) => {
		if (minTimeMinutes === null) return minuteOptions;
		return minuteOptions.filter((nextMinutes) => isAfterMinTime(nextHour, nextMinutes, nextMeridiem));
	};

	const filteredMeridiemOptions =
		minTimeMinutes === null ? meridiemOptions : meridiemOptions.filter((nextMeridiem) => getValidHoursFor(nextMeridiem).length > 0);
	const meridiemChoices = filteredMeridiemOptions.length > 0 ? filteredMeridiemOptions : meridiemOptions;
	const meridiemIsAllowed = meridiemChoices.includes(meridiem);
	const selectedMeridiem = meridiemIsAllowed ? meridiem : meridiemChoices[0];

	const filteredHourOptions = getValidHoursFor(selectedMeridiem);
	const hourChoices = filteredHourOptions.length > 0 ? filteredHourOptions : hourOptions;
	const selectedHour = meridiemIsAllowed && hourChoices.includes(hour12) ? hour12 : hourChoices[0];

	const filteredMinuteOptions = getValidMinutesFor(selectedHour, selectedMeridiem);
	const minuteChoices = filteredMinuteOptions.length > 0 ? filteredMinuteOptions : minuteOptions;
	const selectedMinutes = meridiemIsAllowed && selectedHour === hour12 && minuteChoices.includes(roundedMinutes) ? roundedMinutes : minuteChoices[0];

	useEffect(() => {
		if (minTimeMinutes === null) return;
		if (filteredMeridiemOptions.length === 0 || filteredHourOptions.length === 0 || filteredMinuteOptions.length === 0) return;
		if (selectedMeridiem !== meridiem || selectedHour !== hour12 || selectedMinutes !== roundedMinutes) {
			onChange(formatTimeValue(to24Hour(selectedHour, selectedMeridiem), selectedMinutes));
		}
	}, [
		minTimeMinutes,
		filteredMeridiemOptions.length,
		filteredHourOptions.length,
		filteredMinuteOptions.length,
		selectedMeridiem,
		meridiem,
		selectedHour,
		hour12,
		selectedMinutes,
		roundedMinutes,
		onChange,
	]);

	return (
		<div className="flex flex-col items-center gap-6">
			<div className="flex items-center gap-4">
				<OptionCarousel
					label="Hours"
					value={selectedHour}
					options={hourChoices}
					onChange={(nextHours) => {
						const validMinutes = getValidMinutesFor(nextHours, selectedMeridiem);
						const nextMinutes = validMinutes.includes(selectedMinutes) ? selectedMinutes : (validMinutes[0] ?? selectedMinutes);
						onChange(formatTimeValue(to24Hour(nextHours, selectedMeridiem), nextMinutes));
					}}
				/>
				<span className="text-base font-semibold text-gray-500">:</span>
				<OptionCarousel
					label="Minutes"
					value={selectedMinutes}
					options={minuteChoices}
					onChange={(nextMinutes) => onChange(formatTimeValue(to24Hour(selectedHour, selectedMeridiem), nextMinutes))}
				/>
				<OptionCarousel
					label="AM/PM"
					value={selectedMeridiem}
					options={meridiemChoices}
					onChange={(nextMeridiem) => {
						const validHours = getValidHoursFor(nextMeridiem);
						const nextHours = validHours.includes(selectedHour) ? selectedHour : (validHours[0] ?? selectedHour);
						const validMinutes = getValidMinutesFor(nextHours, nextMeridiem);
						const nextMinutes = validMinutes.includes(selectedMinutes) ? selectedMinutes : (validMinutes[0] ?? selectedMinutes);
						onChange(formatTimeValue(to24Hour(nextHours, nextMeridiem), nextMinutes));
					}}
				/>
			</div>
		</div>
	);
}
