'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { FiSearch, FiDownload } from 'react-icons/fi';
import InfoTooltip from './InfoTooltip';

interface LicenseImageFieldProps {
	id: string;
	locked: boolean;
	label: string;
	uploading: boolean;
	imageToShow: string | null;
	onUpload: (file: File) => Promise<void>;
	info?: string;
	infoLabel?: string;
}

export default function LicenseImageField({ label, id, locked, uploading, imageToShow, onUpload, info, infoLabel }: LicenseImageFieldProps) {
	const tooltipLabel = infoLabel ?? `${label} help`;

	const [fullscreen, setFullscreen] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		if (locked) return;
		const file = e.target.files?.[0];
		if (file) await onUpload(file);
	};

	return (
		<div>
			<div className="flex items-center gap-2">
				<strong>{label}:</strong>
				{info && <InfoTooltip label={tooltipLabel} content={info} />}
			</div>
			<div className="relative flex items-center gap-2 mt-2">
				<div
					className="relative w-[340px] h-[210px] rounded-xl border border-gray-300 overflow-hidden cursor-pointer bg-slate-50 flex items-center justify-center"
					title={locked ? 'Cannot upload when locked' : 'Tap to upload image'}
					onClick={() => !locked && fileInputRef.current?.click()}
				>
					{imageToShow ? (
						<Image
							src={imageToShow}
							alt="License Preview"
							fill
							sizes="340px"
							style={{
								objectFit: 'cover',
								borderRadius: '0.75rem',
							}}
							unoptimized
						/>
					) : (
						<p className="text-gray-400 z-10">No image uploaded</p>
					)}

					{uploading && (
						<div className="absolute inset-0 bg-white bg-opacity-70 z-20 flex items-center justify-center rounded-xl">
							<p className="text-gray-700 font-medium">Uploading...</p>
						</div>
					)}

					<p className="relative z-10 text-center text-gray-500 bg-white bg-opacity-70 rounded px-2 py-1 pointer-events-none select-none">
						{locked ? 'Cannot upload when locked' : 'Tap to upload image'}
					</p>

					<input
						ref={fileInputRef}
						type="file"
						disabled={locked}
						accept="image/*"
						capture="environment"
						className="hidden"
						onChange={handleFileChange}
					/>
				</div>

				{imageToShow && (
					<div className="flex flex-col gap-2">
						<button
							onClick={() => setFullscreen(true)}
							className="text-gray-600 hover:text-gray-800 p-2 rounded-full border border-gray-300"
							title="View full screen"
						>
							<FiSearch size={20} />
						</button>

						<a
							href={imageToShow}
							download={`driver-license-${id}.jpg`}
							className="text-gray-600 hover:text-gray-800 p-2 rounded-full border border-gray-300 text-center"
							title="Download license image"
						>
							<FiDownload size={20} />
						</a>
					</div>
				)}
			</div>

			{fullscreen && imageToShow && (
				<div
					className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center cursor-zoom-out"
					onClick={() => setFullscreen(false)}
				>
					<div className="relative w-full max-w-[90vw] h-[90vh] rounded-xl shadow-lg">
						<Image
							src={imageToShow}
							alt="Full screen license"
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
