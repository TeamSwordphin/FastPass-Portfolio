import React from 'react';
import InfoTooltip from './InfoTooltip';

interface AddressFieldProps {
	id: string;
	value: string;
	locked: boolean;
	onChange: (val: string) => void;
	onBlur: (val: string) => void;
	info?: string;
	infoLabel?: string;
}

export default function AddressField({ id, value, locked, onChange, onBlur, info, infoLabel }: AddressFieldProps) {
	const tooltipLabel = infoLabel ?? 'Address help';

	return (
		<div>
			<div className="mb-1 flex items-center gap-2">
				<label className="font-semibold" htmlFor={id}>
					Full Address:
				</label>
				{info && <InfoTooltip label={tooltipLabel} content={info} />}
			</div>
			{locked ? (
				<a
					href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(value || '')}`}
					target="_blank"
					rel="noopener noreferrer"
					className="block w-full px-3 py-2 rounded border border-gray-300 bg-gray-100 text-blue-600 underline break-words"
				>
					{value || 'No address provided'}
				</a>
			) : (
				<textarea
					id={id}
					value={value || ''}
					onChange={(e) => onChange(e.target.value)}
					onBlur={(e) => onBlur(e.target.value)}
					className="w-full border border-gray-300 rounded px-3 py-2 bg-white"
					rows={3}
				/>
			)}
		</div>
	);
}
