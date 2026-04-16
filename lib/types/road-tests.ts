export const ROAD_TEST_STATUSES = ['pending', 'passed', 'failed'] as const;

export type RoadTestStatus = (typeof ROAD_TEST_STATUSES)[number];

export const isRoadTestStatus = (value: unknown): value is RoadTestStatus => {
	return typeof value === 'string' && (ROAD_TEST_STATUSES as readonly string[]).includes(value);
};
