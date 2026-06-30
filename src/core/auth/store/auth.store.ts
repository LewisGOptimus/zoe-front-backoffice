import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

import { useAuthService } from '../services/auth.service';

import type { User } from '../types/auth.types';

import { useCompanyStore } from '~/core/company/store/company.store';
import { useCatalogStore } from '~/core/catalog/store/catalog.store';
import { clearCompanyStores } from '~/shared/utils/clear-company-stores';
import { useAuthSessionStore } from './auth-session.store';

export const useAuthStore = defineStore(
  'auth',
  () => {
    const session = useAuthSessionStore();
    const getAuthSvc = () => useAuthService();

    const accessToken = computed(() => session.accessToken);
    const refreshToken = computed(() => session.refreshToken);
    const tokenExpiresAt = computed(() => session.tokenExpiresAt);

    const setAuthTokens = (token: string, refresh: string, expiresIn: number) => {
      session.setAuthTokens(token, refresh, expiresIn);
    };

    const setAccessToken = (token: string, expiresIn: number) => {
      session.setAccessToken(token, expiresIn);
    };

    const clearAuthTokens = () => {
      session.clearAuthTokens();
    };

    const hasValidAccessToken = () => session.hasValidAccessToken();

    const ensureAccessToken = () => session.ensureAccessToken();

    const user = ref<User | null>(null);
    const isLoggedIn = ref<boolean>(false);
    const authFlowInFlight = ref<boolean>(false);
    const lastAuthRedirectAt = ref<number>(0);

    let inFlightGetMePromise: Promise<User | null> | null = null;

    const isVerifiedEmail = computed(() => user.value != null && user.value.isVerified);
    const isAdminUser = computed(() => user.value?.userType === 'USUARIO');
    const isDemoUser = computed(() => user.value?.isDemo === true);

    const setUser = (payload: User | null) => {
      user.value = payload;
    };

    const setAuthFlowInFlight = (inFlight: boolean) => {
      authFlowInFlight.value = inFlight;
    };

    const markAuthRedirect = () => {
      lastAuthRedirectAt.value = Date.now();
    };

    const loginSuccess = (payload: User) => {
      if (!user.value?.id || user.value.id !== payload.id) {
        useCompanyStore().clearCompanyLists();
        clearCompanyStores();
        useCatalogStore().clear();
      }

      user.value = payload;
      isLoggedIn.value = true;
      void useCatalogStore().preload();
    };

    const clearAccessToken = () => {
      session.clearAuthTokens();
    };

    const hasValidSession = () => isLoggedIn.value && session.hasValidAccessToken();

    const getAccessToken = (): string | null => {
      const token = session.accessToken?.trim();
      return token && token.length >= 10 ? token : null;
    };

    const getRefreshToken = (): string | null => {
      return session.refreshToken?.trim() ? session.refreshToken : null;
    };


    const passwordlessLogin = async (email: string) => {
      await getAuthSvc().passwordlessLogin(email);
    };

    const passwordlessLoginVerify = async (email: string, code: string) => {
      const { response } = await getAuthSvc().passwordlessLoginVerify(email, code);
      if (!response?.accessToken?.trim()) {
        throw new Error('La respuesta de passwordlessLoginVerify no incluye accessToken');
      }
      setAuthTokens(response.accessToken, response.refreshToken ?? '', response.expiresIn);
      isLoggedIn.value = true;
      await getMe({ forceAuth: true });
    };

    const getMe = async (options?: { forceAuth?: boolean }) => {
      if (inFlightGetMePromise) {
        return inFlightGetMePromise;
      }

      inFlightGetMePromise = (async () => {
        try {
          const { response } = await getAuthSvc().getMe({ forceAuth: options?.forceAuth });

          if (response) {
            loginSuccess(response);
          } else {
            setUser(null);

            if (!hasValidSession()) {
              isLoggedIn.value = false;
            }
          }

          return response ?? null;
        } catch (err: unknown) {
          const status =
            err && typeof err === 'object' && 'response' in err
              ? (err as { response?: { status?: number }; status?: number }).response?.status ??
                (err as { status?: number }).status
              : undefined;

          if (status === 404) {
            setUser(null);
            isLoggedIn.value = false;
            clearAuthTokens();
            return null;
          }

          throw err;
        }
      })();

      try {
        return await inFlightGetMePromise;
      } finally {
        inFlightGetMePromise = null;
      }
    };




    const logout = async (): Promise<{ success: boolean; error?: unknown }> => {
      let error: unknown;

      try {
        await getAuthSvc().logout(session.refreshToken ?? '');
      } catch (logoutError) {
        error = logoutError;
        if (import.meta.dev) {
          console.warn('[Auth] Error en logout API:', logoutError);
        }
      } finally {
        setUser(null);
        isLoggedIn.value = false;
        clearAuthTokens();
        setAuthFlowInFlight(false);
        lastAuthRedirectAt.value = 0;
        useCompanyStore().clearCompanyLists();
        clearCompanyStores();
        useCatalogStore().clear();
      }

      if (error !== undefined) {
        return { success: false, error };
      }

      return { success: true };
    };

    return {
      user,
      isLoggedIn,
      accessToken,
      refreshToken,
      tokenExpiresAt,
      authFlowInFlight,
      lastAuthRedirectAt,
      isVerifiedEmail,
      isAdminUser,
      isDemoUser,
      setUser,
      setAuthFlowInFlight,
      markAuthRedirect,
      loginSuccess,
      setAuthTokens,
      setAccessToken,
      clearAuthTokens,
      clearAccessToken,
      hasValidAccessToken,
      hasValidSession,
      getAccessToken,
      getRefreshToken,
      passwordlessLogin,
      getMe,
      passwordlessLoginVerify,
      logout,
      ensureAccessToken,
    };
  },
  {
    persist: {
      pick: ['user', 'isLoggedIn'],
    },
  },
);
