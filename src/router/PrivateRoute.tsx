import { useEffect } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { ROUTES } from '../constants/routes'
import { readSession } from '../hooks/useAuth'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { setSession } from '../store/platformSlice'
import { AppShell } from '../components/layout/Sidebar'
import { Topbar } from '../components/layout/Topbar'

export function PrivateRoute() {
  const dispatch = useAppDispatch()
  const session = useAppSelector((state) => state.platform.session)

  useEffect(() => {
    if (session) return
    const stored = readSession()
    if (stored) dispatch(setSession(stored))
  }, [dispatch, session])

  if (!session && !readSession()) {
    return <Navigate to={ROUTES.login} replace />
  }

  if (!session) return null

  return (
    <AppShell>
      <Topbar />
      <main className="flex-1 p-4 md:p-6">
        <Outlet />
      </main>
    </AppShell>
  )
}
