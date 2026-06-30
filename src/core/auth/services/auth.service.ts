import type { GetMeResponse, LoginApiResponse } from '../types/auth.types';
import { HEADER_FORCE_AUTH, HEADER_SKIP_AUTH, HEADER_SKIP_NOTIFICATION } from '~/shared/constants/headers';

export const useAuthService = () => {
  const { $apiCore } = useNuxtApp();


  const passwordlessLogin = (email: string): Promise<void> => {
    return $apiCore<void>('auth/admin/passwordless/start', {
      method: 'POST',
      headers: { [HEADER_SKIP_AUTH]: '1', [HEADER_SKIP_NOTIFICATION]: '1' },
      body: {
        email,
      },
    });
  };

  const passwordlessLoginVerify = (email: string, otp: string): Promise<LoginApiResponse> => {
    return $apiCore<LoginApiResponse>('auth/admin/passwordless/verify', {
      method: 'POST',
      headers: { [HEADER_SKIP_AUTH]: '1', [HEADER_SKIP_NOTIFICATION]: '1' },
      body: {
        email,
        otp,
      },
    });
  };

  const refresh = (token: string): Promise<LoginApiResponse> => {
    return $apiCore<LoginApiResponse>('auth/refresh', {
      method: 'POST',
      headers: { [HEADER_SKIP_AUTH]: '1', [HEADER_SKIP_NOTIFICATION]: '1' },
      body: {
        refreshToken: token,
      },
    });
  };

  const getMe = (options?: { forceAuth?: boolean }): Promise<GetMeResponse> => {
    const headers: Record<string, string> = {};
    if (options?.forceAuth) headers[HEADER_FORCE_AUTH] = '1';
    return $apiCore<GetMeResponse>('users/me', {
      method: 'GET',
      headers,
    });
  };

  const logout = (refreshToken: string): Promise<void> => {
    return $apiCore<void >('auth/logout', {
      method: 'POST',
      headers: { [HEADER_SKIP_NOTIFICATION]: '1' },
      body: {
        refreshToken,
      },
    });
  };



  return {
    getMe,
    passwordlessLoginVerify,
    logout,
    refresh,
    passwordlessLogin,
  };
};
