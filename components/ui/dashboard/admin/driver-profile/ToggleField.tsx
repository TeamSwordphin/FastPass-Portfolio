import React from 'react';
import InfoTooltip from './InfoTooltip';

interface ToggleFieldProps {
	id: string;
	labelTag: string;
	value: boolean;
	locked: boolean;
	onChange: (val: boolean) => void;
	onBlur: (val: boolean) => void;
	info?: string;
	infoLabel?: string;
}

export default function ToggleField({ id, labelTag, value, locked, onChange, onBlur, info, infoLabel }: ToggleFieldProps) {
	const handleToggle = () => {
		if (locked) return;
		onChange(!value);
		onBlur(!value);
	};

	const tooltipLabel = infoLabel ?? `${labelTag} help`;

	return (
		<div className="flex items-center space-x-3">
			<div className="flex items-center gap-2">
				<label htmlFor={id} className="font-semibold min-w-[100px]">
					{labelTag}:
				</label>
				{info && <InfoTooltip label={tooltipLabel} content={info} />}
			</div>
			<button
				id={id}
				type="button"
				onClick={handleToggle}
				disabled={locked}
				className={`relative inline-flex items-center h-6 rounded-full w-12 transition-colors ${
					value ? 'bg-green-500' : 'bg-gray-300'
				} ${locked ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
			>
				<span className={`inline-block w-5 h-5 transform bg-white rounded-full transition-transform ${value ? 'translate-x-6' : 'translate-x-1'}`} />
			</button>
			<span className="text-sm">{value ? 'Yes' : 'No'}</span>
		</div>
	);
}
