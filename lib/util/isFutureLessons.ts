export const isFutureLesson = (timestamp: number) => {
	const now = Date.now();
	const twentyFourHours = 24 * 60 * 60 * 1000;

	return timestamp + twentyFourHours > now;
};
