export const holidayBannerGradients = {
	'teal-sky': {
		label: 'Teal / Sky',
		className: 'from-emerald-500 via-teal-500 to-sky-500',
	},
	sunset: {
		label: 'Sunset',
		className: 'from-amber-400 via-rose-500 to-pink-500',
	},
	citrus: {
		label: 'Citrus',
		className: 'from-lime-400 via-amber-400 to-orange-500',
	},
	berry: {
		label: 'Berry',
		className: 'from-fuchsia-500 via-rose-500 to-red-500',
	},
	ocean: {
		label: 'Ocean',
		className: 'from-sky-500 via-blue-500 to-indigo-600',
	},
	aurora: {
		label: 'Aurora',
		className: 'from-emerald-400 via-cyan-400 to-blue-500',
	},
	fire: {
		label: 'Fire',
		className: 'from-red-500 via-orange-500 to-yellow-400',
	},
	'rose-gold': {
		label: 'Rose Gold',
		className: 'from-rose-400 via-pink-400 to-amber-300',
	},
	dusk: {
		label: 'Dusk',
		className: 'from-indigo-500 via-purple-500 to-rose-500',
	},
	forest: {
		label: 'Forest',
		className: 'from-green-600 via-emerald-500 to-lime-500',
	},
	neon: {
		label: 'Neon',
		className: 'from-fuchsia-500 via-purple-500 to-blue-500',
	},
	glacier: {
		label: 'Glacier',
		className: 'from-cyan-300 via-sky-400 to-indigo-400',
	},
	slate: {
		label: 'Slate',
		className: 'from-slate-700 via-slate-500 to-slate-400',
	},
} as const;

export type HolidayBannerGradientKey = keyof typeof holidayBannerGradients;

export const holidayBannerDefaults = {
	name: 'Holiday Event',
	message: 'Holiday special is live - tap to see the offer.',
	targetUrl: '/holiday',
	gradientKey: 'teal-sky' as HolidayBannerGradientKey,
} as const;

export const isHolidayBannerGradientKey = (value?: string): value is HolidayBannerGradientKey =>
	typeof value === 'string' && value in holidayBannerGradients;
