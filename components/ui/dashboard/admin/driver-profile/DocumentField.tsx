'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { FiDownload, FiFileText, FiSearch } from 'react-icons/fi';
import InfoTooltip from './InfoTooltip';

interface DocumentFieldProps {
	id: string;
	label: string;
	locked: boolean;
	uploading: boolean;
	fileUrl: string | null;
	fileKey?: string | null;
	accept?: string;
	onUpload: (file: File) => Promise<void>;
	info?: string;
	infoLabel?: string;
}

const imageExtensions = new Set(['png', 'jpg', 'jpeg', 'webp', 'gif', 'bmp', 'avif', 'heic', 'heif']);

const getFileExtension = (value?: string | null) => {
	if (!value) return null;
	const clean = value.split('?')[0];
	const ext = clean.split('.').pop();
	return ext ? ext.toLowerCase() : null;
};

const isImageFile = (fileKey?: string | null, fileUrl?: string | null) => {
	const ext = getFileExtension(fileKey ?? fileUrl);
	return ext ? imageExtensions.has(ext) : false;
};

const getFileName = (fallback: string, fileKey?: string | null) => {
	if (!fileKey) return fallback;
	const clean = fileKey.split('?')[0];
	return clean.split('/').pop() ?? fallback;
};

export default function DocumentField({ id, label, locked, uploading, fileUrl, fileKey, accept, onUpload, info, infoLabel }: DocumentFieldProps) {
	const tooltipLabel = infoLabel ?? `${label} help`;
	const [fullscreen, setFullscreen] = useState(false);
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

	const isImage = isImageFile(fileKey, fileUrl);
	const fileName = getFileName(`document-${id}`, fileKey);

	return (
		<div>
			<div className="flex items-center gap-2">
				<strong>{label}:</strong>
				{info && <InfoTooltip label={tooltipLabel} content={info} />}
			</div>
			<div className="relative flex items-center gap-4 mt-2">
				{fileUrl && isImage && (
					<div
						className="relative w-[340px] h-[210px] rounded-xl border border-gray-300 overflow-hidden bg-slate-50 flex items-center justify-center cursor-pointer"
						title={locked ? 'Tap to view' : 'Tap to view or replace'}
						onClick={() => (!locked ? fileInputRef.current?.click() : setFullscreen(true))}
					>
						<Image
							src={fileUrl}
							alt={`${label} preview`}
							fill
							sizes="340px"
							style={{
								objectFit: 'cover',
								borderRadius: '0.75rem',
							}}
							unoptimized
						/>
						<p className="relative z-10 text-center text-gray-500 bg-white bg-opacity-70 rounded px-2 py-1 pointer-events-none select-none">
							{locked ? 'Tap to view' : 'Tap to replace'}
						</p>
					</div>
				)}

				{fileUrl && !isImage && (
					<div className="flex flex-col items-center justify-center">
						<FiFileText size={64} className="text-gray-700" />
						<p className="text-sm text-gray-600 mt-1 truncate max-w-[160px] text-center">{fileName}</p>
						{!locked && (
							<button
								type="button"
								onClick={() => fileInputRef.current?.click()}
								className="mt-2 text-xs font-semibold text-gray-600 hover:text-gray-800"
							>
								Replace file
							</button>
						)}
					</div>
				)}

				{fileUrl && locked && (
					<button
						onClick={() => fileUrl && downloadFile(fileUrl, fileName)}
						className="text-gray-600 hover:text-gray-800 p-2 rounded-full border border-gray-300"
						title="Download file"
					>
						<FiDownload size={20} />
					</button>
				)}

				{fileUrl && isImage && (
					<div className="flex flex-col gap-2">
						<button
							onClick={() => setFullscreen(true)}
							className="text-gray-600 hover:text-gray-800 p-2 rounded-full border border-gray-300"
							title="View full screen"
						>
							<FiSearch size={20} />
						</button>
					</div>
				)}

				{!fileUrl && (
					<div
						className="relative w-[340px] h-[210px] rounded-xl border border-gray-300 overflow-hidden cursor-pointer bg-slate-50 flex items-center justify-center"
						title={locked ? 'Cannot upload when locked' : 'Tap to upload file'}
						onClick={() => !locked && fileInputRef.current?.click()}
					>
						<p className="text-gray-400 z-10">{fileUrl ? 'Replace file' : 'No file uploaded'}</p>

						{uploading && (
							<div className="absolute inset-0 bg-white bg-opacity-70 z-20 flex items-center justify-center rounded-xl">
								<p className="text-gray-700 font-medium">Uploading...</p>
							</div>
						)}

						<p className="absolute bottom-2 text-center text-gray-500 bg-white bg-opacity-70 rounded px-2 py-1 pointer-events-none select-none">
							{locked ? 'Cannot upload when locked' : 'Tap to upload file'}
						</p>
					</div>
				)}
			</div>

			<input ref={fileInputRef} type="file" disabled={locked} accept={accept} className="hidden" onChange={handleFileChange} />

			{fullscreen && fileUrl && isImage && (
				<div
					className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center cursor-zoom-out"
					onClick={() => setFullscreen(false)}
				>
					<div className="relative w-full max-w-[90vw] h-[90vh] rounded-xl shadow-lg">
						<Image
							src={fileUrl}
							alt={`${label} full screen`}
							fill
							sizes="90vw"
							style={{
								objectFit: 'contain',
								borderRadius: '0.75rem',
							}}
							priority
							unoptimized
						/>
					</div>
				</div>
			)}
		</div>
	);
}
