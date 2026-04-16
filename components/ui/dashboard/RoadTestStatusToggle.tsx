'use client';

import { useEffect, useState } from 'react';
import { isRoadTestStatus, type RoadTestStatus } from '@/lib/types/road-tests';

const STATUS_OPTIONS: { value: RoadTestStatus; label: string; activeClass: string; idleClass: string }[] = [
	{
		value: 'pending',
		label: 'Pending',
		activeClass: 'bg-slate-900 text-white border-slate-900',
		idleClass: 'bg-white text-slate-700 border-slate-200 hover:border-slate-300',
	},
	{
		value: 'passed',
		label: 'Passed',
		activeClass: 'bg-emerald-600 text-white border-emerald-600',
		idleClass: 'bg-white text-emerald-700 border-emerald-200 hover:border-emerald-400',
	},
	{
		value: 'failed',
		label: 'Failed',
		activeClass: 'bg-rose-600 text-white border-rose-600',
		idleClass: 'bg-white text-rose-700 border-rose-200 hover:border-rose-400',
	},
];

type RoadTestStatusToggleProps = {
	bookingId: string;
	initialStatus?: RoadTestStatus | null;
	onStatusChange?: (status: RoadTestStatus) => void;
	className?: string;
	disabled?: boolean;
	canUpdate?: boolean;
	disabledReason?: string;
};

export default function RoadTestStatusToggle({
	bookingId,
	initialStatus = 'pending',
	onStatusChange,
	className = '',
	disabled = false,
	canUpdate,
	disabledReason,
}: RoadTestStatusToggleProps) {
	const [status, setStatus] = useState<RoadTestStatus>(initialStatus ?? 'pending');
	const [isSaving, setIsSaving] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const isUpdateBlocked = canUpdate === false;
	const isDisabled = disabled || isSaving || isUpdateBlocked;

	useEffect(() => {
		if (initialStatus && isRoadTestStatus(initialStatus)) {
			setStatus(initialStatus);
		}
	}, [initialStatus]);

	const updateStatus = async (nextStatus: RoadTestStatus) => {
		if (isSaving || isDisabled || nextStatus === status) return;
		const previous = status;
		setStatus(nextStatus);
		setIsSaving(true);
		setError(null);

		try {
			const res = await fetch('/api/road-tests/status', {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ bookingId, status: nextStatus }),
			});

			if (!res.ok) {
				const payload = await res.json().catch(() => null);
				throw new Error(payload?.error || 'Failed to update road test status.');
			}

			const data = await res.json();
			const updated = isRoadTestStatus(data?.status) ? data.status : nextStatus;
			setStatus(updated);
			onStatusChange?.(updated);
		} catch (err) {
			setStatus(previous);
			setError(err instanceof Error ? err.message : 'Failed to update road test status.');
		} finally {
			setIsSaving(false);
		}
	};

	return (
		<div className={`rounded-lg border border-slate-200 bg-slate-50 p-4 ${className}`.trim()}>
			<div className="flex flex-wrap items-start justify-between gap-3">
				<div>
					<p className="text-sm font-semibold text-slate-900">Road Test Status</p>
					<p className="text-xs text-slate-500">Set the outcome once the road test is complete.</p>
				</div>
				{isSaving && <span className="text-xs text-slate-500">Saving...</span>}
			</div>

			<div className="mt-3 grid gap-2 sm:grid-cols-3">
				{STATUS_OPTIONS.map((option) => {
					const isActive = status === option.value;
					return (
						<button
							key={option.value}
							type="button"
							disabled={isDisabled}
							onClick={() => updateStatus(option.value)}
							className={`rounded-md border px-3 py-2 text-sm font-semibold transition ${
								isActive ? option.activeClass : option.idleClass
							} ${isDisabled ? 'cursor-not-allowed opacity-70' : ''}`.trim()}
							aria-pressed={isActive}
						>
							{option.label}
						</button>
					);
				})}
			</div>

			{isUpdateBlocked && !error && (
				<p className="mt-2 text-xs text-slate-500">{disabledReason ?? 'Status updates unlock within 2 days of the scheduled road test.'}</p>
			)}
			{error && <p className="mt-2 text-xs text-rose-600">{error}</p>}
		</div>
	);
}
