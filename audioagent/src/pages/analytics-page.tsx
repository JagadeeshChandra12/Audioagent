import {
  Bar,
  BarChart,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import { QueryError, QueryLoading } from '@/components/shared/query-state'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useUIStore } from '@/stores/ui-store'
import { useAnalyticsQuery } from '@/hooks/use-data'

const colors = ['#0ea5e9', '#22c55e', '#f59e0b', '#f43f5e']

export function AnalyticsPage() {
  const selectedCompanyId = useUIStore((s) => s.selectedCompanyId)
  const { data, isLoading, isError, refetch } = useAnalyticsQuery(selectedCompanyId)

  if (isLoading) return <QueryLoading rows={4} />
  if (isError || !data) return <QueryError onRetry={() => void refetch()} />

  return (
    <div className='space-y-4'>
      <h1 className='text-2xl font-semibold'>Analytics</h1>
      <section className='grid gap-4 lg:grid-cols-2'>
        <Card>
          <CardHeader>
            <CardTitle>Lead Funnel</CardTitle>
          </CardHeader>
          <CardContent className='h-72'>
            <ResponsiveContainer width='100%' height='100%'>
              <BarChart data={data.funnelData}>
                <XAxis dataKey='stage' />
                <YAxis />
                <Tooltip />
                <Bar dataKey='value' radius={[8, 8, 0, 0]} fill='#0f766e' animationDuration={700} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Daily Calls</CardTitle>
          </CardHeader>
          <CardContent className='h-72'>
            <ResponsiveContainer width='100%' height='100%'>
              <LineChart data={data.dailyCalls}>
                <XAxis dataKey='day' />
                <YAxis />
                <Tooltip />
                <Line
                  type='monotone'
                  dataKey='calls'
                  stroke='#0284c7'
                  strokeWidth={3}
                  animationDuration={800}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Call Outcome Distribution</CardTitle>
          </CardHeader>
          <CardContent className='h-72'>
            <ResponsiveContainer width='100%' height='100%'>
              <PieChart>
                <Pie
                  data={data.outcomeData}
                  dataKey='value'
                  nameKey='name'
                  cx='50%'
                  cy='50%'
                  outerRadius={90}
                  animationDuration={900}
                >
                  {data.outcomeData.map((entry: any, i: number) => (
                    <Cell key={entry.name} fill={colors[i % colors.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Campaign Performance / Qualification Rate</CardTitle>
          </CardHeader>
          <CardContent className='space-y-2 text-sm'>
            {data.campaignPerformance.map((campaign: any) => (
              <div key={campaign.id} className='rounded-xl border border-slate-200 p-3 dark:border-slate-700'>
                <div className='flex items-center justify-between'>
                  <p className='font-medium'>{campaign.name}</p>
                  <p>{campaign.successRate.toFixed(1)}%</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
