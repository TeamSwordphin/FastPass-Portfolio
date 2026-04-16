// components/fields/PhoneField.tsx
import React from 'react';
import { FiPhone, FiMessageSquare } from 'react-icons/fi';
import InfoTooltip from './InfoTooltip';

interface PhoneFieldProps {
	id: string;
	value: string;
	locked: boolean;
	onChange: (val: string) => void;
	onBlur: (val: string) => void;
	info?: string;
	infoLabel?: string;
}

export default function PhoneField({ id, value, locked, onChange, onBlur, info, infoLabel }: PhoneFieldProps) {
	const tooltipLabel = infoLabel ?? 'Phone help';

	return (
		<div>
			<div className="mb-1 flex items-center gap-2">
				<label className="font-semibold" htmlFor={id}>
					Phone Number:
				</label>
				{info && <InfoTooltip label={tooltipLabel} content={info} />}
			</div>

			{locked ? (
				<div className="flex items-center space-x-2">
					<a href={`tel:${value || ''}`} className="flex-1 px-3 py-2 rounded border border-gray-300 bg-gray-100 text-blue-600 underline">
						{value || 'Not provided'}
					</a>
					{/* Call button */}
					<a href={`tel:${value || ''}`} className="p-2 bg-green-500 text-white rounded hover:bg-green-600" title="Call">
						<FiPhone />
					</a>
					{/* Text button */}
					<a href={`sms:${value || ''}`} className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600" title="Text">
						<FiMessageSquare />
					</a>
				</div>
			) : (
				<input
					id={id}
					type="tel"
					value={value || ''}
					onChange={(e) => onChange(e.target.value)}
					onBlur={(e) => onBlur(e.target.value)}
					className="w-full border border-gray-300 rounded px-3 py-2 bg-white"
				/>
			)}
		</div>
	);
}
