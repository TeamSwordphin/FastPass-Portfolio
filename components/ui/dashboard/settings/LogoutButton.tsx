'use client';

import React, { useState } from 'react';
import { FiLogOut } from 'react-icons/fi';
import { authClient } from '@/lib/auth-client';

interface LogoutButtonProps {
	label?: string;
	className?: string;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ label = 'Log Out', className }) => {
	const [loading, setLoading] = useState(false);

	const handleLogout = async () => {
		await authClient.signOut();
		window.dispatchEvent(new CustomEvent('logout'));
		window.location.href = '/';
	};

	const handleClick = async () => {
		if (loading) return;

		setLoading(true);

		try {
			await handleLogout();
		} catch (err) {
			console.error('Logout failed', err);
			setLoading(false);
		}
	};

	return (
		<button
			type="button"
			onClick={handleClick}
			disabled={loading}
			className={`btn btn-error flex items-center gap-2 px-4 ${loading ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
		>
			<FiLogOut size={20} />
			{loading ? 'Logging out...' : label}
		</button>
	);
};

export default LogoutButton;
