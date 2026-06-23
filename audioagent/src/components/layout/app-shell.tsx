import { AnimatePresence, motion } from 'framer-motion'
import { Outlet, useLocation } from 'react-router-dom'

import { CommandPalette } from '@/components/layout/command-palette'
import { MobileSidebar } from '@/components/layout/mobile-sidebar'
import { Sidebar } from '@/components/layout/sidebar'
import { TopNav } from '@/components/layout/top-nav'

export function AppShell() {
  const location = useLocation()

  return (
    <div className='min-h-dvh bg-grid-gradient text-slate-900 dark:text-slate-100'>
      <div className='flex'>
        <MobileSidebar />
        <Sidebar />
        <main className='min-w-0 flex-1'>
          <TopNav />
          <div className='p-4'>
            <AnimatePresence mode='wait'>
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.24 }}
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
      <CommandPalette />
    </div>
  )
}
