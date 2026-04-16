'use client';

import { useState } from 'react';
import { FiX } from 'react-icons/fi';

interface TestEnvironmentBannerProps {
	env: string;
}

export default function TestEnvironmentBanner({ env }: TestEnvironmentBannerProps) {
	const [visible, setVisible] = useState(true);

	// Only render if ENVIRONMENT is "Test" and banner is visible
	if (env !== 'Test' || !visible) return null;

	return (
		<div className="fixed bottom-0 left-0 w-full bg-yellow-400 text-black text-center py-2 font-semibold z-50 flex justify-between items-center px-4">
			<button className="p-1 hover:bg-yellow-300 rounded" onClick={() => setVisible(false)} title="Close">
				<FiX size={18} />
			</button>
			<span className="mx-auto absolute left-1/2 -translate-x-1/2">Testing Environment. Things are subject to change</span>
		</div>
	);
}
