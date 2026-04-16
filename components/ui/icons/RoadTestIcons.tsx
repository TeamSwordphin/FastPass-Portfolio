const RoadTestIcon = ({ size = 24, color = 'currentColor' }) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		fill="none"
		viewBox="0 0 24 24"
		strokeWidth={1.5}
		stroke={color}
		width={size}
		height={size}
		className="inline-block"
	>
		<path strokeLinecap="round" strokeLinejoin="round" d="M3 17v-1a4 4 0 014-4h1.5m5 0H17a4 4 0 014 4v1m-9-5v5m0 0v5m0-5h3m-3 0H9" />
	</svg>
);

export default RoadTestIcon;
