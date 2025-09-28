import React, { useEffect, useState } from 'react';
import GameCanvas from './components/GameCanvas';
import GoogleOAuth from './components/GoogleOauth';
import LogoutButton from './components/LogoutButton';

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

	// Helper to display name correctly whether it's a string or object
	const renderUserName = () => {
		if (!user || !user.name) return '';
		if (typeof user.name === 'string') return user.name;
		return `${user.name.givenName} ${user.name.familyName}`;
	};

	return (
		<div>
			<h1>Daily Racing Game</h1>
			<GameCanvas />
			{!user && <GoogleOAuth />}
			{user && <p>Welcome, {renderUserName()}!</p>}
			{user && <LogoutButton />}
		</div>
	);
}

export default App;
