import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from '@tanstack/react-table'
import { useVirtualizer } from '@tanstack/react-virtual'
import { ArrowUpDown } from 'lucide-react'
import { useMemo, useRef, useState } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import type { Lead, LeadStatus } from '@/types/domain'

const statusMap: Record<LeadStatus, 'neutral' | 'blue' | 'green' | 'red' | 'orange' | 'yellow'> = {
  PENDING: 'neutral',
  CALL_INITIATED: 'blue',
  QUALIFIED: 'green',
  NOT_INTERESTED: 'red',
  FAILED: 'orange',
  NEEDS_REVIEW: 'yellow',
}

export function LeadsTable({
  leads,
  onOpenLead,
}: {
  leads: Lead[]
  onOpenLead: (lead: Lead) => void
}) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Record<string, boolean>>({})

  const filtered = useMemo(
    () =>
      leads.filter((lead) =>
        `${lead.name} ${lead.phone} ${lead.campaign}`
          .toLowerCase()
          .includes(search.toLowerCase()),
      ),
    [leads, search],
  )

  const columns = useMemo<ColumnDef<Lead>[]>(
    () => [
      {
        id: 'select',
        header: () => <span className='text-xs text-slate-400'>SEL</span>,
        cell: ({ row }) => (
          <input
            type='checkbox'
            checked={!!selected[row.original.id]}
            onChange={(event) =>
              setSelected((current) => ({
                ...current,
                [row.original.id]: event.target.checked,
              }))
            }
            aria-label={`Select ${row.original.name}`}
          />
        ),
      },
      { accessorKey: 'name', header: 'Name' },
      { accessorKey: 'phone', header: 'Phone' },
      { accessorKey: 'companyName', header: 'Company' },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => (
          <Badge variant={statusMap[row.original.status]}>{row.original.status}</Badge>
        ),
      },
      { accessorKey: 'lastCall', header: 'Last Call' },
      { accessorKey: 'campaign', header: 'Assigned Campaign' },
      {
        accessorKey: 'score',
        header: ({ column }) => (
          <button
            type='button'
            className='inline-flex items-center gap-1'
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Score <ArrowUpDown size={14} />
          </button>
        ),
      },
    ],
    [selected],
  )

  const table = useReactTable({
    data: filtered,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  const rows = table.getRowModel().rows
  const parentRef = useRef<HTMLDivElement>(null)
  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 48,
    overscan: 8,
  })

  const selectedCount = Object.values(selected).filter(Boolean).length

  return (
    <div className='space-y-3'>
      <div className='flex flex-wrap items-center gap-2'>
        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder='Search leads...'
          className='max-w-xs'
        />
        <Button variant='secondary'>Filters</Button>
        <Button variant='outline'>Sort</Button>
        <Button variant='outline'>Bulk Actions ({selectedCount})</Button>
      </div>

      <div className='rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950'>
        <table className='w-full text-left text-sm'>
          <thead className='border-b border-slate-200 dark:border-slate-800'>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className='px-3 py-3 text-xs font-semibold text-slate-500'>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
        </table>

        <div ref={parentRef} className='h-[420px] overflow-auto'>
          <div
            className='relative w-full'
            style={{ height: `${rowVirtualizer.getTotalSize()}px` }}
          >
            {rowVirtualizer.getVirtualItems().map((virtualRow) => {
              const row = rows[virtualRow.index]
              if (!row) return null

              return (
                <button
                  type='button'
                  key={row.id}
                  onClick={() => onOpenLead(row.original)}
                  className={cn(
                    'absolute left-0 top-0 grid w-full grid-cols-7 items-center border-b border-slate-100 px-3 text-left text-sm transition hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900',
                  )}
                  style={{
                    height: `${virtualRow.size}px`,
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <span key={cell.id} className='truncate pr-2'>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </span>
                  ))}
                </button>
              )
            })}
          </div>
        </div>

        <div className='flex items-center justify-between border-t border-slate-200 px-3 py-3 text-sm dark:border-slate-800'>
          <p>
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </p>
          <div className='flex gap-2'>
            <Button
              size='sm'
              variant='outline'
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              size='sm'
              variant='outline'
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
