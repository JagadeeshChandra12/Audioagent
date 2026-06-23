import * as React from 'react'

import { cn } from '@/lib/utils'

const Table = ({ className, ...props }: React.HTMLAttributes<HTMLTableElement>) => (
  <div className='w-full overflow-auto'>
    <table className={cn('w-full caption-bottom text-sm', className)} {...props} />
  </div>
)

const TableHeader = ({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) => (
  <thead className={cn('border-b border-slate-200 dark:border-slate-800', className)} {...props} />
)

const TableBody = ({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) => (
  <tbody className={cn('[&>tr:last-child]:border-0', className)} {...props} />
)

const TableRow = ({ className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) => (
  <tr
    className={cn(
      'border-b border-slate-200 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900',
      className,
    )}
    {...props}
  />
)

const TableHead = ({ className, ...props }: React.ThHTMLAttributes<HTMLTableCellElement>) => (
  <th className={cn('px-3 py-3 text-left text-xs font-semibold text-slate-500', className)} {...props} />
)

const TableCell = ({ className, ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) => (
  <td className={cn('px-3 py-3', className)} {...props} />
)

export { Table, TableBody, TableCell, TableHead, TableHeader, TableRow }
