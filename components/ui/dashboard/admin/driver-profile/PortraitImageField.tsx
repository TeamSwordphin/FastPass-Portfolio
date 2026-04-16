'use client';

import React, { useCallback, useRef, useState } from 'react';
import NextImage from 'next/image';
import Cropper, { type Area } from 'react-easy-crop';
import { FiEdit3, FiUploadCloud, FiX } from 'react-icons/fi';
import InfoTooltip from './InfoTooltip';

interface PortraitImageFieldProps {
	id: string;
	label: string;
	locked: boolean;
	uploading: boolean;
	imageToShow: string | null;
	onUpload: (file: File) => Promise<void>;
	info?: string;
	infoLabel?: string;
}

const createImage = (url: string): Promise<HTMLImageElement> =>
	new Promise((resolve, reject) => {
		const image = new window.Image();
		image.addEventListener('load', () => resolve(image));
		image.addEventListener('error', (error: Event) => reject(error));
		image.setAttribute('crossOrigin', 'anonymous');
		image.src = url;
	});

const getCroppedImage = async (imageSrc: string, crop: Area, fileType: string) => {
	const image = await createImage(imageSrc);
	const canvas = document.createElement('canvas');
	canvas.width = crop.width;
	canvas.height = crop.height;
	const ctx = canvas.getContext('2d');

	if (!ctx) {
		throw new Error('Canvas not supported');
	}

	ctx.drawImage(image, crop.x, crop.y, crop.width, crop.height, 0, 0, crop.width, crop.height);

	return new Promise<Blob>((resolve, reject) => {
		canvas.toBlob(
			(blob) => {
				if (!blob) {
					reject(new Error('Failed to crop image'));
					return;
				}
				resolve(blob);
			},
			fileType || 'image/jpeg',
			0.9
		);
	});
};

export default function PortraitImageField({ label, id, locked, uploading, imageToShow, onUpload, info, infoLabel }: PortraitImageFieldProps) {
	const tooltipLabel = infoLabel ?? `${label} help`;
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [crop, setCrop] = useState({ x: 0, y: 0 });
	const [zoom, setZoom] = useState(1);
	const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
	const [sourceImage, setSourceImage] = useState<string | null>(null);
	const [sourceType, setSourceType] = useState<string>('image/jpeg');
	const [isEditing, setIsEditing] = useState(false);

	const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
		if (locked) return;
		const file = event.target.files?.[0];
		if (!file) return;

		const localUrl = URL.createObjectURL(file);
		setSourceImage(localUrl);
		setSourceType(file.type || 'image/jpeg');
		setCrop({ x: 0, y: 0 });
		setZoom(1);
		setIsEditing(true);
		event.target.value = '';
	};

	const onCropComplete = useCallback((_area: Area, areaPixels: Area) => {
		setCroppedAreaPixels(areaPixels);
	}, []);

	const handleSave = async () => {
		if (!sourceImage || !croppedAreaPixels) return;
		try {
			const blob = await getCroppedImage(sourceImage, croppedAreaPixels, sourceType);
			const file = new File([blob], `portrait-${id}.jpg`, {
				type: blob.type || 'image/jpeg',
			});
			await onUpload(file);
			setIsEditing(false);
			URL.revokeObjectURL(sourceImage);
			setSourceImage(null);
		} catch (error) {
			console.error('Failed to crop portrait:', error);
		}
	};

	const handleCancel = () => {
		if (sourceImage) {
			URL.revokeObjectURL(sourceImage);
		}
		setSourceImage(null);
		setIsEditing(false);
	};

	return (
		<div>
			<div className="flex items-center gap-2">
				<strong>{label}:</strong>
				{info && <InfoTooltip label={tooltipLabel} content={info} />}
			</div>
			<div className="relative flex items-center gap-4 mt-2">
				<div
					className={`relative w-[340px] h-[210px] rounded-xl border border-gray-300 overflow-hidden ${
						locked ? 'bg-slate-50' : 'bg-slate-50 cursor-pointer'
					}`}
					onClick={() => !locked && fileInputRef.current?.click()}
					title={locked ? 'Cannot upload when locked' : 'Tap to upload portrait'}
				>
					{imageToShow ? (
						<NextImage
							src={imageToShow}
							alt="Instructor portrait preview"
							fill
							sizes="340px"
							style={{ objectFit: 'cover', borderRadius: '0.75rem' }}
							unoptimized
						/>
					) : (
						<div className="flex h-full w-full items-center justify-center text-gray-400">No portrait uploaded</div>
					)}

					{uploading && (
						<div className="absolute inset-0 bg-white/70 flex items-center justify-center">
							<p className="text-gray-700 font-medium">Uploading...</p>
						</div>
					)}
				</div>

				<div className="flex flex-col gap-2">
					<button
						type="button"
						onClick={() => fileInputRef.current?.click()}
						disabled={locked}
						className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-semibold transition ${
							locked ? 'cursor-not-allowed border-gray-200 text-gray-400' : 'border-gray-300 text-gray-700 hover:text-gray-900'
						}`}
					>
						<FiUploadCloud />
						Upload
					</button>
					{imageToShow && (
						<button
							type="button"
							onClick={() => fileInputRef.current?.click()}
							disabled={locked}
							className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-semibold transition ${
								locked ? 'cursor-not-allowed border-gray-200 text-gray-400' : 'border-gray-300 text-gray-700 hover:text-gray-900'
							}`}
						>
							<FiEdit3 />
							Edit
						</button>
					)}
				</div>
			</div>

			<input ref={fileInputRef} type="file" accept="image/*" disabled={locked} className="hidden" onChange={handleFileChange} />

			{isEditing && sourceImage && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
					<div className="w-full max-w-3xl rounded-2xl bg-white p-4 shadow-xl">
						<div className="flex items-center justify-between">
							<h3 className="text-lg font-semibold text-gray-800">Adjust portrait</h3>
							<button type="button" className="text-gray-500 hover:text-gray-700" onClick={handleCancel}>
								<FiX size={20} />
							</button>
						</div>

						<div className="relative mt-4 h-[320px] w-full overflow-hidden rounded-xl bg-slate-100 sm:h-[400px]">
							<Cropper
								image={sourceImage}
								crop={crop}
								zoom={zoom}
								aspect={1}
								onCropChange={setCrop}
								onZoomChange={setZoom}
								onCropComplete={onCropComplete}
							/>
						</div>

						<div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
							<label className="flex items-center gap-3 text-sm text-gray-600">
								<span>Zoom</span>
								<input
									type="range"
									min={1}
									max={3}
									step={0.05}
									value={zoom}
									onChange={(event) => setZoom(Number(event.target.value))}
									className="w-48"
								/>
							</label>

							<div className="flex flex-col gap-2 sm:flex-row">
								<button
									type="button"
									onClick={handleCancel}
									className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600 hover:text-gray-800"
								>
									Cancel
								</button>
								<button
									type="button"
									onClick={handleSave}
									className="rounded-lg bg-fastpassBlue px-4 py-2 text-sm font-semibold text-white hover:bg-fastpassBlue/90"
								>
									Save portrait
								</button>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
