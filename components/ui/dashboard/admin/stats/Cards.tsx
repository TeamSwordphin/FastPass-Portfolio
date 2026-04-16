interface StatCardProps {
	title: string;
	value: string | number;
	colorClass?: string; // Tailwind text color class
}

export default function StatCard({ title, value, colorClass = 'text-gray-900' }: StatCardProps) {
	return (
		<div className="bg-white rounded-lg shadow p-6">
			<h3 className="text-lg font-semibold text-gray-600">{title}</h3>
			<p className={`mt-2 text-3xl font-bold ${colorClass}`}>{value}</p>
		</div>
	);
}
