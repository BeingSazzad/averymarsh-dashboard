import type { SeatUser } from '../../types/common.types'
import { env } from '../../config/env'
import { apiRequest } from '../api'

/**
 * Users directory API.
 * Pages currently read from Redux seed; call these when backend is ready.
 */
export const usersApi = {
  list(token?: string | null) {
    if (env.useMockApi) {
      return Promise.resolve([] as SeatUser[])
    }
    return apiRequest<SeatUser[]>('/users', { token })
  },
}
