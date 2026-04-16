'use client';

import React, { useEffect, useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import InfoTooltip from './InfoTooltip';

interface Category {
	dbId: number;
	name: string;
}

interface Area {
	id: string;
	categoryId: number;
	categoryName: string;
}

interface PickupAreasProps {
	areas: Area[];
	locked?: boolean;
	onChange?: (newAreas: Area[]) => void;
	info?: string;
	infoLabel?: string;
}

export default function PickupAreas({ areas: initialAreas, locked = false, onChange, info, infoLabel }: PickupAreasProps) {
	const tooltipLabel = infoLabel ?? 'Pickup areas help';
	const [categories, setCategories] = useState<Category[]>([]);
	const [areas, setAreas] = useState<Area[]>([]);

	useEffect(() => {
		if (!initialAreas) return;

		const mappedAreas = initialAreas.map((area) => ({
			...area,
			id: area.id || crypto.randomUUID(), // always unique
			categoryName: categories.find((c) => c.dbId === area.categoryId)?.name || 'Unknown',
		}));

		setAreas(mappedAreas);
	}, [initialAreas, categories]);

	useEffect(() => {
		fetch('/api/admin/editor/areas-servicing/get')
			.then((res) => res.json())
			.then((data) => {
				const pickupCategories = data['pickupCategories'] || [];

				const uniqueCategories = pickupCategories.filter((cat: any, index: number, self: any[]) => index === self.findIndex((c) => c.id === cat.id));
				setCategories(
					uniqueCategories.map((cat: any) => ({
						dbId: cat.id,
						name: cat.name,
					}))
				);
			})
			.catch((err) => console.error('Failed to fetch pickup categories:', err));
	}, []);

	const addArea = (category: Category) => {
		if (locked) return;
		if (areas.some((a) => a.categoryId === category.dbId)) return;

		const newArea: Area = {
			id: crypto.randomUUID(),
			categoryId: category.dbId,
			categoryName: category.name,
		};

		const updatedAreas = [...areas, newArea];
		setAreas(updatedAreas);
		onChange?.(updatedAreas);
	};

	const removeArea = (areaId: string) => {
		if (locked) return;
		const updatedAreas = areas.filter((a) => a.id !== areaId);
		setAreas(updatedAreas);
		onChange?.(updatedAreas);
	};

	const renderLockedMessage = () => {
		if (!locked) return null;
		if (areas.length === 0) return <p className="text-gray-500 text-sm">No areas selected. Unlock to add.</p>;
		return;
	};

	return (
		<div className="mt-4">
			<div className="mb-2 flex items-center gap-2">
				<label className="font-semibold">Pickup Areas:</label>
				{info && <InfoTooltip label={tooltipLabel} content={info} />}
			</div>

			{!locked && (
				<div className="mb-2 flex flex-wrap gap-2">
					{categories.map((cat) => (
						<button
							key={cat.dbId}
							onClick={() => addArea(cat)}
							disabled={areas.some((a) => a.categoryId === cat.dbId)}
							className={`px-3 py-1 rounded text-fastpassBlue bg-gray-200 hover:bg-blue-100 ${
								areas.some((a) => a.categoryId === cat.dbId) ? 'opacity-50 cursor-not-allowed hover:bg-gray-200' : ''
							}`}
						>
							+ {cat.name}
						</button>
					))}
				</div>
			)}

			<div className="flex flex-wrap gap-2 mt-2">
				{areas.map((area) => (
					<div key={area.id} className={`flex items-center bg-gray-100 px-2 py-1 rounded text-fastpassBlue ${locked ? 'opacity-80' : ''}`}>
						{area.categoryName}
						{!locked && (
							<button onClick={() => removeArea(area.id)} className="ml-2 hover:text-red-600">
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
