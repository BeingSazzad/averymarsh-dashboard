import { API_BASE } from '../api'

export const authApi = {
  login(email: string, password: string) {
    if (!email.trim() || password.length < 4) {
      throw new Error('Enter email and a password with 4+ characters.')
    }
    void API_BASE
    return {
      id: 'adm-1',
      name: 'Sazzad Ahmed',
      email: email.trim(),
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=160&auto=format&fit=crop&q=80',
    }
  },
}
