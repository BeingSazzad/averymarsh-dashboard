export type CompanyStatus = 'trial' | 'active' | 'past_due' | 'canceled'
export type InvoiceStatus = 'paid' | 'failed' | 'open'
export type AdminStatus = 'active' | 'invited'

export interface MonthlyPoint {
  month: string
  users: number
  subscriptions: number
  income: number
}

export interface Company {
  id: string
  name: string
  planId: string
  seats: number
  people: number
  status: CompanyStatus
  mrr: number
  joined: string
  renewsOn: string
}

export interface SeatUser {
  id: string
  name: string
  email: string
  companyId: string
  role: string
  lastActive: string
}

export interface Plan {
  id: string
  name: string
  monthlyPrice: number
  yearlyPrice: number
  seats: number
  active: boolean
}

export interface Invoice {
  id: string
  companyId: string
  amount: number
  status: InvoiceStatus
  date: string
}

export interface FaqItem {
  id: string
  question: string
  answer: string
  published: boolean
}

export interface LegalDoc {
  id: 'terms' | 'privacy'
  title: string
  body: string
  updatedAt: string
}

export interface Admin {
  id: string
  name: string
  email: string
  role: 'Owner' | 'Admin' | 'Finance'
  status: AdminStatus
  avatar: string
}

export interface SessionAdmin {
  id: string
  name: string
  email: string
  avatar: string
}
