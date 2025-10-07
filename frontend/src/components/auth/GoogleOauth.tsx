import React from 'react';

export default function GoogleOAuth() {
	const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

	const handleGoogleLogin = () => {
		window.location.href = `${backendUrl}/auth/google`;
	};

	return (
		<button
			onClick={handleGoogleLogin}
			className="flex items-center gap-3 px-6 py-3 bg-white border border-gray-300 rounded-lg shadow-sm hover:shadow-md transition-shadow font-medium text-gray-700 w-full"
		>
			<img
				src="https://developers.google.com/identity/images/g-logo.png"
				alt="Google Logo"
				className="w-5 h-5"
			/>
			<span>Sign in with Google</span>
		</button>
	);
}
