import { useEffect, useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { ROUTES } from '../constants/routes'
import { readSession } from '../hooks/useAuth'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { setSession } from '../store/platformSlice'
import { AppShell } from '../components/layout/AppShell'
import { Topbar } from '../components/layout/Topbar'

export function PrivateRoute() {
  const dispatch = useAppDispatch()
  const session = useAppSelector((state) => state.platform.session)
  const [bootSession] = useState(() => readSession())
  const activeSession = session ?? bootSession

  useEffect(() => {
    if (!session && bootSession) dispatch(setSession(bootSession))
  }, [bootSession, dispatch, session])

  if (!activeSession) {
    return <Navigate to={ROUTES.login} replace />
  }

  return (
    <AppShell>
      <Topbar />
      <main className="flex-1 min-h-0 overflow-y-auto px-5 py-5 md:px-8 md:py-6 lg:px-10">
        <Outlet />
      </main>
    </AppShell>
  )
}
