import { ReactNode } from 'react';

type AuthCardProps = {
	title: string;
	children: ReactNode;
};

export default function AuthCard({ title, children }: AuthCardProps) {
	return (
		<div className="flex justify-center items-center py-16 bg-gray-100">
			<div className="card w-full max-w-md bg-gray-50 shadow-xl">
				<div className="card-body space-y-4">
					<h2 className="card-title text-2xl text-gray-800">{title}</h2>
					{children}
				</div>
			</div>
		</div>
	);
}
