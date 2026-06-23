import { Bell, CircleDot, Command, Menu, Search, Settings, UserCircle2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { useCompaniesQuery } from '@/hooks/use-data'
import { useUIStore } from '@/stores/ui-store'

export function TopNav() {
  const setCommandOpen = useUIStore((s) => s.setCommandOpen)
  const setMobileSidebarOpen = useUIStore((s) => s.setMobileSidebarOpen)
  const selectedCompanyId = useUIStore((s) => s.selectedCompanyId)
  const setSelectedCompanyId = useUIStore((s) => s.setSelectedCompanyId)
  const { data: companies } = useCompaniesQuery()
  const navigate = useNavigate()

  return (
    <header className='sticky top-0 z-30 mx-4 mt-4 rounded-2xl border border-white/60 bg-white/80 px-4 py-3 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/80'>
      <div className='flex flex-wrap items-center gap-3'>
        <Button variant='outline' size='icon' className='lg:hidden' onClick={() => setMobileSidebarOpen(true)}>
          <Menu className='h-4 w-4' />
        </Button>

        <div className='relative min-w-[220px] flex-1'>
          <Search className='pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400' />
          <Input
            aria-label='Global search'
            placeholder='Search leads, calls, insights...'
            className='pl-9'
          />
        </div>

        <select
          aria-label='Company selector'
          value={selectedCompanyId}
          onChange={(event) => setSelectedCompanyId(event.target.value)}
          className='h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-900'
        >
          {companies?.map((company) => (
            <option key={company.id} value={company.id}>
              {company.name}
            </option>
          ))}
        </select>

        <button
          type='button'
          className='inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900'
        >
          <CircleDot className='h-4 w-4 text-emerald-500' />
          Campaign Active
        </button>

        <button
          type='button'
          className='relative rounded-xl border border-slate-200 bg-white p-2 dark:border-slate-700 dark:bg-slate-900'
          aria-label='Notifications'
        >
          <Bell className='h-4 w-4' />
          <span className='absolute right-1 top-1 h-2 w-2 rounded-full bg-rose-500' />
        </button>

        <button
          type='button'
          className='inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900'
          onClick={() => setCommandOpen(true)}
        >
          <Command className='h-4 w-4' />
          Command
          <span className='rounded bg-slate-100 px-1.5 text-xs text-slate-500 dark:bg-slate-800'>
            Ctrl+K
          </span>
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button type='button' className='ml-auto flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-2 py-1.5 dark:border-slate-700 dark:bg-slate-900'>
              <Avatar className='h-8 w-8'>
                <AvatarImage alt='User avatar' src='https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=128&h=128&fit=crop' />
                <AvatarFallback>HP</AvatarFallback>
              </Avatar>
              <span className='hidden text-sm font-medium md:inline'>Harsh Patel</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuItem onSelect={() => navigate('/settings')}>
              <Settings className='mr-2 h-4 w-4' /> Settings
            </DropdownMenuItem>
            <DropdownMenuItem>
              <UserCircle2 className='mr-2 h-4 w-4' /> Profile
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
