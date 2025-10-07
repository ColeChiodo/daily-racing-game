import React, { useEffect, useState } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import MainPage from './pages/MainPage';
import GamePage from './pages/GamePage';
import AboutPage from './pages/AboutPage';
import Menu from './components/navigation/Menu';

// Updated User interface to match backend structure
interface User {
	id: string;
	name:
		| {
				givenName: string;
				familyName: string;
		  }
		| string;
	email: string;
}

function App() {
	const [user, setUser] = useState<User | null>(null);

	const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

	useEffect(() => {
		async function fetchProfile() {
			try {
				const res = await fetch(`${backendUrl}/user/me`, {
					method: 'GET',
					credentials: 'include', // sends cookies for session
				});

				if (!res.ok) throw new Error('Not authenticated');

				const data = await res.json();
				setUser(data.user);
			} catch (err) {
				console.error('Error fetching user profile:', err);
				setUser(null);
			}
		}

		fetchProfile();
	}, [backendUrl]);


	return (
		<div className="min-h-screen">
			<Menu user={user} />

			<main>
				<Routes>
					<Route path="/" element={<MainPage />} />
					<Route path="/game" element={<GamePage />} />
					<Route path="/about" element={<AboutPage />} />
					<Route path="*" element={<Navigate to="/" replace />} />
				</Routes>
			</main>
		</div>
	);
}

export default App;
