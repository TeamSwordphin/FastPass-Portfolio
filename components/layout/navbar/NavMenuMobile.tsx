'use client';

import { useState } from 'react';
import { ImMenu } from 'react-icons/im';
import { IoClose } from 'react-icons/io5';
import NavMenuMobileLinks from './NavMenuMobileLinks';

export default function NavMenuMobile({
	loginButton,
	setDrawerOpen,
}: {
	loginButton: React.ReactNode;
	setDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
	const [open, setOpen] = useState(false);

	const handleOpen = () => {
		setOpen(true);
		setDrawerOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
		setDrawerOpen(false);
	};

	return (
		<>
			{/* Menu Button */}
			<button onClick={handleOpen} className="btn btn-ghost lg:hidden">
				<ImMenu className="text-2xl" />
			</button>

			{/* Overlay */}
			{open && <div className="fixed inset-0 bg-black bg-opacity-40 z-40" onClick={handleClose} />}

			{/* Drawer */}
			<div
				className={`fixed top-0 right-0 h-full w-64 bg-base-100 p-4 shadow-lg z-50 transform transition-transform duration-300 ${
					open ? 'translate-x-0' : 'translate-x-full'
				}`}
			>
				{/* Close Button */}
				<div className="flex justify-end">
					<button onClick={handleClose}>
						<IoClose className="text-3xl" />
					</button>
				</div>

				{/* Static Links (from server) */}
				<NavMenuMobileLinks onClick={handleClose} loginButton={loginButton} />
			</div>
		</>
	);
}
