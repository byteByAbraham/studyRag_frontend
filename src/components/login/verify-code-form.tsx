'use client';

import React, { useState } from 'react';
import { AuthButton } from '../ui/auth-button';

export const VerifyCodeForm = () => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/verify-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code,
        }),
      });


      const data = await response.json();


      if (!response.ok) {
        throw new Error(data.message || 'Código incorrecto');
      }


      window.location.href = '/login';


    } catch (err: any) {

      setError(err.message);

    } finally {

      setLoading(false);

    }
  };


  return (
    <div className="w-full lg:w-1/2 flex items-center justify-center bg-white px-8 py-10 lg:px-14">

      <div className="w-full max-w-[420px]">


        <div className="text-center mb-10">

          <h2 className="text-[32px] font-bold text-[#2F3A55]">
            Verificar cuenta
          </h2>


          <p className="mt-3 text-sm text-[#5C6B8A]">
            Ingresa el código de verificación enviado a tu correo.
          </p>

        </div>



        <form onSubmit={handleSubmit} className="space-y-6">


          <div>

            <label className="mb-2 block text-sm font-medium text-[#2F3A55]">
              Código de verificación
            </label>


            <input
              type="text"
              maxLength={6}
              placeholder="123456"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
              className="
                w-full
                rounded-xl
                border
                border-gray-300
                px-4
                py-3
                text-center
                text-lg
                tracking-[8px]
                outline-none
                focus:border-[#2F3A55]
              "
            />

          </div>



          {error && (

            <p className="
              rounded-xl
              bg-red-50
              py-2
              text-center
              text-sm
              text-red-500
            ">
              {error}
            </p>

          )}



          <AuthButton type="submit" disabled={loading}>

            {loading ? 'Verificando...' : 'Confirmar código'}

          </AuthButton>



        </form>


      </div>

    </div>
  );
};