import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import GoogleOAuth from '../auth/GoogleOauth';
import UserInfo from '../auth/UserInfo';
import Footer from './Footer';

interface User {
	id: string;
	name:
		| { givenName: string; familyName: string }
		| string;
	email: string;
	picture: string;
}

interface MenuProps {
	user: User | null;
}

export default function BurgerMenu({ user }: MenuProps) {
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
		{ path: '/', label: 'Return Home 🏠' },
		{ path: '/play', label: 'Play Daily Race 🏎️' },
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
				className="fixed top-4 right-4 z-50 p-3 rounded bg-slate-100 hover:bg-slate-200 transition border border-slate-700"
				>
				
					<div className="flex flex-col justify-center items-center w-6 h-6 relative space-y-1">
						{/* Top line */}
						<span
						className={`block h-0.5 w-6 bg-slate-700 transform transition duration-300 ease-in-out origin-center ${
							isOpen ? "rotate-45 translate-y-1.5" : ""
						}`}
						></span>
						{/* Middle line */}
						<span
						className={`block h-0.5 w-6 bg-slate-700 transition duration-300 ease-in-out ${
							isOpen ? "opacity-0" : ""
						}`}
						></span>
						{/* Bottom line */}
						<span
						className={`block h-0.5 w-6 bg-slate-700 transform transition duration-300 ease-in-out origin-center ${
							isOpen ? "-rotate-45 -translate-y-1.5" : ""
						}`}
						></span>
					</div>
			</button>

			{/* Slide-in Panel */}
			<div
				ref={menuRef}
				className={`fixed top-20 right-0 w-auto bg-slate-100 rounded-lg border border-slate-700 p-6 transform transition-transform duration-300 ease-in-out ${
					isOpen ? 'translate-x-4' : 'translate-x-full'
			}`}>
				{/* Auth */}
				{!user && (
					<div className="text-center">
						<GoogleOAuth className="flex-col" />
					</div>
				)}
	
				{user && (
					<div className="text-center w-full">
						<UserInfo user={user} />
					</div>
				)}

				{/* Navigation */}
				<nav className="flex flex-col gap-3">
					{availableRoutes.map(route => (
						<Link
							key={route.path}
							to={route.path}
							onClick={() => setIsOpen(false)}
							className="block button text-center bg-violet-500 hover:bg-violet-600 border-violet-700"
						>
							{route.label}
						</Link>
					))}
				</nav>
				<footer className="flex flex-col mt-2 text-center text-xs text-gray-500 flex justify-center items-center">
					<Footer />
				</footer>
			</div>
		</>
	);
}
