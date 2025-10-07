import React from 'react';

export default function GoogleOAuth() {
	const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

	const handleGoogleLogin = () => {
		window.location.href = `${backendUrl}/auth/google`;
	};

	return (
		<button
			onClick={handleGoogleLogin}
			className="flex items-center gap-3 px-8 py-4 rounded-lg bg-white text-gray-900 font-bold border-b-4 border-r-4 border-gray-500 transition hover:bg-gray-200 w-full"
		>
			<img
				src="https://www.svgrepo.com/show/475656/google-color.svg"
				alt="Google Logo"
				className="w-5 h-5"
			/>
			<span>Sign in with Google</span>
		</button>
	);
}
