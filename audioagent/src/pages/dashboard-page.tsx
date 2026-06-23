import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

import { KpiCard } from '@/components/shared/kpi-card'
import { QueryError, QueryLoading } from '@/components/shared/query-state'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useDashboardQuery } from '@/hooks/use-data'
import { formatPercent } from '@/lib/utils'

function CountUp({ value }: { value: number }) {
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    let frame = 0
    const total = 30
    const id = setInterval(() => {
      frame += 1
      setDisplay(Math.round((value * frame) / total))
      if (frame >= total) clearInterval(id)
    }, 18)
    return () => clearInterval(id)
  }, [value])

  return <>{display.toLocaleString()}</>
}

export function DashboardPage() {
  const { data, isLoading, isError, refetch } = useDashboardQuery()

  if (isLoading) return <QueryLoading rows={4} />
  if (isError || !data) return <QueryError onRetry={() => void refetch()} />

  const metrics = [
    { label: 'Total Leads', value: data.totalLeads, delta: 8.2 },
    { label: 'Qualified Leads', value: data.qualifiedLeads, delta: 4.9 },
    { label: 'Active Calls', value: data.activeCalls, delta: 2.1 },
    { label: 'Campaign Success Rate', value: data.campaignSuccessRate, suffix: '%', delta: 1.8 },
    { label: 'Revenue Potential', value: data.revenuePotential, delta: 11.4 },
  ]

  return (
    <div className='space-y-4'>
      <div>
        <h1 className='text-2xl font-semibold'>Executive Dashboard</h1>
        <p className='text-sm text-slate-500'>Real-time campaign health across your tenants.</p>
      </div>

      <section className='grid gap-4 md:grid-cols-2 xl:grid-cols-5'>
        {metrics.map((metric) => (
          <KpiCard key={metric.label} {...metric} />
        ))}
      </section>

      <motion.section layout className='grid gap-4 lg:grid-cols-3'>
        <Card className='lg:col-span-2'>
          <CardHeader>
            <CardTitle>Current Campaign Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid gap-3 sm:grid-cols-3'>
              <div className='rounded-xl bg-slate-100 p-3 dark:bg-slate-800'>
                <p className='text-sm text-slate-500'>Active Calls</p>
                <p className='text-2xl font-semibold'><CountUp value={data.activeCalls} /></p>
              </div>
              <div className='rounded-xl bg-slate-100 p-3 dark:bg-slate-800'>
                <p className='text-sm text-slate-500'>Qualification Rate</p>
                <p className='text-2xl font-semibold'>{formatPercent(data.campaignSuccessRate)}</p>
              </div>
              <div className='rounded-xl bg-slate-100 p-3 dark:bg-slate-800'>
                <p className='text-sm text-slate-500'>Estimated Revenue</p>
                <p className='text-2xl font-semibold'>$<CountUp value={data.revenuePotential} /></p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>AI Focus</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className='space-y-3 text-sm text-slate-600 dark:text-slate-300'>
              <li>Prioritize high-score leads in healthcare.</li>
              <li>Reduce not-interested outcomes by prompt tuning.</li>
              <li>Increase callback automation for hesitant prospects.</li>
            </ul>
          </CardContent>
        </Card>
      </motion.section>
    </div>
  )
}
