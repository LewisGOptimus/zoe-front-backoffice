import type { ApiPluginNuxtApp } from './types';
import { getRequestUrl, isAuthRefreshRequest } from './request-url';
import { useAuthStore } from '~/core/auth/store/auth.store';
import { useNotificationAlertStore } from '~/core/ui/notifications/notification-alert.store';
import { HEADER_FORCE_AUTH, HEADER_SKIP_AUTH } from '~/shared/constants/headers';
import {
  extractApiErrorMessage,
  extractApiSuccessMessage,
  shouldShowApiErrorNotification,
  shouldShowApiSuccessNotification,
} from '~/shared/utils/api-notification.utils';

type ApiClient = ReturnType<typeof $fetch.create>;
type ApiResponseErrorContext = Parameters<
  NonNullable<Parameters<typeof $fetch.create>[0]['onResponseError']>
>[0];

type ApiRequestOptions = NonNullable<Parameters<ApiClient>[1]> & {
  _authRetry?: boolean;
};

const AUTH_BYPASS_PATHS = [
  'auth/refresh',
  'auth/logout',
  'auth/login',
  'auth/admin/passwordless/start',
  'auth/admin/passwordless/verify',
];

const isAuthBypassPath = (requestUrl: string): boolean =>
  AUTH_BYPASS_PATHS.some((path) => requestUrl.includes(path));

const createResponseError = (response: ApiResponseErrorContext['response']) => {
  const data = response._data as { message?: string } | undefined;
  const error = new Error(data?.message ?? `La solicitud falló con el estado ${response.status}`) as Error & {
    data?: unknown;
    response: typeof response;
    status: number;
    statusCode: number;
  };

  error.data = response._data;
  error.response = response;
  error.status = response.status;
  error.statusCode = response.status;

  return error;
};

export function createApiClient(
  nuxtApp: ApiPluginNuxtApp,
  basePath: string,
  apiVersion: string,
): ApiClient {
  let client: ApiClient;

  // eslint-disable-next-line prefer-const -- referencia circular para retry del 401
  client = $fetch.create({
    baseURL: `${basePath}/${apiVersion}`,
    headers: {},
    async onRequest({ options }) {
      const headers = new Headers(options.headers);
      const authStore = useAuthStore();
      const skipAuth = headers.get(HEADER_SKIP_AUTH) === '1';
      const forceAuth = headers.get(HEADER_FORCE_AUTH) === '1';
      
      if (!skipAuth && (authStore.isLoggedIn || forceAuth)) {
        const token = await authStore.ensureAccessToken();
        if (token && token.length >= 10) {
          headers.set('Authorization', `Bearer ${token}`);
        } else if (import.meta.dev && forceAuth) {
          console.warn('[API] Petición con forceAuth sin token disponible');
        }
      }

      options.headers = headers;
    },
    onResponse({ request, response, options }) {
      if (!shouldShowApiSuccessNotification(request, response, options)) return;

      nuxtApp.runWithContext(() => {
        const route = useRoute()
        const message = extractApiSuccessMessage(request, response, options, route.path)
        if (!message) return;

        useNotificationAlertStore().showSuccess(message)
      })
    },
    async onResponseError({ request, response, options }) {
      if (shouldShowApiErrorNotification(request, response, options)) {
        nuxtApp.runWithContext(() => {
          const message = extractApiErrorMessage(request, response)

          useNotificationAlertStore().showError(message)
        })
      }

      const authStore = useAuthStore();
      const requestOptions = options as ApiRequestOptions;

      if (response.status === 403) {
        throw createResponseError(response);
      }

      if (response.status !== 401) {
        throw createResponseError(response);
      }

      if (isAuthRefreshRequest(request)) {
        return;
      }

      const requestUrl = getRequestUrl(request);
      const headers = new Headers(requestOptions.headers);
      const skipAuth = headers.get(HEADER_SKIP_AUTH) === '1';

      if (!skipAuth && !isAuthBypassPath(requestUrl) && !requestOptions._authRetry) {
        const token = await authStore.ensureAccessToken();

        if (token && token.length >= 10) {
          requestOptions._authRetry = true;
          headers.set('Authorization', `Bearer ${token}`);

          return client(request, {
            ...requestOptions,
            headers,
          });
        }
      }

      const now = Date.now();
      const timeSinceLastRedirect = now - authStore.lastAuthRedirectAt;
      const MIN_REDIRECT_INTERVAL = 2000;

      if (authStore.authFlowInFlight || timeSinceLastRedirect < MIN_REDIRECT_INTERVAL) {
        return;
      }

      authStore.setAuthFlowInFlight(true);
      authStore.markAuthRedirect();

      try {
        await authStore.logout();

        const authSync = nuxtApp.$authSync;
        authSync?.broadcastLogout?.();

        await nuxtApp.runWithContext(() => navigateTo('/'));
      } catch (error) {
        if (import.meta.dev) {
          console.error('[API] Error en manejo de 401:', error);
        }
        await authStore.logout();
        await nuxtApp.runWithContext(() => navigateTo('/'));
      } finally {
        setTimeout(() => {
          authStore.setAuthFlowInFlight(false);
        }, 1000);
      }
    },
  });

  return client;
}
