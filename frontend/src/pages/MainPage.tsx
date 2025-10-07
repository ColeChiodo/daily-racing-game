import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function MainPage() {
    const [countdown, setCountdown] = useState<string>('');

    // Calculate countdown to next 5:00 AM UTC +0
    useEffect(() => {
		const interval = setInterval(() => {
			const now = new Date();

			// Next UTC 5 am
			const nextMorningUTC = new Date(Date.UTC(
				now.getUTCFullYear(),
				now.getUTCMonth(),
				now.getUTCDate(),
				5,
				0,
				0,
				0
			));

			const diff = nextMorningUTC.getTime() - now.getTime();

			const hours = Math.floor(diff / (1000 * 60 * 60));
			const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
			const seconds = Math.floor((diff % (1000 * 60)) / 1000);

			setCountdown(`${hours.toString().padStart(2, '0')}:${minutes
				.toString()
				.padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
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
        <div className="flex flex-col items-center justify-center min-h-screen max-h-screen text-center p-4">
            {/* Logo */}
            <h1 className="text-3xl font-bold">Daily Racing Game</h1>

            {/* Tag Line */}
            <p className="text-gray-600 text-md">Start your engine!</p>

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
                <Link to="/game"
                    className="px-8 py-4 rounded-lg bg-emerald-500 text-white font-bold border-b-4 border-r-4 border-emerald-700 transition hover:bg-emerald-600">
                    <b className="text-3xl align-middle">🏆</b> View Today's Leaders
                </Link>
            </div>
        </div>
    );
}
