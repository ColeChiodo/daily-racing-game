import React from "react";

export default function GoogleOAuth({ className: className }: any) {
  const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

  const handleGoogleLogin = () => {
    window.location.href = `${backendUrl}/auth/google`;
  };

  const fullClassName = `flex items-center gap-3 button bg-stone-100 border-stone-500 hover:bg-stone-200 text-stone-900 w-full ${className}`;

  return (
    <button
      onClick={handleGoogleLogin}
      className={fullClassName}
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
