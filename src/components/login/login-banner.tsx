import React from "react";

export const LoginBanner = () => {
  return (
    <div className="hidden lg:flex flex-col justify-between p-16 w-1/2 bg-[#2F3A55] text-white font-geist">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 6.75v10.5m5.25-5.25H6.75"
            />
          </svg>
        </div>

        <span className="text-2xl font-semibold tracking-tight">
          StudyRAG
        </span>
      </div>

      <div className="space-y-7">
        <h1 className="text-6xl font-bold leading-tight tracking-tight">
          Gestiona tu
          <br />
          conocimiento.
        </h1>

        <p className="text-xl font-normal max-w-md text-[#B0BA92] leading-relaxed">
          Plataforma de estudio inteligente diseñada para potenciar tu
          rendimiento académico.
        </p>
      </div>

      <div className="space-y-6">

        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.75 17L15 12l-5.25-5"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 12h10.5"
              />
            </svg>
          </div>

          <div>
            <h4 className="text-lg font-semibold">IA</h4>
            <p className="text-base text-[#B0BA92]">
              Consultas precisas e inteligentes.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 12h16.5"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 3.75v16.5"
              />
              <circle cx="12" cy="12" r="7.5" />
            </svg>
          </div>

          <div>
            <h4 className="text-lg font-semibold">Seguimiento</h4>
            <p className="text-base text-[#B0BA92]">
              Progreso en tiempo real.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};