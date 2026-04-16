import React from 'react';

interface YouTubeEmbedProps {
	videoId: string;
	title?: string;
}

const YouTubeEmbed: React.FC<YouTubeEmbedProps> = ({ videoId, title }) => {
	return (
		<div className="relative w-full pb-[56.25%] overflow-hidden rounded-2xl shadow-lg my-5">
			<iframe
				className="absolute top-0 left-0 w-full h-full"
				src={`https://www.youtube.com/embed/${videoId}`}
				title={title || 'YouTube video player'}
				frameBorder="0"
				allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
				allowFullScreen
			/>
		</div>
	);
};

export default YouTubeEmbed;
