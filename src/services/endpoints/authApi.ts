import type { SessionAdmin } from '../../types/common.types'
import { env } from '../../config/env'
import { apiRequest } from '../api'

/** Mock login until auth backend is connected. */
function mockLogin(email: string, password: string): SessionAdmin {
  if (!email.trim() || password.length < 4) {
    throw new Error('Enter email and a password with 4+ characters.')
  }
  return {
    id: 'adm-1',
    name: 'Sazzad Ahmed',
    email: email.trim().toLowerCase(),
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=160&auto=format&fit=crop&q=80',
  }
}

export const authApi = {
  async login(email: string, password: string): Promise<SessionAdmin> {
    if (env.useMockApi) return mockLogin(email, password)
    return apiRequest<SessionAdmin>('/auth/login', {
      method: 'POST',
      body: { email: email.trim().toLowerCase(), password },
    })
  },
}
