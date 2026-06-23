import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold',
  {
    variants: {
      variant: {
        neutral: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200',
        blue: 'bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-300',
        green: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300',
        red: 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300',
        orange: 'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300',
        yellow: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
      },
    },
    defaultVariants: { variant: 'neutral' },
  },
)

function Badge({ className, variant, ...props }: React.HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
