import type { CalBooking } from '@/lib/cal/teamBookings';

export type BookingSummary = {
	id: string;
	date: string;
	time: string;
	location: string;
	instructor: string;
	timestamp: number;
};

export function formatBookingSummary(bookingId: string, booking?: CalBooking): BookingSummary | null {
	if (!booking?.start || !booking?.end) {
		return null;
	}

	const start = new Date(booking.start);
	const end = new Date(booking.end);

	if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
		return null;
	}

	return {
		id: bookingId,
		date: start.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
		time: `${start.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })} - ${end.toLocaleTimeString('en-US', {
			hour: 'numeric',
			minute: '2-digit',
		})}`,
		location: booking.location || 'TBD',
		instructor: booking.hosts?.[0]?.name || 'N/A',
		timestamp: start.getTime(),
	};
}
