export const ROUTES = {
  login: '/login',
  register: '/register',
  overview: '/',
  analytics: '/analytics',
  companies: '/companies',
  users: '/users',
  plans: '/plans',
  billing: '/billing',
  support: '/support',
  cms: '/cms',
  admins: '/admins',
  profile: '/profile',
  notifications: '/notifications',
} as const

export function companyPath(id: string) {
  return `/companies/${id}`
}
