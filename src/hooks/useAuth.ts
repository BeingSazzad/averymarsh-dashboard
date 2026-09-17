import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '../constants/routes'
import { SESSION_KEY } from '../lib/constants'
import { authApi } from '../services/endpoints/authApi'
import { setSession } from '../store/platformSlice'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import type { SessionAdmin } from '../types/common.types'

export function readSession(): SessionAdmin | null {
  const raw = localStorage.getItem(SESSION_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as SessionAdmin
  } catch {
    return null
  }
}

export function useAuth() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const session = useAppSelector((state) => state.platform.session)

  const login = useCallback(
    async (email: string, password: string) => {
      const next = await authApi.login(email, password)
      localStorage.setItem(SESSION_KEY, JSON.stringify(next))
      dispatch(setSession(next))
      navigate(ROUTES.overview)
    },
    [dispatch, navigate]
  )

  const logout = useCallback(() => {
    localStorage.removeItem(SESSION_KEY)
    dispatch(setSession(null))
    navigate(ROUTES.login)
  }, [dispatch, navigate])

  return { session, login, logout }
}
