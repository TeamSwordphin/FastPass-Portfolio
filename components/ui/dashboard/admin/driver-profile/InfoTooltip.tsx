import { FiInfo } from 'react-icons/fi';

interface InfoTooltipProps {
	label: string;
	content: string;
}

export default function InfoTooltip({ label, content }: InfoTooltipProps) {
	return (
		<span className="relative inline-flex items-center group">
			<button type="button" aria-label={label} title={label} className="text-fastpassBlue/70 hover:text-fastpassBlue">
				<FiInfo className="h-4 w-4" />
			</button>
			<span
				role="tooltip"
				className="absolute left-0 top-full z-10 mt-2 hidden w-80 rounded-lg border border-gray-200 bg-white p-3 text-xs text-gray-600 shadow-lg group-hover:block group-focus-within:block"
			>
				<span className="whitespace-pre-line">{content}</span>
			</span>
		</span>
	);
}
