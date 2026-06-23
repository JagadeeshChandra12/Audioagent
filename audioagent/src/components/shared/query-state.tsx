import type { ReactNode } from 'react'

import { AlertTriangle, RefreshCw } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

export function QueryLoading({ rows = 3 }: { rows?: number }) {
  return (
    <div className='space-y-3'>
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className='h-24 w-full rounded-2xl' />
      ))}
    </div>
  )
}

export function QueryError({
  onRetry,
  message = 'Something went wrong loading this section.',
}: {
  onRetry: () => void
  message?: string
}) {
  return (
    <div className='flex min-h-40 flex-col items-center justify-center rounded-2xl border border-dashed border-rose-300 bg-rose-50/60 p-6 text-center dark:border-rose-700/50 dark:bg-rose-950/30'>
      <AlertTriangle className='mb-2 text-rose-600' />
      <p className='mb-4 text-sm text-rose-700 dark:text-rose-300'>{message}</p>
      <Button variant='outline' onClick={onRetry}>
        <RefreshCw className='mr-2 h-4 w-4' /> Retry
      </Button>
    </div>
  )
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string
  description: string
  action?: ReactNode
}) {
  return (
    <div className='flex min-h-48 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50/70 p-6 text-center dark:border-slate-700 dark:bg-slate-900'>
      <p className='text-base font-semibold text-slate-900 dark:text-slate-100'>{title}</p>
      <p className='mt-1 text-sm text-slate-500 dark:text-slate-300'>{description}</p>
      {action ? <div className='mt-4'>{action}</div> : null}
    </div>
  )
}
