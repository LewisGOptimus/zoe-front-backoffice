<template>
  <div class="relative min-h-screen overflow-hidden bg-[#F4F8FF] dark:bg-[#0A1020]">
    <!-- Base -->
    <div
      class="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,123,255,0.14),transparent_42%),linear-gradient(180deg,#FFFFFF_0%,#E8F2FF_100%)] dark:bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.16),transparent_42%),linear-gradient(180deg,#0F172A_0%,#080D1A_100%)]"
    />

    <!-- Círculos suaves -->
    <div class="pointer-events-none absolute inset-0 flex items-center justify-center">
      <div class="absolute h-[900px] w-[900px] rounded-full border border-[#007BFF]/10 dark:border-blue-400/[0.035]" />
      <div class="absolute h-[680px] w-[680px] rounded-full border border-[#007BFF]/12 dark:border-blue-400/[0.04]" />
      <div class="absolute h-[460px] w-[460px] rounded-full border border-[#007BFF]/15 dark:border-blue-400/[0.045]" />
    </div>

    <!-- Luces suaves -->
    <div class="absolute left-1/2 top-1/2 h-[620px] w-[620px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#007BFF]/10 blur-3xl dark:bg-blue-500/[0.04]" />
    <div class="absolute -left-32 bottom-0 h-[280px] w-[480px] rounded-full bg-[#007BFF]/12 blur-3xl dark:bg-blue-600/[0.06]" />
    <div class="absolute -right-32 bottom-0 h-[280px] w-[480px] rounded-full bg-[#007BFF]/12 blur-3xl dark:bg-blue-600/[0.06]" />

    <!-- Partículas -->
    <div class="absolute inset-0">
      <span class="absolute left-[15%] top-[20%] h-1 w-1 rounded-full bg-[#007BFF]/35 dark:bg-blue-300/40" />
      <span class="absolute left-[80%] top-[25%] h-2 w-2 rounded-full bg-[#007BFF]/25 dark:bg-blue-400/25" />
      <span class="absolute left-[30%] bottom-[25%] h-1.5 w-1.5 rounded-full bg-[#007BFF]/20 dark:bg-blue-300/25" />
      <span class="absolute right-[20%] bottom-[18%] h-1 w-1 rounded-full bg-[#007BFF]/30 dark:bg-blue-300/35" />
    </div>

    <!-- Nube izquierda — modo claro -->
    <svg
      class="pointer-events-none absolute -left-24 bottom-[-45px] w-[520px] opacity-40 dark:hidden"
      viewBox="0 0 560 260"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="cloudLeftLight" x1="0" y1="0" x2="560" y2="0">
          <stop stop-color="#007BFF" stop-opacity="0" />
          <stop offset="0.35" stop-color="#007BFF" stop-opacity="0.55" />
          <stop offset="1" stop-color="#66B0FF" stop-opacity="0.2" />
        </linearGradient>
        <filter id="softGlowLeftLight" x="-20%" y="-40%" width="140%" height="180%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <path
        d="M4 216H402C457 216 502 173 502 120C502 68 459 26 406 26C388 26 371 31 356 39C329 16 293 2 253 2C191 2 138 41 120 95C107 91 94 89 80 89C37 89 2 124 2 167C2 185 8 202 18 216"
        stroke="url(#cloudLeftLight)"
        stroke-width="4"
        stroke-linecap="round"
        stroke-linejoin="round"
        filter="url(#softGlowLeftLight)"
      />
    </svg>

    <!-- Nube izquierda — modo oscuro -->
    <svg
      class="pointer-events-none absolute -left-24 bottom-[-45px] hidden w-[520px] opacity-25 dark:block"
      viewBox="0 0 560 260"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="cloudLeftDark" x1="0" y1="0" x2="560" y2="0">
          <stop stop-color="#2563EB" stop-opacity="0" />
          <stop offset="0.35" stop-color="#3B82F6" stop-opacity="0.65" />
          <stop offset="1" stop-color="#60A5FA" stop-opacity="0.15" />
        </linearGradient>
        <filter id="softGlowLeftDark" x="-20%" y="-40%" width="140%" height="180%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <path
        d="M4 216H402C457 216 502 173 502 120C502 68 459 26 406 26C388 26 371 31 356 39C329 16 293 2 253 2C191 2 138 41 120 95C107 91 94 89 80 89C37 89 2 124 2 167C2 185 8 202 18 216"
        stroke="url(#cloudLeftDark)"
        stroke-width="4"
        stroke-linecap="round"
        stroke-linejoin="round"
        filter="url(#softGlowLeftDark)"
      />
    </svg>

    <!-- Nube derecha — modo claro -->
    <svg
      class="pointer-events-none absolute -right-24 bottom-[-35px] w-[520px] opacity-40 dark:hidden"
      viewBox="0 0 560 260"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="cloudRightLight" x1="560" y1="0" x2="0" y2="0">
          <stop stop-color="#007BFF" stop-opacity="0" />
          <stop offset="0.35" stop-color="#007BFF" stop-opacity="0.55" />
          <stop offset="1" stop-color="#66B0FF" stop-opacity="0.2" />
        </linearGradient>
        <filter id="softGlowRightLight" x="-20%" y="-40%" width="140%" height="180%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <path
        d="M4 216H402C457 216 502 173 502 120C502 68 459 26 406 26C388 26 371 31 356 39C329 16 293 2 253 2C191 2 138 41 120 95C107 91 94 89 80 89C37 89 2 124 2 167C2 185 8 202 18 216"
        stroke="url(#cloudRightLight)"
        stroke-width="4"
        stroke-linecap="round"
        stroke-linejoin="round"
        filter="url(#softGlowRightLight)"
      />
    </svg>

    <!-- Nube derecha — modo oscuro -->
    <svg
      class="pointer-events-none absolute -right-24 bottom-[-35px] hidden w-[520px] opacity-25 dark:block"
      viewBox="0 0 560 260"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="cloudRightDark" x1="560" y1="0" x2="0" y2="0">
          <stop stop-color="#2563EB" stop-opacity="0" />
          <stop offset="0.35" stop-color="#3B82F6" stop-opacity="0.65" />
          <stop offset="1" stop-color="#60A5FA" stop-opacity="0.15" />
        </linearGradient>
        <filter id="softGlowRightDark" x="-20%" y="-40%" width="140%" height="180%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <path
        d="M4 216H402C457 216 502 173 502 120C502 68 459 26 406 26C388 26 371 31 356 39C329 16 293 2 253 2C191 2 138 41 120 95C107 91 94 89 80 89C37 89 2 124 2 167C2 185 8 202 18 216"
        stroke="url(#cloudRightDark)"
        stroke-width="4"
        stroke-linecap="round"
        stroke-linejoin="round"
        filter="url(#softGlowRightDark)"
      />
    </svg>

    <!-- Formulario -->
    <div class="relative z-10 flex min-h-screen items-center justify-center px-4">
      <div
        class="w-full max-w-[440px] rounded-2xl border border-[#007BFF]/10 bg-white/75 p-8 shadow-2xl shadow-blue-500/10 backdrop-blur-xl
               dark:border-white/10 dark:bg-[#111827]/75 dark:shadow-black/30"
      >
        <!-- Logo nube -->
        <div class="mb-8 text-center">
          <div
            class="mx-auto mb-5 flex size-16 items-center justify-center rounded-2xl bg-[#007BFF]/10 text-[#007BFF]
                   dark:bg-blue-500/10 dark:text-blue-400"
          >
            <svg class="size-10" viewBox="0 0 64 64" fill="none">
              <path
                d="M20 46H45C52 46 58 40 58 33C58 26 52 20 45 20C43 20 41 20.4 39 21.3C35.8 16.2 30.2 13 24 13C14.6 13 7 20.6 7 30C7 31.3 7.1 32.6 7.4 33.8C3.5 35.5 1 39.3 1 43.5C1 49.3 5.7 54 11.5 54H20"
                stroke="currentColor"
                stroke-width="4"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>

          <h1 class="text-3xl font-bold text-slate-900 dark:text-white">
            Bienvenido
          </h1>
          <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Inicia sesión en tu cuenta empresarial
          </p>
        </div>

        <!-- Botones sociales -->
        <div class="space-y-3">
          <button
            type="button"
            class="flex w-full items-center justify-center gap-2 rounded-xl bg-[#4285F4] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#3478e5]"
          >
            Continuar con Google
          </button>

          <button
            type="button"
            class="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-800 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700
                   dark:bg-white/10 dark:hover:bg-white/15"
          >
            Continuar con GitHub
          </button>
        </div>

        <!-- Separador -->
        <div class="my-6 flex items-center gap-4">
          <div class="h-px flex-1 bg-slate-200 dark:bg-white/10" />
          <span class="text-xs text-slate-400">o</span>
          <div class="h-px flex-1 bg-slate-200 dark:bg-white/10" />
        </div>

        <!-- Formulario -->
        <form class="space-y-4" @submit.prevent>
          <div>
            <label class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
              Correo electrónico
            </label>
            <input
              type="email"
              placeholder="ejemplo@empresa.com"
              class="w-full rounded-xl border border-slate-300 bg-white/80 px-4 py-3 text-sm text-slate-900 outline-none transition
                     placeholder:text-slate-400 focus:border-[#007BFF] focus:ring-4 focus:ring-[#007BFF]/10
                     dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-slate-500"
            />
          </div>

          <div>
            <label class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
              Contraseña
            </label>
            <input
              type="password"
              placeholder="Tu contraseña"
              class="w-full rounded-xl border border-slate-300 bg-white/80 px-4 py-3 text-sm text-slate-900 outline-none transition
                     placeholder:text-slate-400 focus:border-[#007BFF] focus:ring-4 focus:ring-[#007BFF]/10
                     dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-slate-500"
            />
          </div>

          <div class="flex items-center justify-between text-sm">
            <label class="flex items-center gap-2 text-slate-600 dark:text-slate-400">
              <input type="checkbox" class="rounded border-slate-300" />
              Recuérdame
            </label>

            <a href="#" class="font-medium text-[#007BFF] hover:underline">
              ¿Olvidaste tu contraseña?
            </a>
          </div>

          <button
            type="submit"
            class="w-full rounded-xl bg-[#007BFF] px-4 py-3 font-semibold text-white transition hover:bg-blue-600"
          >
            Iniciar sesión
          </button>
        </form>

        <!-- Footer -->
        <p class="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
          ¿No tienes una cuenta?
          <a href="#" class="font-semibold text-[#007BFF]">Contáctanos</a>
        </p>
      </div>
    </div>
  </div>
</template>
