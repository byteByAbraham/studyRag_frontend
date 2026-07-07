'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AuthInput } from '../ui/auth-input';
import { AuthButton } from '../ui/auth-button';

export const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('TU_URL_DEL_BACKEND/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al iniciar sesión');
      }

      console.log('Login exitoso:', data);
      localStorage.setItem('token', data.access_token);
      window.location.href = '/dashboard';

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full lg:w-1/2 flex items-center justify-center bg-white px-8 py-10 lg:px-14">
      <div className="w-full max-w-[460px]">
        <div className="mb-10 text-center">
          <h2 className="text-[34px] font-bold tracking-tight text-[#2F3A55]">
            Inicio de Sesión
          </h2>
          <p className="mt-3 text-[14px] leading-relaxed text-[#5C6B8A]">
            Inicie sesión para acceder a sus materiales y salas de estudio.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 text-red-600 text-[14px] rounded-md text-center">
            {error}
          </div>
        )}
    
        <form onSubmit={handleSubmit} className="space-y-6">
          <AuthInput
            label="Correo"
            type="email"
            placeholder="correo@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <div>
            <AuthInput
              label="Contraseña"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <div className="mt-3 flex justify-end">
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-[14px] font-medium text-[#5C6B8A] transition hover:text-[#2F3A55]"
              >
                {showPassword ? 'Ocultar contraseña' : '¿Olvidaste tu contraseña?'}
              </button>
            </div>
          </div>

          <div className="pt-2">
            <AuthButton type="submit" disabled={loading}>
              {loading ? 'Cargando...' : 'Ingresar'}
            </AuthButton>
          </div>
        </form>

        <div className="mt-10 border-t border-gray-200 pt-7 text-center">
          <p className="mx-auto max-w-sm text-[14px] leading-relaxed text-[#5C6B8A]">
            Al continuar aceptas nuestros términos y condiciones.
          </p>
          <p className="mt-6 text-[14px] text-[#5C6B8A]">
            ¿No tienes una cuenta?{' '}
            <Link href="/register" className="font-semibold text-[#2F3A55] hover:underline">
              Regístrate
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};