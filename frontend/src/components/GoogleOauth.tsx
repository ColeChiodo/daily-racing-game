import React, { useRef, useEffect } from 'react';

const GoogleOAuth: React.FC = () => {
	const googleButtonRef = useRef<HTMLButtonElement>(null);

	useEffect(() => {
		const button = googleButtonRef.current;
		if (!button) return;
		button.addEventListener('click', () => {
			window.open(`${import.meta.env.VITE_API_URL}/auth/google`, '_self');
		});
	}, []);

	return <button ref={googleButtonRef}>Continue with Google</button>;
};

export default GoogleOAuth;
