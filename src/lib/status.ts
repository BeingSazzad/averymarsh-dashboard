import type { CompanyStatus, InvoiceStatus, TicketStatus } from '../types/common.types'

export function companyTone(status: CompanyStatus) {
  if (status === 'active') return 'green' as const
  if (status === 'trial') return 'blue' as const
  if (status === 'past_due' || status === 'suspended') return 'amber' as const
  return 'red' as const
}

export function companyLabel(status: CompanyStatus) {
  if (status === 'past_due') return 'Past due'
  if (status === 'trial') return 'Trial'
  if (status === 'suspended') return 'Banned'
  if (status === 'canceled') return 'Canceled'
  return 'Active'
}

export function invoiceTone(status: InvoiceStatus) {
  if (status === 'paid') return 'green' as const
  if (status === 'open') return 'blue' as const
  return 'red' as const
}

export function ticketTone(status: TicketStatus) {
  if (status === 'open') return 'blue' as const
  if (status === 'pending') return 'amber' as const
  return 'green' as const
}
