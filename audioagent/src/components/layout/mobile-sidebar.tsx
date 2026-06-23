import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { NavLinks, BrandMark } from '@/components/layout/nav-links'
import { useUIStore } from '@/stores/ui-store'

export function MobileSidebar() {
  const open = useUIStore((s) => s.mobileSidebarOpen)
  const setOpen = useUIStore((s) => s.setMobileSidebarOpen)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side='left' className='w-[320px] max-w-[85vw]'>
        <SheetHeader className='mb-4 flex items-center gap-3'>
          <BrandMark />
          <SheetTitle>VoiceOS</SheetTitle>
        </SheetHeader>
        <NavLinks />
      </SheetContent>
    </Sheet>
  )
}
