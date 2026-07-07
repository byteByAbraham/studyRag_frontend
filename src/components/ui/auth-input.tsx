import React from 'react';

interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: React.ReactNode;
}

export const AuthInput: React.FC<AuthInputProps> = ({ label, icon, ...props }) => {
  return (
    <div className="flex flex-col gap-2 w-full">
      <label className="text-[18px] font-semibold text-[#2F3A55] tracking-tight">
        {label}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2">
            {icon}
          </div>
        )}
        <input
          className={`w-full py-4 rounded-xl border border-[#5C6B8A]/20 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2F3A55]/20 focus:border-[#2F3A55] transition-all text-sm ${
            icon ? 'pl-12 pr-4' : 'px-4'
          }`}
          {...props}
        />
      </div>
    </div>
  );
};