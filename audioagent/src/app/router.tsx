import { Suspense, lazy, type ReactNode } from 'react'
import { createBrowserRouter } from 'react-router-dom'

import { AppShell } from '@/components/layout/app-shell'
import { QueryLoading } from '@/components/shared/query-state'

const DashboardPage = lazy(() =>
  import('@/pages/dashboard-page').then((m) => ({ default: m.DashboardPage })),
)
const CompaniesPage = lazy(() =>
  import('@/pages/companies-page').then((m) => ({ default: m.CompaniesPage })),
)
const LeadsPage = lazy(() =>
  import('@/pages/leads-page').then((m) => ({ default: m.LeadsPage })),
)
const CampaignsPage = lazy(() =>
  import('@/pages/campaigns-page').then((m) => ({ default: m.CampaignsPage })),
)
const AnalyticsPage = lazy(() =>
  import('@/pages/analytics-page').then((m) => ({ default: m.AnalyticsPage })),
)
const LiveMonitorPage = lazy(() =>
  import('@/pages/live-monitor-page').then((m) => ({ default: m.LiveMonitorPage })),
)
const CallsPage = lazy(() =>
  import('@/pages/calls-page').then((m) => ({ default: m.CallsPage })),
)
const LanggraphPage = lazy(() =>
  import('@/pages/langgraph-page').then((m) => ({ default: m.LanggraphPage })),
)
const InsightsPage = lazy(() =>
  import('@/pages/insights-page').then((m) => ({ default: m.InsightsPage })),
)
const SettingsPage = lazy(() =>
  import('@/pages/settings-page').then((m) => ({ default: m.SettingsPage })),
)

function LazyWrap({ children }: { children: ReactNode }) {
  return <Suspense fallback={<QueryLoading rows={4} />}>{children}</Suspense>
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <LazyWrap><DashboardPage /></LazyWrap> },
      { path: 'companies', element: <LazyWrap><CompaniesPage /></LazyWrap> },
      { path: 'leads', element: <LazyWrap><LeadsPage /></LazyWrap> },
      { path: 'campaigns', element: <LazyWrap><CampaignsPage /></LazyWrap> },
      { path: 'analytics', element: <LazyWrap><AnalyticsPage /></LazyWrap> },
      { path: 'live-monitor', element: <LazyWrap><LiveMonitorPage /></LazyWrap> },
      { path: 'calls', element: <LazyWrap><CallsPage /></LazyWrap> },
      { path: 'langgraph', element: <LazyWrap><LanggraphPage /></LazyWrap> },
      { path: 'insights', element: <LazyWrap><InsightsPage /></LazyWrap> },
      { path: 'settings', element: <LazyWrap><SettingsPage /></LazyWrap> },
    ],
  },
])
