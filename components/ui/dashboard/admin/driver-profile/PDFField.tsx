'use client';

import React, { useRef } from 'react';
import { FiFileText, FiDownload } from 'react-icons/fi';
import InfoTooltip from './InfoTooltip';

interface ContractPDFFieldProps {
	id: string;
	label: string;
	locked: boolean;
	uploading: boolean;
	fileUrl: string | null;
	onUpload: (file: File) => Promise<void>;
	info?: string;
	infoLabel?: string;
}

export default function ContractPDFField({ label, id, locked, uploading, fileUrl, onUpload, info, infoLabel }: ContractPDFFieldProps) {
	const tooltipLabel = infoLabel ?? `${label} help`;
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		if (locked) return;
		const file = e.target.files?.[0];
		if (file) await onUpload(file);
	};

	const downloadFile = async (url: string, filename: string) => {
		const res = await fetch(url);
		const blob = await res.blob();
		const link = document.createElement('a');
		link.href = window.URL.createObjectURL(blob);
		link.download = filename;
		link.click();
		window.URL.revokeObjectURL(link.href);
	};

	return (
		<div>
			<div className="flex items-center gap-2">
				<strong>{label}:</strong>
				{info && <InfoTooltip label={tooltipLabel} content={info} />}
			</div>
			<div className="relative flex items-center gap-4 mt-2">
				{fileUrl && (
					<div className="flex flex-col items-center justify-center">
						<FiFileText size={64} className="text-gray-700" />
						<p className="text-sm text-gray-600 mt-1 truncate max-w-[160px] text-center">contract-{id}.pdf</p>
					</div>
				)}

				{fileUrl && locked && (
					<button
						onClick={() => fileUrl && downloadFile(fileUrl, `contract-${id}.pdf`)}
						className="text-gray-600 hover:text-gray-800 p-2 rounded-full border border-gray-300"
						title="Download contract PDF"
					>
						<FiDownload size={20} />
					</button>
				)}

				{(!fileUrl || !locked) && (
					<div
						className="relative w-[340px] h-[210px] rounded-xl border border-gray-300 overflow-hidden cursor-pointer bg-slate-50 flex items-center justify-center"
						title={locked ? 'Cannot upload when locked' : 'Tap to upload PDF'}
						onClick={() => !locked && fileInputRef.current?.click()}
					>
						<p className="text-gray-400 z-10">{fileUrl ? 'Replace PDF' : 'No PDF uploaded'}</p>

						{uploading && (
							<div className="absolute inset-0 bg-white bg-opacity-70 z-20 flex items-center justify-center rounded-xl">
								<p className="text-gray-700 font-medium">Uploading...</p>
							</div>
						)}

						<p className="absolute bottom-2 text-center text-gray-500 bg-white bg-opacity-70 rounded px-2 py-1 pointer-events-none select-none">
							{locked ? 'Cannot upload when locked' : 'Tap to upload PDF'}
						</p>

						<input ref={fileInputRef} type="file" disabled={locked} accept="application/pdf" className="hidden" onChange={handleFileChange} />
					</div>
				)}
			</div>
		</div>
	);
}
