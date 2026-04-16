import React from 'react';
import InfoTooltip from './InfoTooltip';

interface SelectFieldProps {
	id: string;
	label: string;
	value: string;
	locked: boolean;
	options: {
		value: string;
		label: string;
	}[];
	onChange: (val: string) => void;
	onBlur: (val: string) => void;
	info?: string;
	infoLabel?: string;
	error?: string;
}

export default function SelectField({ id, label, value, locked, options, onChange, onBlur, info, infoLabel, error }: SelectFieldProps) {
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
				value={value || ''}
				disabled={locked}
				onChange={(e) => onChange(e.target.value)}
				onBlur={(e) => onBlur(value)}
				className={`w-full border border-gray-300 rounded px-3 py-2 ${locked ? 'bg-gray-200' : 'bg-white'}`}
			>
				<option value="">Select type</option>
				{options.map((opt) => (
					<option key={opt.value} value={opt.value}>
						{opt.label}
					</option>
				))}
			</select>
			{error && <p className="mt-1 text-sm text-red-600">{error}</p>}
		</div>
	);
}
