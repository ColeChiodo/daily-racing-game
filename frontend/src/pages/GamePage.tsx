import React from 'react';
import GameCanvas from '../components/game/GameCanvas';
import BurgerMenu from '../components/navigation/BurgerMenu';

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

export default function GamePage({ user }: MenuProps) {
	return (
		<>
			<BurgerMenu user={user} />
			<GameCanvas />
		</>
	);
}


