import type { FetchResponse } from 'ofetch'

import { resolveContextualSuccessMessage } from '~/shared/constants/api-notification-context'
import { HEADER_SKIP_NOTIFICATION } from '~/shared/constants/headers'
import { getRequestUrl, isAuthRefreshRequest } from '~/global/infrastructure/api/request-url'

const MUTATION_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE'])

const NOTIFICATION_ERROR_SILENT_PATHS = [
  'auth/refresh',
  'auth/logout',
]

const NOTIFICATION_SUCCESS_SILENT_PATHS = [
  ...NOTIFICATION_ERROR_SILENT_PATHS,
  'auth/login',
  'auth/admin/passwordless/start',
  'auth/admin/passwordless/verify',
  'users/me',
]

type ApiRequestOptions = {
  method?: string
  headers?: HeadersInit
}

const getRequestMethod = (options: ApiRequestOptions) =>
  (options.method ?? 'GET').toUpperCase()

const hasSkipNotificationHeader = (options: ApiRequestOptions) => {
  const headers = new Headers(options.headers)
  return headers.get(HEADER_SKIP_NOTIFICATION) === '1'
}

const matchesPath = (requestUrl: string, paths: string[]) =>
  paths.some((path) => requestUrl.includes(path))

export const shouldSkipApiNotification = (
  request: unknown,
  options: ApiRequestOptions,
) => {
  if (hasSkipNotificationHeader(options)) return true
  return false
}

export const shouldShowApiSuccessNotification = (
  request: unknown,
  response: FetchResponse<unknown>,
  options: ApiRequestOptions,
) => {
  if (shouldSkipApiNotification(request, options)) return false
  if (response.status < 200 || response.status >= 300) return false
  if (!MUTATION_METHODS.has(getRequestMethod(options))) return false

  const requestUrl = getRequestUrl(request)
  return !matchesPath(requestUrl, NOTIFICATION_SUCCESS_SILENT_PATHS)
}

export const shouldShowApiErrorNotification = (
  request: unknown,
  response: FetchResponse<unknown>,
  options: ApiRequestOptions,
) => {
  if (shouldSkipApiNotification(request, options)) return false
  if (isAuthRefreshRequest(request)) return false
  if (response.status === 401) return false

  const requestUrl = getRequestUrl(request)
  if (matchesPath(requestUrl, NOTIFICATION_ERROR_SILENT_PATHS)) return false

  return response.status >= 400
}

export const extractApiErrorMessage = (
  _request: unknown,
  response: FetchResponse<unknown>,
) => {
  const data = response._data

  if (typeof data === 'string' && data.trim()) {
    return data
  }

  if (data && typeof data === 'object') {
    const record = data as Record<string, unknown>

    if (typeof record.message === 'string' && record.message.trim()) {
      return record.message
    }

    if (typeof record.error === 'string' && record.error.trim()) {
      return record.error
    }

    const errors = record.errors
    if (Array.isArray(errors)) {
      const first = errors[0]
      if (typeof first === 'string' && first.trim()) return first
      if (first && typeof first === 'object' && typeof (first as { message?: string }).message === 'string') {
        return (first as { message: string }).message
      }
    }
  }

  return `No se pudo completar la solicitud (${response.status})`
}

export const extractApiSuccessMessage = (
  request: unknown,
  _response: FetchResponse<unknown>,
  options: ApiRequestOptions,
  routePath?: string,
) => {
  const requestUrl = getRequestUrl(request)
  const contextualMessage = resolveContextualSuccessMessage(
    getRequestMethod(options),
    requestUrl,
    routePath,
  )

  if (contextualMessage) return contextualMessage

  const method = getRequestMethod(options)

  if (method === 'POST') return 'El registro se creó correctamente'
  if (method === 'PUT' || method === 'PATCH') return 'El registro se actualizó correctamente'
  if (method === 'DELETE') return 'El registro se eliminó correctamente'

  return null
}
