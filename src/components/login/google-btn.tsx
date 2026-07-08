'use client';

export const GoogleLoginButton = () => {
  const handleGoogleLogin = () => {
    window.location.href = 'TU_URL_DEL_BACKEND/api/auth/google';
  };

  return (
    <button
      type="button"
      onClick={handleGoogleLogin}
      className="w-full flex items-center justify-center gap-3 py-3 border border-gray-300 rounded-md text-[14px] font-medium text-[#2F3A55] hover:bg-gray-50 transition"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M22.56 12.25C22.56 11.47 22.49 10.72 22.36 10H12V14.51H18.06C17.75 15.99 16.92 17.25 15.71 18.1V21.09H19.28C21.36 19.19 22.56 16.02 22.56 12.25Z" fill="#4285F4"/>
        <path d="M12 23C14.97 23 17.46 22.02 19.28 20.31L15.71 18.1C14.73 18.82 13.45 19.25 12 19.25C9.17 19.25 6.79 17.48 5.92 15H2.25V18.14C4.05 21.2 7.75 23 12 23Z" fill="#34A853"/>
        <path d="M5.92 15C5.68 14.25 5.56 13.44 5.56 12.5C5.56 11.56 5.68 10.75 5.92 10H2.25V6.86C4.05 3.8 7.75 2 12 2C14.7 2 17.1 2.95 18.92 4.72L15.71 7.9C14.73 7.18 13.45 6.75 12 6.75C9.17 6.75 6.79 8.52 5.92 10.99L5.92 15Z" fill="#FBBC05"/>
        <path d="M12 5.75C13.45 5.75 14.73 6.18 15.71 7L18.92 3.72C17.1 1.95 14.7 1 12 1C7.75 1 4.05 2.8 2.25 5.86L5.92 9C6.79 6.52 9.17 4.75 12 4.75Z" fill="#EA4335"/>
      </svg>
      <span>Continuar con Google</span>
    </button>
  );
};