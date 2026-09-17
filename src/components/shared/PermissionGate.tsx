import type { ReactNode } from 'react'

interface PermissionGateProps {
  allow: boolean
  children: ReactNode
}

export function PermissionGate({ allow, children }: PermissionGateProps) {
  if (!allow) return null
  return children
}
