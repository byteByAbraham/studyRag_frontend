'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AuthInput } from '../ui/auth-input';
import { AuthButton } from '../ui/auth-button';

export const RegisterForm = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // ←←← AJUSTA ESTA URL SEGÚN TU BACKEND
  const REGISTER_URL = '/api/auth/register'; // Ejemplo: puedes cambiarla a http://localhost:3001/api/auth/register

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(REGISTER_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: formData.nombre,
          apellido: formData.apellido,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al registrar usuario');
      }

      setSuccess(true);
      // Opcional: redirigir después de registro exitoso
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);

    } catch (err: any) {
      setError(err.message || 'Ocurrió un error inesperado');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-white px-10 py-12">
        <div className="w-full max-w-[420px] text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <span className="text-3xl">🎉</span>
          </div>
          <h2 className="text-2xl font-bold text-[#2F3A55] mb-3">¡Registro exitoso!</h2>
          <p className="text-[#5C6B8A]">Te estamos redirigiendo al login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full lg:w-1/2 flex items-center justify-center bg-white px-10 py-12">
      <div className="w-full max-w-[420px]">
        <div className="text-center mb-8">
          <h2 className="text-[32px] font-bold tracking-tight text-[#2F3A55]">
            Crear cuenta
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[#5C6B8A]">
            Regístrate para acceder a tus materiales y salas de estudio.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <AuthInput
              label="Nombre"
              placeholder="Nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
            />

            <AuthInput
              label="Apellido"
              placeholder="Apellido"
              name="apellido"
              value={formData.apellido}
              onChange={handleChange}
              required
            />
          </div>

          <AuthInput
            label="Correo"
            type="email"
            placeholder="correo@gmail.com"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <AuthInput
            label="Contraseña"
            type="password"
            placeholder="••••••••"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          {error && (
            <p className="text-red-500 text-sm text-center bg-red-50 py-2 rounded-xl">
              {error}
            </p>
          )}

          <div className="pt-2">
            <AuthButton type="submit" disabled={loading}>
              {loading ? 'Registrando...' : 'Registrarse'}
            </AuthButton>
          </div>
        </form>

        <div className="mt-8 border-t border-gray-200 pt-6 text-center">
          <p className="text-sm text-[#5C6B8A]">
            ¿Ya tienes una cuenta?{' '}
            <Link
              href="/login"
              className="font-semibold text-[#2F3A55] hover:underline"
            >
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};