'use client';

import React, { useEffect, useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import InfoTooltip from './InfoTooltip';

type Language = {
	id: number;
	name: string;
};

interface InstructorLanguagesProps {
	languages: Language[];
	locked?: boolean;
	onChange?: (newLanguages: Language[]) => void;
	info?: string;
	infoLabel?: string;
}

export default function InstructorLanguages({ languages: initialLanguages, locked = false, onChange, info, infoLabel }: InstructorLanguagesProps) {
	const tooltipLabel = infoLabel ?? 'Languages help';
	const [options, setOptions] = useState<Language[]>([]);
	const [languages, setLanguages] = useState<Language[]>([]);

	useEffect(() => {
		setLanguages(initialLanguages || []);
	}, [initialLanguages]);

	useEffect(() => {
		fetch('/api/admin/editor/areas-servicing/get')
			.then((res) => res.json())
			.then((data) => {
				const list = data?.languages || [];
				setOptions(list.map((lang: any) => ({ id: lang.id, name: lang.name })));
			})
			.catch((err) => console.error('Failed to fetch languages:', err));
	}, []);

	const addLanguage = (languageId: number) => {
		if (locked) return;
		if (!languageId || languages.some((lang) => lang.id === languageId)) return;
		const option = options.find((lang) => lang.id === languageId);
		if (!option) return;

		const updated = [...languages, option];
		setLanguages(updated);
		onChange?.(updated);
	};

	const removeLanguage = (languageId: number) => {
		if (locked) return;
		const updated = languages.filter((lang) => lang.id !== languageId);
		setLanguages(updated);
		onChange?.(updated);
	};

	const renderLockedMessage = () => {
		if (!locked) return null;
		if (languages.length === 0) return <p className="text-gray-500 text-sm">No languages selected. Unlock to add.</p>;
		return null;
	};

	return (
		<div className="mt-4">
			<div className="mb-2 flex items-center gap-2">
				<label className="font-semibold">Languages:</label>
				{info && <InfoTooltip label={tooltipLabel} content={info} />}
			</div>

			{!locked && (
				<div className="mb-2">
					<select
						className="border border-gray-300 rounded-md px-2 py-1 bg-gray-100"
						onChange={(e) => {
							const nextId = Number(e.target.value);
							if (nextId > 0) addLanguage(nextId);
							e.target.value = '';
						}}
						value=""
					>
						<option value="" disabled>
							+ Add Language
						</option>
						{options.map((option) => (
							<option key={option.id} value={option.id} disabled={languages.some((lang) => lang.id === option.id)}>
								{option.name}
							</option>
						))}
					</select>
				</div>
			)}

			<div className="flex flex-wrap gap-2 mt-2">
				{languages.map((lang) => (
					<div key={lang.id} className={`flex items-center bg-gray-100 px-2 py-1 rounded text-fastpassBlue ${locked ? 'opacity-80' : ''}`}>
						{lang.name}
						{!locked && (
							<button onClick={() => removeLanguage(lang.id)} className="ml-2 hover:text-red-600">
								<FaTimes className="text-xs" />
							</button>
						)}
					</div>
				))}
			</div>

			{locked && renderLockedMessage()}
		</div>
	);
}
