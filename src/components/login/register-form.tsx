'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';
import { AuthInput } from '../ui/auth-input';
import { AuthButton } from '../ui/auth-button';
import { GoogleLoginButton } from './google-btn';

export const RegisterForm = () => {

  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    password: '',
  });


  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


  const REGISTER_URL = '/api/auth/register';



  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {

    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

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

        body: JSON.stringify(formData),

      });



      const data = await response.json();



      if (!response.ok) {

        throw new Error(data.message || 'Error al registrar usuario');

      }



      // Guardamos temporalmente el correo para verificarlo después
      localStorage.setItem('verifyEmail', formData.email);



      // Enviar a la pantalla de código
      window.location.href = '/verify';



    } catch (err: any) {

      setError(err.message || 'Ocurrió un error inesperado');


    } finally {

      setLoading(false);

    }

  };



  return (

    <div className="
      w-full 
      lg:w-1/2 
      flex 
      items-center 
      justify-center 
      bg-white 
      px-8 
      py-10 
      lg:px-14
    ">


      <div className="w-full max-w-[440px]">


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





          <div>


            <label className="mb-2 block text-sm font-medium text-[#2F3A55]">
              Contraseña
            </label>



            <div className="relative">


              <input

                type={showPassword ? 'text' : 'password'}

                placeholder="••••••••"

                name="password"

                value={formData.password}

                onChange={handleChange}

                required


                className="
                  w-full
                  rounded-xl
                  border
                  border-gray-300
                  px-4
                  py-3
                  pr-12
                  text-sm
                  outline-none
                  transition
                  focus:border-[#2F3A55]
                "

              />



              <button

                type="button"

                onClick={() => setShowPassword(!showPassword)}

                className="
                  absolute
                  right-4
                  top-1/2
                  -translate-y-1/2
                  text-gray-500
                  hover:text-[#2F3A55]
                "

              >

                {showPassword ? (

                  <EyeOff size={20}/>

                ) : (

                  <Eye size={20}/>

                )}


              </button>


            </div>


          </div>





          {error && (

            <p className="
              text-red-500
              text-sm
              text-center
              bg-red-50
              py-2
              rounded-xl
            ">

              {error}

            </p>

          )}






          <div className="pt-2">


            <AuthButton type="submit" disabled={loading}>

              {loading ? 'Registrando...' : 'Registrarse'}

            </AuthButton>


          </div>




        </form>






        <div className="relative my-6">


          <div className="absolute inset-0 flex items-center">

            <div className="w-full border-t border-gray-200"></div>

          </div>



          <div className="relative flex justify-center text-[12px] uppercase">

            <span className="bg-white px-2 text-[#5C6B8A]">

              O regístrate con

            </span>

          </div>


        </div>






        <GoogleLoginButton />






        <div className="mt-8 border-t border-gray-200 pt-6 text-center">


          <p className="text-sm text-[#5C6B8A]">


            ¿Ya tienes una cuenta?{' '}


            <Link

              href="/login"

              className="
                font-semibold
                text-[#2F3A55]
                hover:underline
              "

            >

              Inicia sesión

            </Link>


          </p>


        </div>



      </div>


    </div>

  );

};