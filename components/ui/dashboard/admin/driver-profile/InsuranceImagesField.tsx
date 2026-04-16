'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { FiArrowDown, FiArrowUp, FiDownload, FiUploadCloud } from 'react-icons/fi';
import InfoTooltip from './InfoTooltip';

export type InsuranceImageItem = {
	id: number;
	url: string;
	sortOrder: number;
};

interface InsuranceImagesFieldProps {
	label: string;
	locked: boolean;
	loading: boolean;
	uploading: boolean;
	images: InsuranceImageItem[];
	onUpload: (files: File[]) => Promise<void>;
	onReorder: (orderedIds: number[]) => Promise<void> | void;
	onDownloadSummary: () => void;
	info?: string;
	infoLabel?: string;
}

export default function InsuranceImagesField({
	label,
	locked,
	loading,
	uploading,
	images,
	onUpload,
	onReorder,
	onDownloadSummary,
	info,
	infoLabel,
}: InsuranceImagesFieldProps) {
	const tooltipLabel = infoLabel ?? `${label} help`;
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [orderedImages, setOrderedImages] = useState<InsuranceImageItem[]>([]);

	useEffect(() => {
		const sorted = [...images].sort((a, b) => a.sortOrder - b.sortOrder);
		setOrderedImages(sorted);
	}, [images]);

	const hasImages = orderedImages.length > 0;

	const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
		if (locked) return;
		const files = Array.from(event.target.files ?? []);
		if (files.length === 0) return;
		await onUpload(files);
		event.target.value = '';
	};

	const handleMove = (index: number, direction: -1 | 1) => {
		if (locked) return;
		const nextIndex = index + direction;
		if (nextIndex < 0 || nextIndex >= orderedImages.length) return;

		const nextOrder = [...orderedImages];
		const [moved] = nextOrder.splice(index, 1);
		nextOrder.splice(nextIndex, 0, moved);

		setOrderedImages(nextOrder);
		onReorder(nextOrder.map((image) => image.id));
	};

	return (
		<div>
			<div className="flex flex-wrap items-center justify-between gap-3">
				<div className="flex items-center gap-2">
					<strong>{label}:</strong>
					{info && <InfoTooltip label={tooltipLabel} content={info} />}
				</div>
				<button
					type="button"
					onClick={onDownloadSummary}
					disabled={!hasImages}
					className={`inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm font-semibold transition ${
						hasImages ? 'border-gray-300 text-gray-700 hover:text-gray-900' : 'cursor-not-allowed border-gray-200 text-gray-400'
					}`}
				>
					<FiDownload />
					Summary
				</button>
			</div>

			<div className="mt-3 space-y-3">
				<div className="flex flex-wrap items-center gap-3">
					<button
						type="button"
						onClick={() => !locked && fileInputRef.current?.click()}
						disabled={locked}
						className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition ${
							locked ? 'cursor-not-allowed bg-gray-100 text-gray-400' : 'bg-slate-100 text-gray-700 hover:bg-slate-200'
						}`}
					>
						<FiUploadCloud />
						Upload images
					</button>
					<span className="text-xs text-gray-500">
						{locked ? 'Unlock to upload or reorder images.' : 'Add one or more images for proof of insurance.'}
					</span>
				</div>

				{loading && <p className="text-sm text-gray-500">Loading insurance images...</p>}

				{uploading && (
					<div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-600">Uploading insurance images...</div>
				)}

				{!loading && !hasImages && (
					<div className="rounded-lg border border-dashed border-gray-200 bg-gray-50 px-4 py-6 text-center text-sm text-gray-500">
						No insurance images uploaded yet.
					</div>
				)}

				{hasImages && (
					<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
						{orderedImages.map((image, index) => (
							<div key={image.id} className="rounded-xl border border-gray-200 bg-white p-2 shadow-sm">
								<div className="relative w-full overflow-hidden rounded-lg bg-slate-50" style={{ aspectRatio: '4 / 3' }}>
									<Image
										src={image.url}
										alt={`Insurance image ${index + 1}`}
										fill
										sizes="(max-width: 1024px) 100vw, 33vw"
										style={{ objectFit: 'cover' }}
										unoptimized
									/>
								</div>
								<div className="mt-2 flex items-center justify-between text-xs text-gray-500">
									<span>Image {index + 1}</span>
									<div className="flex items-center gap-2">
										<button
											type="button"
											onClick={() => handleMove(index, -1)}
											disabled={locked || index === 0}
											className={`rounded-full border p-1 text-gray-500 transition ${
												locked || index === 0 ? 'cursor-not-allowed border-gray-200 text-gray-300' : 'border-gray-300 hover:text-gray-800'
											}`}
											title="Move up"
										>
											<FiArrowUp />
										</button>
										<button
											type="button"
											onClick={() => handleMove(index, 1)}
											disabled={locked || index === orderedImages.length - 1}
											className={`rounded-full border p-1 text-gray-500 transition ${
												locked || index === orderedImages.length - 1
													? 'cursor-not-allowed border-gray-200 text-gray-300'
													: 'border-gray-300 hover:text-gray-800'
											}`}
											title="Move down"
										>
											<FiArrowDown />
										</button>
									</div>
								</div>
							</div>
						))}
					</div>
				)}
			</div>

			<input ref={fileInputRef} type="file" multiple disabled={locked} accept="image/*" className="hidden" onChange={handleFileChange} />
		</div>
	);
}
