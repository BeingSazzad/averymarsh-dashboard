import { uid } from './utils'
import type { Admin, FaqItem, Plan, SupportTicket } from '../types/common.types'

export function newPlan(): Plan {
  return {
    id: uid('plan'),
    name: '',
    monthlyPrice: 0,
    yearlyPrice: 0,
    seats: 5,
    active: true,
    description: '',
    features: [],
  }
}

export function newFaq(): FaqItem {
  return { id: uid('faq'), question: '', answer: '', published: false }
}

export function newAdmin(): Admin {
  return {
    id: uid('adm'),
    name: '',
    email: '',
    role: 'Admin',
    status: 'invited',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=160&auto=format&fit=crop&q=80',
  }
}

export function newTicket(companyId: string): SupportTicket {
  const today = new Date().toISOString().slice(0, 10)
  return {
    id: uid('tkt'),
    companyId,
    subject: '',
    requester: '',
    status: 'open',
    priority: 'normal',
    createdAt: today,
    updatedAt: today,
    body: '',
  }
}

export function makeTempPassword(): string {
  return `Lat${Math.random().toString(36).slice(2, 6)}!${Math.floor(Math.random() * 90 + 10)}`
}
