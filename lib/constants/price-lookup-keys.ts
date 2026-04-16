export const discountKeys = {
	grand_opening: 'grand_opening_discount',
	sale: 'general_discount',
};

export const lookupKeys = {
	services: {
		bdeBasic: {
			lookupKey: 'bde_basic',
			inCarLessons: 5,
			bdeCourse: true,
			bdeLevel: 1,
		},
		bdePremium: {
			lookupKey: 'bde_plus',
			inCarLessons: 6,
			roadTests: 1,
			bdeCourse: true,
			bdeLevel: 2,
		},
		bdeSingleLessons: {
			lookupKey: 'single_lessons',
			inCarLessons: 1,
		},
	},

	additional: {
		useOfCarPickupDropOffRefresher: {
			order: 1,
			enabled: true,
			lookupKey: 'use_of_car_refresher',
			roadTests: 1,
		},
		zoomConsultation: {
			order: 2,
			enabled: true,
			lookupKey: 'zoom_consultation',
		},
		thirteenLessonPackageRoadTestVideoLesson: {
			order: 3,
			enabled: false,
			lookupKey: 'thirteen_lessons_plus_video',
			inCarLessons: 6,
		},
		g2VideoGuides: {
			order: 4,
			enabled: false,
			lookupKey: 'g2_video_guides',
		},
		g2VideoGuidesZoomConsultation: {
			order: 5,
			enabled: false,
			lookupKey: 'g2_guides_zoom',
		},
	},
};
