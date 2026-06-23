import { QueryClientProvider } from '@tanstack/react-query'
import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { Toaster } from 'sonner'

import App from '@/App'
import { queryClient } from '@/lib/query-client'
import { useUIStore } from '@/stores/ui-store'
import './index.css'

function KeyboardShortcuts() {
  const setCommandOpen = useUIStore((s) => s.setCommandOpen)

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setCommandOpen(true)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [setCommandOpen])

  return null
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <KeyboardShortcuts />
      <App />
      <Toaster richColors closeButton />
    </QueryClientProvider>
  </StrictMode>,
)
