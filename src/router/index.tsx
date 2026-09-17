import { createBrowserRouter } from 'react-router-dom'
import { ROUTES } from '../constants/routes'
import { PrivateRoute } from './PrivateRoute'
import { LoginPage } from '../pages/auth/LoginPage'
import { RegisterPage } from '../pages/auth/RegisterPage'
import { DashboardPage } from '../pages/dashboard/DashboardPage'
import { AnalyticsPage } from '../pages/dashboard/AnalyticsPage'
import { CompaniesPage } from '../pages/companies/CompaniesPage'
import { CompanyDetailPage } from '../pages/companies/CompanyDetailPage'
import { UsersPage } from '../pages/users/UsersPage'
import { PlansPage } from '../pages/plans/PlansPage'
import { BillingPage } from '../pages/billing/BillingPage'
import { SupportPage } from '../pages/support/SupportPage'
import { CmsPage } from '../pages/cms/CmsPage'
import { AdminsPage } from '../pages/admins/AdminsPage'
import { ProfilePage } from '../pages/profile/ProfilePage'
import { NotificationsPage } from '../pages/notifications/NotificationsPage'
import { NotFoundPage } from '../pages/NotFoundPage'

export const router = createBrowserRouter([
  { path: ROUTES.login, element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },
  {
    element: <PrivateRoute />,
    children: [
      { path: ROUTES.overview, element: <DashboardPage /> },
      { path: '/analytics', element: <AnalyticsPage /> },
      { path: ROUTES.companies, element: <CompaniesPage /> },
      { path: '/companies/:companyId', element: <CompanyDetailPage /> },
      { path: ROUTES.users, element: <UsersPage /> },
      { path: ROUTES.plans, element: <PlansPage /> },
      { path: ROUTES.billing, element: <BillingPage /> },
      { path: ROUTES.support, element: <SupportPage /> },
      { path: ROUTES.cms, element: <CmsPage /> },
      { path: ROUTES.admins, element: <AdminsPage /> },
      { path: ROUTES.profile, element: <ProfilePage /> },
      { path: ROUTES.notifications, element: <NotificationsPage /> },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
])
