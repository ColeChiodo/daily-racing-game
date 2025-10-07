import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import GoogleOAuth from '../auth/GoogleOauth';
import LogoutButton from '../auth/LogoutButton';

interface User {
	id: string;
	name:
		| { givenName: string; familyName: string }
		| string;
	email: string;
}

interface MenuProps {
	user: User | null;
}

export default function Menu({ user }: MenuProps) {
	const [isOpen, setIsOpen] = useState(false);
	const location = useLocation();
	const menuRef = useRef<HTMLDivElement>(null);
	const burgerRef = useRef<HTMLButtonElement>(null);

	const renderUserName = () => {
		if (!user || !user.name) return '';
		if (typeof user.name === 'string') return user.name;
		return `${user.name.givenName} ${user.name.familyName}`;
	};

	const routes = [
		{ path: '/', label: 'Return to Homepage 🏠' },
		{ path: '/game', label: 'Play Daily Race 🏎️' },
	];

	let availableRoutes;
	if (location.pathname === '/') {
		// If on Main, only show Game
		availableRoutes = routes.filter(route => route.path === '/game');
	} else {
		// Else show Main
		availableRoutes = routes.filter(route => route.path === '/');
	}

	// Close if click outside (but not if click burger)
	useEffect(() => {
		const handleClick = (e: MouseEvent) => {
			const target = e.target as Node;
			if (
				menuRef.current &&
				!menuRef.current.contains(target) &&
				burgerRef.current &&
				!burgerRef.current.contains(target)
			) {
				setIsOpen(false);
			}
		};
		if (isOpen) document.addEventListener('mousedown', handleClick);
		return () => document.removeEventListener('mousedown', handleClick);
	}, [isOpen]);

	return (
		<>
			{/* Burger Button */}
			<button
				ref={burgerRef}
				onClick={() => setIsOpen(prev => !prev)}
				className="fixed top-4 right-4 z-50 p-3 rounded-md bg-white shadow-md hover:bg-gray-100 transition"
			>
				<div className="space-y-1">
					<div className="w-6 h-0.5 bg-gray-700"></div>
					<div className="w-6 h-0.5 bg-gray-700"></div>
					<div className="w-6 h-0.5 bg-gray-700"></div>
				</div>
			</button>

			{/* Slide-in Panel */}
			<div
				ref={menuRef}
				className={`fixed top-16 right-4 w-72 bg-white shadow-lg rounded-lg p-6 transform transition-transform duration-300 ease-in-out ${
					isOpen ? 'translate-x-0' : 'translate-x-full'
				}`}
			>
				{/* Navigation */}
				<nav className="flex flex-col gap-3 mb-6">
					{availableRoutes.map(route => (
						<Link
							key={route.path}
							to={route.path}
							onClick={() => setIsOpen(false)}
							className="block text-center px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 transition"
						>
							{route.label}
						</Link>
					))}
				</nav>

				{/* Auth */}
				{!user && (
					<div className="text-center">
						<GoogleOAuth />
					</div>
				)}

				{user && (
					<div className="bg-gray-50 p-4 rounded-lg shadow-inner text-center">
						<p className="text-lg mb-3">
							Welcome,{' '}
							<span className="font-semibold text-blue-600">{renderUserName()}</span>
							!
						</p>
						<LogoutButton />
					</div>
				)}
				<footer className="mt-6 text-center text-sm text-gray-500 flex justify-center items-center">
					<Link to="/about" className="hover:text-gray-900 transition">About</Link>
					<div className="mx-2 text-gray-900">|</div>
					<Link to="/tos" className="hover:text-gray-900 transition">TOS</Link>
				</footer>
			</div>
		</>
	);
}
