import type { CompanyStatus, InvoiceStatus } from '../types/common.types'

export function companyTone(status: CompanyStatus) {
  if (status === 'active') return 'green' as const
  if (status === 'trial') return 'blue' as const
  if (status === 'past_due') return 'amber' as const
  return 'red' as const
}

export function companyLabel(status: CompanyStatus) {
  if (status === 'past_due') return 'Past due'
  if (status === 'trial') return 'Trial'
  if (status === 'canceled') return 'Canceled'
  return 'Active'
}

export function invoiceTone(status: InvoiceStatus) {
  if (status === 'paid') return 'green' as const
  if (status === 'open') return 'blue' as const
  return 'red' as const
}
