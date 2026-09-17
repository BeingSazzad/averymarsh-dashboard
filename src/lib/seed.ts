import { MONTHS } from '../lib/constants'
import type {
  Admin,
  AppNotification,
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
  {
    id: 'co-1',
    name: 'Avery & Marsh Construction',
    planId: 'plan-company',
    seats: 42,
    people: 38,
    status: 'active',
    mrr: 249,
    joined: '2024-03-12',
    renewsOn: '2026-10-12',
    logo: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=160&h=160&fit=crop&q=80',
    ownerEmail: 'avery@averymarsh.com',
    accessMethod: 'invite',
  },
  {
    id: 'co-2',
    name: 'Harborview Builders',
    planId: 'plan-crew',
    seats: 25,
    people: 16,
    status: 'active',
    mrr: 129,
    joined: '2024-07-02',
    renewsOn: '2026-10-02',
    logo: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=160&h=160&fit=crop&q=80',
    ownerEmail: 'omar@harborview.com',
    accessMethod: 'credentials',
  },
  {
    id: 'co-3',
    name: 'Snell Isle Residences LLC',
    planId: 'plan-crew',
    seats: 25,
    people: 8,
    status: 'trial',
    mrr: 0,
    joined: '2026-08-21',
    renewsOn: '2026-09-21',
    logo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=160&h=160&fit=crop&q=80',
    ownerEmail: 'elena@snellisle.com',
    accessMethod: 'invite',
  },
  {
    id: 'co-4',
    name: 'Ridge Line GC',
    planId: 'plan-field',
    seats: 8,
    people: 5,
    status: 'past_due',
    mrr: 49,
    joined: '2025-01-18',
    renewsOn: '2026-08-18',
    logo: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=160&h=160&fit=crop&q=80',
    ownerEmail: 'dana@ridgeline.com',
    accessMethod: 'invite',
  },
  {
    id: 'co-5',
    name: 'Metro Trust Projects',
    planId: 'plan-company',
    seats: 80,
    people: 54,
    status: 'active',
    mrr: 249,
    joined: '2025-11-04',
    renewsOn: '2026-11-04',
    logo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=160&h=160&fit=crop&q=80',
    ownerEmail: 'chris@metrotrust.com',
    accessMethod: 'credentials',
  },
]

export const seedUsers: SeatUser[] = [
  { id: 'u-1', name: 'Avery Scott', email: 'avery@averymarsh.com', companyId: 'co-1', role: 'Owner', lastActive: '2026-09-17' },
  { id: 'u-2', name: 'Sarah Johnson', email: 'sarah@averymarsh.com', companyId: 'co-1', role: 'PM', lastActive: '2026-09-16' },
  { id: 'u-6', name: 'Marcus Hale', email: 'marcus@averymarsh.com', companyId: 'co-1', role: 'Field', lastActive: '2026-09-15' },
  { id: 'u-7', name: 'Nina Patel', email: 'nina@averymarsh.com', companyId: 'co-1', role: 'Finance', lastActive: '2026-09-14' },
  { id: 'u-3', name: 'John Smith', email: 'john@harborview.com', companyId: 'co-2', role: 'Field', lastActive: '2026-09-15' },
  { id: 'u-8', name: 'Lisa Chen', email: 'lisa@harborview.com', companyId: 'co-2', role: 'PM', lastActive: '2026-09-16' },
  { id: 'u-9', name: 'Omar Diaz', email: 'omar@harborview.com', companyId: 'co-2', role: 'Owner', lastActive: '2026-09-13' },
  { id: 'u-4', name: 'Elena Rossi', email: 'elena@snellisle.com', companyId: 'co-3', role: 'Owner', lastActive: '2026-09-14' },
  { id: 'u-10', name: 'Tom Briggs', email: 'tom@snellisle.com', companyId: 'co-3', role: 'Field', lastActive: '2026-09-12' },
  { id: 'u-11', name: 'Dana Cole', email: 'dana@ridgeline.com', companyId: 'co-4', role: 'Owner', lastActive: '2026-09-10' },
  { id: 'u-12', name: 'Will Park', email: 'will@ridgeline.com', companyId: 'co-4', role: 'Field', lastActive: '2026-09-08' },
  { id: 'u-5', name: 'Michael Chang', email: 'mike@metrotrust.com', companyId: 'co-5', role: 'Finance', lastActive: '2026-09-17' },
  { id: 'u-13', name: 'Grace Liu', email: 'grace@metrotrust.com', companyId: 'co-5', role: 'PM', lastActive: '2026-09-16' },
  { id: 'u-14', name: 'Chris Webb', email: 'chris@metrotrust.com', companyId: 'co-5', role: 'Owner', lastActive: '2026-09-17' },
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
    body: '<p>Lattice is provided as a construction operations platform. Companies are responsible for the accuracy of project data entered by their users.</p><p>Subscriptions renew monthly or yearly until canceled. Past-due accounts keep access for 7 days.</p>',
    updatedAt: '2026-08-01',
  },
  {
    id: 'privacy',
    title: 'Privacy Policy',
    body: '<p>We store company, project, and billing data to operate Lattice. We do not sell personal information.</p><p>Admins can request export or deletion of a tenant at any time.</p>',
    updatedAt: '2026-08-01',
  },
  {
    id: 'about',
    title: 'About Us',
    body: '<h2>Build better. Together.</h2><p>Lattice helps construction teams run jobs, budgets, and field work in one place.</p><p>We sell Lattice to contractors and GCs, then give each company its own workspace with seats, roles, and billing.</p>',
    updatedAt: '2026-09-01',
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

export const seedNotifications: AppNotification[] = [
  {
    id: 'n-1',
    kind: 'payment',
    title: 'Payment failed · Ridge Line GC',
    body: 'Invoice inv-1039 for $49 failed. Renew or follow up before access locks.',
    createdAt: '2026-09-17T08:20:00',
    read: false,
    href: '/companies',
  },
  {
    id: 'n-2',
    kind: 'trial',
    title: 'Trial ending · Snell Isle Residences',
    body: 'Trial renews Sep 21. Convert to a paid plan or extend access.',
    createdAt: '2026-09-16T14:10:00',
    read: false,
    href: '/companies',
  },
  {
    id: 'n-3',
    kind: 'access',
    title: 'Invite accepted · Harborview Builders',
    body: 'Omar Diaz signed into Lattice with the invite you sent.',
    createdAt: '2026-09-15T11:05:00',
    read: true,
    href: '/users',
  },
  {
    id: 'n-4',
    kind: 'payment',
    title: 'Payment received · Avery & Marsh',
    body: 'Yearly Company plan paid · $2,490 collected.',
    createdAt: '2026-09-01T09:00:00',
    read: true,
    href: '/billing',
  },
  {
    id: 'n-5',
    kind: 'system',
    title: 'CMS published',
    body: 'Privacy Policy update is live for Lattice customers.',
    createdAt: '2026-08-28T16:40:00',
    read: true,
    href: '/cms',
  },
]
