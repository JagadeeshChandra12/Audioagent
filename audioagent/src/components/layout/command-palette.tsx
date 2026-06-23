import { Command } from 'cmdk'
import { useNavigate } from 'react-router-dom'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useUIStore } from '@/stores/ui-store'

const navItems = [
  { label: 'Dashboard', to: '/' },
  { label: 'Companies', to: '/companies' },
  { label: 'Leads', to: '/leads' },
  { label: 'Campaign Center', to: '/campaigns' },
  { label: 'Live Call Monitor', to: '/live-monitor' },
  { label: 'Call Logs', to: '/calls' },
  { label: 'LangGraph Visualization', to: '/langgraph' },
  { label: 'AI Insights', to: '/insights' },
  { label: 'Settings', to: '/settings' },
]

export function CommandPalette() {
  const open = useUIStore((s) => s.commandOpen)
  const setOpen = useUIStore((s) => s.setCommandOpen)
  const navigate = useNavigate()

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className='p-0'>
        <DialogHeader className='p-4 pb-0'>
          <DialogTitle>Command Palette</DialogTitle>
        </DialogHeader>
        <Command className='p-4'>
          <Command.Input
            className='mb-3 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none dark:border-slate-700 dark:bg-slate-900'
            placeholder='Type a page or action...'
          />
          <Command.List className='max-h-[340px] overflow-auto'>
            <Command.Empty className='py-8 text-center text-sm text-slate-500'>
              No result found.
            </Command.Empty>
            <Command.Group heading='Navigate'>
              {navItems.map((item) => (
                <Command.Item
                  key={item.to}
                  className='cursor-pointer rounded-lg px-3 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-800'
                  onSelect={() => {
                    navigate(item.to)
                    setOpen(false)
                  }}
                >
                  {item.label}
                </Command.Item>
              ))}
            </Command.Group>
          </Command.List>
        </Command>
      </DialogContent>
    </Dialog>
  )
}
