import type { Company } from '../../types/common.types'
import { env } from '../../config/env'
import { apiRequest } from '../api'

/**
 * Companies API.
 * Pages currently read from Redux seed; call these when backend is ready.
 */
export const companiesApi = {
  list(token?: string | null) {
    if (env.useMockApi) {
      return Promise.resolve([] as Company[])
    }
    return apiRequest<Company[]>('/companies', { token })
  },

  get(id: string, token?: string | null) {
    if (env.useMockApi) {
      return Promise.resolve(null as Company | null)
    }
    return apiRequest<Company>(`/companies/${id}`, { token })
  },
}
