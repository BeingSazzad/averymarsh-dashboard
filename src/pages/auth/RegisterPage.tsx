import { Navigate } from 'react-router-dom'
import { ROUTES } from '../../constants/routes'

/** Registration is invite-only for Lattice Admin. */
export function RegisterPage() {
  return <Navigate to={ROUTES.login} replace />
}
