import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import GoogleOAuth from '../components/auth/GoogleOauth';
import LogoutButton from '../components/auth/LogoutButton';
import Footer from '../components/navigation/Footer';

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

export default function MainPage({ user }: MenuProps) {
    const [countdown, setCountdown] = useState<string>('');

	const renderUserName = () => {
		if (!user || !user.name) return '';
		if (typeof user.name === 'string') return user.name;
		return `${user.name.givenName} ${user.name.familyName}`;
	};

    // Calculate countdown to next 5:00 AM UTC +0
    useEffect(() => {
		const interval = setInterval(() => {
			const now = new Date();
	
			// Next UTC 5 am
			let nextMorningUTC = new Date(Date.UTC(
				now.getUTCFullYear(),
				now.getUTCMonth(),
				now.getUTCDate(),
				5, 0, 0, 0
			));
	
			// If it's already past 5 AM UTC today, move to tomorrow
			if (now.getTime() >= nextMorningUTC.getTime()) {
				nextMorningUTC.setUTCDate(nextMorningUTC.getUTCDate() + 1);
			}
	
			const diff = nextMorningUTC.getTime() - now.getTime();
	
			const hours = Math.floor(diff / (1000 * 60 * 60));
			const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
			const seconds = Math.floor((diff % (1000 * 60)) / 1000);
	
			setCountdown(
				`${hours.toString().padStart(2, '0')}:${minutes
					.toString()
					.padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
			);
		}, 1000);
	
		return () => clearInterval(interval);
	}, []);
	


    // Today's date
    const today = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
		year: 'numeric',
    });

    return (
		<>
			{!user && (
				<div className="absolute right-0 m-4">
					<GoogleOAuth />
				</div>
			)}

			{user && (
				<div className="bg-gray-50 p-4 rounded-lg shadow-inner text-center absolute right-0 m-4">
					<div className="flex items-center justify-center space-x-3 mb-3">
					{user.picture && (
						<img
							src={user.picture}
							className="w-10 h-10 rounded-full border"
						/>
					)}
					<span className="font-semibold text-blue-600 text-lg">
						{renderUserName()}
					</span>
					</div>
					<LogoutButton />
				</div>
			)}


			<div className="flex flex-col items-center justify-center min-h-screen max-h-screen text-center p-4 bg-primary">
				{/* Logo */}
				<h1 className="text-3xl font-bold text-white">Daily Racing Game</h1>

				{/* Tag Line */}
				<p className="text-gray-600 text-md text-white">Start your engine!</p>

				{/* Leaderboard Section */}
				<div className="m-2 px-8 py-4 rounded-lg bg-amber-100 text-amber-700 font-bold border-4 border-amber-200">
					<p className="">{today}</p>
					<p className="w-full">
						Next race: <span className="font-bold text-amber-900">{countdown}</span>
					</p>
				</div>

				{/* Play Button */}
				<div className="mt-2">
					<Link to="/game"
						className="px-8 py-4 rounded-lg bg-cyan-500 text-white font-bold border-b-4 border-r-4 border-cyan-700 transition hover:bg-cyan-600">
						Play Daily Race <b className="text-3xl">🏎️</b>
					</Link>
				</div>

				<div className="mt-8">
					<Link to="/leaderboard"
						className="px-8 py-4 rounded-lg bg-emerald-500 text-white font-bold border-b-4 border-r-4 border-emerald-700 transition hover:bg-emerald-600">
						<b className="text-3xl align-middle">🏆</b> View Today's Leaders
					</Link>
				</div>

				<footer className="flex flex-col absolute bottom-0 mt-6 text-center text-sm text-gray-500 justify-center items-center bg-gray-100 rounded py-2 px-4 border-2 border-gray-500">
					<Footer />
				</footer>
			</div>
		</>
    );
}
