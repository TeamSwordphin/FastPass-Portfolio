import React from 'react';
import InfoTooltip from './InfoTooltip';

interface TextFieldProps {
	id: string;
	labelTag: string;
	value: string;
	locked: boolean;
	onChange: (val: string) => void;
	onBlur: (val: string) => void;
	info?: string;
	infoLabel?: string;
	error?: string;
}

export default function TextField({ id, labelTag, value, locked, onChange, onBlur, info, infoLabel, error }: TextFieldProps) {
	const tooltipLabel = infoLabel ?? `${labelTag} help`;

	return (
		<div>
			<div className="mb-1 flex items-center gap-2">
				<label className="font-semibold" htmlFor={id}>
					{labelTag}:
				</label>
				{info && <InfoTooltip label={tooltipLabel} content={info} />}
			</div>
			<input
				id={id}
				type="text"
				readOnly={locked}
				value={value || ''}
				onChange={(e) => onChange(e.target.value)}
				onBlur={(e) => onBlur(e.target.value)}
				className={`w-full border border-gray-300 rounded px-3 py-2 ${locked ? 'bg-gray-200' : 'bg-white'}`}
			/>
			{error && <p className="mt-1 text-sm text-red-600">{error}</p>}
		</div>
	);
}
