import React from 'react';
import { LoginBanner } from '@/components/login/login-banner';
import { VerifyCodeForm } from '@/components/login/verify-code-form';

export default function VerifyPage() {
  return (
    <main className="
      min-h-screen
      w-full
      bg-[#F5F6F3]
      flex
      items-center
      justify-center
      p-4
    ">

      <div className="
        w-full
        max-w-[1200px]
        min-h-[650px]
        bg-white
        rounded-[40px]
        shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)]
        border
        border-gray-100/60
        overflow-hidden
        flex
        flex-col
        lg:flex-row
        lg:scale-[0.90]
      ">

        <LoginBanner />

        <VerifyCodeForm />

      </div>

    </main>
  );
}