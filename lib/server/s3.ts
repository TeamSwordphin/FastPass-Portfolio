import 'server-only';

export const getPublicS3Url = (fileKey?: string | null) => {
	if (!fileKey) return null;
	const bucket = process.env.AWS_BUCKET_NAME || 'fastpassdrivingacademy-images';
	const region = process.env.AWS_REGION || 'us-east-1';
	return `https://${bucket}.s3.${region}.amazonaws.com/${fileKey}`;
};

export const getSiteEventImageUrl = (fileKey?: string | null) => {
	if (!fileKey) return null;
	return `/api/site-events/image?key=${encodeURIComponent(fileKey)}`;
};
