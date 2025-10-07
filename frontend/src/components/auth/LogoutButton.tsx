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

	return (
		<button 
			ref={logoutButtonRef}
			className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
		>
			Logout
		</button>
	);
};

export default LogoutButton;
