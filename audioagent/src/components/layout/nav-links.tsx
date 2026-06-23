import {
  Activity,
  BarChart3,
  Building2,
  LayoutDashboard,
  Megaphone,
  Phone,
  Settings,
  Users,
} from 'lucide-react'
import { NavLink } from 'react-router-dom'

import { cn } from '@/lib/utils'

export const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/companies', label: 'Companies', icon: Building2 },
  { to: '/leads', label: 'Leads', icon: Users },
  { to: '/campaigns', label: 'Campaigns', icon: Megaphone },
  { to: '/calls', label: 'Calls', icon: Phone },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/settings', label: 'Settings', icon: Settings },
]

export function BrandMark() {
  return (
    <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-brand text-white shadow-soft'>
      <Activity size={18} />
    </div>
  )
}

export function NavLinks({ compact = false }: { compact?: boolean }) {
  return (
    <nav className='space-y-1'>
      {navItems.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            cn(
              'group flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition',
              isActive
                ? 'bg-brand/10 text-brand'
                : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800',
              compact ? 'justify-start' : '',
            )
          }
        >
          <Icon size={18} />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
