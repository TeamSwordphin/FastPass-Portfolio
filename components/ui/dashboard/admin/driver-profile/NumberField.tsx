import React, { useEffect, useRef, useState } from 'react';
import InfoTooltip from './InfoTooltip';

interface NumberFieldProps {
	id: string;
	label: string;
	value: number;
	locked: boolean;
	onChange: (val: number) => void;
	onBlur: (val: number) => void;
	step?: number;
	min?: number;
	max?: number;
	info?: string;
	infoLabel?: string;
	error?: string;
}

export default function NumberField({
	id,
	label,
	value,
	locked,
	onChange,
	onBlur,
	step = 1,
	min = 0,
	max,
	info,
	infoLabel,
	error,
}: NumberFieldProps) {
	const tooltipLabel = infoLabel ?? `${label} help`;
	const [draft, setDraft] = useState(() => (Number.isFinite(value) ? String(value) : ''));
	const [isFocused, setIsFocused] = useState(false);
	const lastCommittedRef = useRef<number | null>(Number.isFinite(value) ? value : null);
	const isDirtyRef = useRef(false);
	const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	useEffect(() => {
		if (!isFocused && !isDirtyRef.current) {
			setDraft(Number.isFinite(value) ? String(value) : '');
			lastCommittedRef.current = Number.isFinite(value) ? value : null;
		}
	}, [value, isFocused]);

	useEffect(() => {
		return () => {
			if (saveTimerRef.current) {
				clearTimeout(saveTimerRef.current);
			}
		};
	}, []);

	const parseValue = (raw: string) => {
		const trimmed = raw.trim();
		if (!trimmed) return null;
		const parsed = Number(trimmed);
		return Number.isFinite(parsed) ? parsed : null;
	};

	const commitValue = (raw: string) => {
		const parsed = parseValue(raw);
		if (parsed === null) return;
		if (!isDirtyRef.current && lastCommittedRef.current === parsed) return;
		lastCommittedRef.current = parsed;
		isDirtyRef.current = false;
		onBlur(parsed);
	};

	const scheduleCommit = (raw: string) => {
		if (locked) return;
		if (saveTimerRef.current) {
			clearTimeout(saveTimerRef.current);
		}
		saveTimerRef.current = setTimeout(() => commitValue(raw), 500);
	};

	return (
		<div>
			<div className="mb-1 flex items-center gap-2">
				<label className="font-semibold" htmlFor={id}>
					{label}:
				</label>
				{info && <InfoTooltip label={tooltipLabel} content={info} />}
			</div>
			<input
				id={id}
				type="number"
				readOnly={locked}
				min={min}
				max={max}
				step={step}
				value={draft}
				onChange={(e) => {
					const nextValue = e.target.value;
					setDraft(nextValue);
					const parsed = parseValue(nextValue);
					if (parsed !== null) {
						isDirtyRef.current = true;
						onChange(parsed);
					}
					scheduleCommit(nextValue);
				}}
				onFocus={() => setIsFocused(true)}
				onBlur={(e) => {
					setIsFocused(false);
					if (saveTimerRef.current) {
						clearTimeout(saveTimerRef.current);
					}
					const raw = e.target.value;
					const parsed = parseValue(raw);
					if (parsed === null) {
						setDraft(lastCommittedRef.current !== null ? String(lastCommittedRef.current) : '');
						isDirtyRef.current = false;
						return;
					}
					commitValue(raw);
				}}
				className={`w-full border border-gray-300 rounded px-3 py-2 ${locked ? 'bg-gray-200 cursor-not-allowed' : 'bg-white'}`}
			/>
			{error && <p className="mt-1 text-sm text-red-600">{error}</p>}
		</div>
	);
}
