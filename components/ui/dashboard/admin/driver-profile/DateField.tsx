import React from 'react';
import InfoTooltip from './InfoTooltip';

interface DateFieldProps {
	id: string;
	label: string;
	value: string | null;
	locked: boolean;
	onChange: (val: string) => void;
	onBlur: (val: string) => void;
	info?: string;
	infoLabel?: string;
	error?: string;
}

export default function DateField({ id, label, value, locked, onChange, onBlur, info, infoLabel, error }: DateFieldProps) {
	const formatted = value ? value.split('T')[0] : '';
	const tooltipLabel = infoLabel ?? `${label} help`;

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
				type="date"
				readOnly={locked}
				value={formatted}
				onChange={(e) => onChange(e.target.value)}
				onClick={(e) => {
					if (locked) return;
					const target = e.currentTarget as HTMLInputElement & { showPicker?: () => void };
					target.showPicker?.();
				}}
				onBlur={(e) => {
					if (e.target.value) {
						onBlur(`${e.target.value} 00:00:00`);
					}
				}}
				className={`w-full border border-gray-300 rounded px-3 py-2 ${locked ? 'bg-gray-200' : 'bg-white'}`}
			/>
			{error && <p className="mt-1 text-sm text-red-600">{error}</p>}
		</div>
	);
}
