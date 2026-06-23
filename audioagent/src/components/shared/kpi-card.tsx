import { motion } from 'framer-motion'
import { TrendingDown, TrendingUp } from 'lucide-react'

import { Card } from '@/components/ui/card'
import { cn, formatNumber } from '@/lib/utils'

type KPIProps = {
  label: string
  value: number
  suffix?: string
  delta: number
}

export function KpiCard({ label, value, suffix, delta }: KPIProps) {
  const isUp = delta >= 0

  return (
    <motion.div layout initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
      <Card className='relative overflow-hidden'>
        <div className='absolute right-0 top-0 h-24 w-24 rounded-full bg-brand/10 blur-2xl' />
        <p className='text-sm text-slate-500 dark:text-slate-300'>{label}</p>
        <div className='mt-3 flex items-end justify-between gap-2'>
          <p className='text-2xl font-semibold text-slate-900 dark:text-slate-50'>
            {formatNumber(value)}
            {suffix}
          </p>
          <span
            className={cn(
              'inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold',
              isUp
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                : 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300',
            )}
          >
            {isUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            {Math.abs(delta).toFixed(1)}%
          </span>
        </div>
      </Card>
    </motion.div>
  )
}
