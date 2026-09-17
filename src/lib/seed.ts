import { MONTHS } from '../lib/constants'
import type {
  Admin,
  Company,
  FaqItem,
  Invoice,
  LegalDoc,
  MonthlyPoint,
  Plan,
  SeatUser,
} from '../types/common.types'

export function yearSeries(year: number): MonthlyPoint[] {
  const offset = year - 2024
  return MONTHS.map((month, index) => ({
    month,
    users: 210 + offset * 96 + index * 16,
    subscriptions: 38 + offset * 14 + index * 3,
    income: 24000 + offset * 11000 + index * 3800,
  }))
}

export const seedPlans: Plan[] = [
  { id: 'plan-field', name: 'Field', monthlyPrice: 49, yearlyPrice: 490, seats: 8, active: true },
  { id: 'plan-crew', name: 'Crew', monthlyPrice: 129, yearlyPrice: 1290, seats: 25, active: true },
  { id: 'plan-company', name: 'Company', monthlyPrice: 249, yearlyPrice: 2490, seats: 80, active: true },
]

export const seedCompanies: Company[] = [
  { id: 'co-1', name: 'Avery & Marsh Construction', planId: 'plan-company', seats: 42, status: 'active', mrr: 249, joined: '2024-03-12' },
  { id: 'co-2', name: 'Harborview Builders', planId: 'plan-crew', seats: 18, status: 'active', mrr: 129, joined: '2024-07-02' },
  { id: 'co-3', name: 'Snell Isle Residences LLC', planId: 'plan-crew', seats: 11, status: 'trial', mrr: 0, joined: '2026-08-21' },
  { id: 'co-4', name: 'Ridge Line GC', planId: 'plan-field', seats: 6, status: 'past_due', mrr: 49, joined: '2025-01-18' },
  { id: 'co-5', name: 'Metro Trust Projects', planId: 'plan-company', seats: 61, status: 'active', mrr: 249, joined: '2025-11-04' },
]

export const seedUsers: SeatUser[] = [
  { id: 'u-1', name: 'Avery Scott', email: 'avery@averymarsh.com', companyId: 'co-1', role: 'Owner', lastActive: '2026-09-17' },
  { id: 'u-2', name: 'Sarah Johnson', email: 'sarah@averymarsh.com', companyId: 'co-1', role: 'PM', lastActive: '2026-09-16' },
  { id: 'u-3', name: 'John Smith', email: 'john@harborview.com', companyId: 'co-2', role: 'Field', lastActive: '2026-09-15' },
  { id: 'u-4', name: 'Elena Rossi', email: 'elena@snellisle.com', companyId: 'co-3', role: 'Owner', lastActive: '2026-09-14' },
  { id: 'u-5', name: 'Michael Chang', email: 'mike@metrotrust.com', companyId: 'co-5', role: 'Finance', lastActive: '2026-09-17' },
]

export const seedInvoices: Invoice[] = [
  { id: 'inv-1042', companyId: 'co-1', amount: 2490, status: 'paid', date: '2026-09-01' },
  { id: 'inv-1041', companyId: 'co-5', amount: 2490, status: 'paid', date: '2026-09-01' },
  { id: 'inv-1040', companyId: 'co-2', amount: 1290, status: 'paid', date: '2026-08-01' },
  { id: 'inv-1039', companyId: 'co-4', amount: 49, status: 'failed', date: '2026-08-01' },
  { id: 'inv-1038', companyId: 'co-2', amount: 129, status: 'open', date: '2026-09-12' },
]

export const seedFaqs: FaqItem[] = [
  { id: 'faq-1', question: 'How are seats billed?', answer: 'Each company plan includes a seat cap. Extra seats are billed on the next invoice.', published: true },
  { id: 'faq-2', question: 'Can we export project data?', answer: 'Owners can export logs, photos, and budget CSVs from the Lattice app.', published: true },
  { id: 'faq-3', question: 'What happens after a failed payment?', answer: 'The company is marked past due. Access stays open for 7 days.', published: false },
]

export const seedLegal: LegalDoc[] = [
  {
    id: 'terms',
    title: 'Terms of Service',
    body: 'Lattice is provided as a construction operations platform. Companies are responsible for the accuracy of project data entered by their users. Subscriptions renew monthly or yearly until canceled.',
    updatedAt: '2026-08-01',
  },
  {
    id: 'privacy',
    title: 'Privacy Policy',
    body: 'We store company, project, and billing data to operate Lattice. We do not sell personal information. Admins can request export or deletion of a tenant.',
    updatedAt: '2026-08-01',
  },
]

export const seedAdmins: Admin[] = [
  {
    id: 'adm-1',
    name: 'Sazzad Ahmed',
    email: 'sazzad@lattice.build',
    role: 'Owner',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=160&auto=format&fit=crop&q=80',
  },
  {
    id: 'adm-2',
    name: 'Priya Sen',
    email: 'priya@lattice.build',
    role: 'Finance',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=160&auto=format&fit=crop&q=80',
  },
]
