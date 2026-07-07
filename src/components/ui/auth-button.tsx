import React from 'react';

interface AuthButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export const AuthButton: React.FC<AuthButtonProps> = ({ children, ...props }) => {
  return (
    <button
      className="relative w-full h-12 rounded-xl bg-[#2F3A55] hover:bg-[#273248] text-white font-medium text-base transition-all duration-200 shadow-sm"
      {...props}
    >
      {/* Texto centrado */}
      <span className="absolute inset-0 flex items-center justify-center">
        {children}
      </span>

      {/* Ícono a la derecha */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2.2}
        stroke="currentColor"
        className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
        />
      </svg>
    </button>
  );
};