/**
 * App env — set VITE_* in Vercel Project Settings / .env.local
 * Keep defaults so local demo works before backend is wired.
 */
export const env = {
  appName: import.meta.env.VITE_APP_NAME ?? 'Lattice Admin',
  apiBase: import.meta.env.VITE_API_BASE ?? '/api',
  useMockApi: (import.meta.env.VITE_USE_MOCK_API ?? 'true') === 'true',
} as const
