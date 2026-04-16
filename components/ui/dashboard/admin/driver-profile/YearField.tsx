import React from 'react';
import InfoTooltip from './InfoTooltip';

interface YearFieldProps {
	id: string;
	label: string;
	value: string | null;
	locked: boolean;
	onChange: (val: string) => void;
	onBlur: (val: string) => void;
	startYear?: number; // optional range start
	endYear?: number; // optional range end
	info?: string;
	infoLabel?: string;
}

export default function YearField({
	id,
	label,
	value,
	locked,
	onChange,
	onBlur,
	startYear = 1950,
	endYear = new Date().getFullYear(),
	info,
	infoLabel,
}: YearFieldProps) {
	const years = Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i);
	const formatted = value ? value.substring(0, 4) : '';
	const tooltipLabel = infoLabel ?? `${label} help`;

	return (
		<div>
			<div className="mb-1 flex items-center gap-2">
				<label className="font-semibold" htmlFor={id}>
					{label}:
				</label>
				{info && <InfoTooltip label={tooltipLabel} content={info} />}
			</div>
			<select
				id={id}
				disabled={locked}
				value={formatted}
				onChange={(e) => onChange(e.target.value)}
				onBlur={(e) => {
					if (e.target.value) {
						onBlur(`${e.target.value}-01-01 00:00:00`);
					}
				}}
				className={`w-full border border-gray-300 rounded px-3 py-2 ${locked ? 'bg-gray-200' : 'bg-white'}`}
			>
				<option value="">Select year</option>
				{years.map((year) => (
					<option key={year} value={year}>
						{year}
					</option>
				))}
			</select>
		</div>
	);
}
