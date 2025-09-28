import { useRef, useEffect } from 'react';

const LogoutButton: React.FC = () => {
	const logoutButtonRef = useRef<HTMLButtonElement>(null);

	useEffect(() => {
		const button = logoutButtonRef.current;
		if (!button) return;
		button.addEventListener('click', () => {
			window.open(`${import.meta.env.VITE_API_URL}/auth/logout`, '_self');
		});
	}, []);

	return <button ref={logoutButtonRef}>Logout</button>;
};

export default LogoutButton;
