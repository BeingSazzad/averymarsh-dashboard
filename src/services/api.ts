import type { ApiError } from '../types/api.types'
import { env } from '../config/env'

export class ApiRequestError extends Error {
  status: number

  constructor(error: ApiError) {
    super(error.message)
    this.name = 'ApiRequestError'
    this.status = error.status
  }
}

type ApiMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

interface ApiRequestOptions extends Omit<RequestInit, 'body' | 'method'> {
  method?: ApiMethod
  body?: unknown
  token?: string | null
}

/**
 * Shared HTTP client for backend integration.
 * Swap mock endpoints for real routes without changing pages/store.
 */
export async function apiRequest<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  const { method = 'GET', body, token, headers, ...rest } = options
  const response = await fetch(`${env.apiBase}${path}`, {
    method,
    headers: {
      Accept: 'application/json',
      ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
    ...rest,
  })

  if (!response.ok) {
    let message = `Request failed (${response.status})`
    try {
      const payload = (await response.json()) as { message?: string }
      if (payload.message) message = payload.message
    } catch {
      // ignore non-JSON error bodies
    }
    throw new ApiRequestError({ status: response.status, message })
  }

  if (response.status === 204) return undefined as T
  return (await response.json()) as T
}
