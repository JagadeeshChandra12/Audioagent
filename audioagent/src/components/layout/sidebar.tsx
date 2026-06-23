import { AnimatePresence, motion } from 'framer-motion'
import { LogOut, Sparkles } from 'lucide-react'

import { BrandMark, NavLinks } from '@/components/layout/nav-links'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useUIStore } from '@/stores/ui-store'

export function Sidebar() {
  const sidebarOpen = useUIStore((s) => s.sidebarOpen)
  const toggleSidebar = useUIStore((s) => s.toggleSidebar)
  const toggleTheme = useUIStore((s) => s.toggleTheme)

  return (
    <AnimatePresence mode='wait'>
      <motion.aside
        initial={{ x: -24, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -24, opacity: 0 }}
        className={cn(
          'glass sticky top-4 z-40 m-4 hidden h-[calc(100dvh-2rem)] flex-col rounded-3xl border border-white/50 p-4 lg:flex',
          sidebarOpen ? 'w-72' : 'w-[92px]',
        )}
      >
        <div className='mb-6 flex items-center gap-3'>
          <BrandMark />
          {sidebarOpen ? (
            <div>
              <p className='font-semibold text-slate-900 dark:text-slate-100'>VoiceOS</p>
              <p className='text-xs text-slate-500'>Agentic Revenue Stack</p>
            </div>
          ) : null}
        </div>

        <NavLinks compact={!sidebarOpen} />

        <div className='mt-auto space-y-2 rounded-2xl bg-white/50 p-3 dark:bg-slate-900/60'>
          <button
            type='button'
            className='flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left text-sm text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
            onClick={toggleTheme}
          >
            <Sparkles size={16} />
            {sidebarOpen ? 'Theme switch' : null}
          </button>
          <button
            type='button'
            className='flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left text-sm text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
          >
            <div className='h-7 w-7 rounded-full bg-gradient-to-tr from-amber-300 to-pink-500' />
            {sidebarOpen ? 'Harsh Patel' : null}
          </button>
          <Button variant='ghost' className='w-full justify-start text-rose-600'>
            <LogOut size={16} className='mr-2' /> {sidebarOpen ? 'Logout' : null}
          </Button>
          <Button variant='secondary' className='w-full' size='sm' onClick={toggleSidebar}>
            {sidebarOpen ? 'Collapse' : 'Expand'}
          </Button>
        </div>
      </motion.aside>
    </AnimatePresence>
  )
}
