import { driverNames, areaAssignments, areaFSAMap, stationMap } from '../constants/service-areas';

export type Driver = {
	name: string;
	areaCode: string;
};

/**
 * Flatten all drivers and their FSA codes into a single array
 */
export const getAllDrivers = (): Driver[] => {
	return driverNames.flatMap((name) => {
		const areas = areaAssignments[name] || [];
		return areas.flatMap((area) => {
			const fsaList = areaFSAMap[area] || [];
			return fsaList.map((fsa) => ({ name, areaCode: fsa }));
		});
	});
};

/**
 * Assign a driver based on a full postal code (string)
 * Returns assigned driver or null if out-of-area
 */
export const assignDriverByPostalCode = (postalCode: string): Driver | null => {
	if (!postalCode) return null;
	const fsa = postalCode.replace(/\s+/g, '').substring(0, 3).toUpperCase();
	const drivers = getAllDrivers();
	const match = drivers.find((driver) => fsa.startsWith(driver.areaCode));
	return match || null;
};

/**
 * Assign a driver by pickup station
 * Returns assigned driver or null if out-of-area
 */
export const assignDriverByStation = (stationName: string): Driver | null => {
	const drivers = getAllDrivers();
	const prefix = stationMap[stationName]; // e.g., "M2"
	if (!prefix) return null;

	const match = drivers.find((driver) => driver.areaCode.startsWith(prefix));
	return match || null;
};

/**
 * Extract postal code from a full address string
 */
export const extractPostalCode = (address: string): string | null => {
	const match = address.match(/[A-Z]\d[A-Z]\s?\d[A-Z]\d/i);
	return match ? match[0].toUpperCase().replace(/\s+/g, '') : null;
};
