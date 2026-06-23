import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import type { Lead } from '@/types/domain'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PhoneCall, Trash2, Edit2, X, Check } from 'lucide-react'
import { useCallLeadMutation, useUpdateLeadMutation, useDeleteLeadMutation } from '@/hooks/use-data'

export function LeadDrawer({
  lead,
  open,
  onOpenChange,
}: {
  lead: Lead | null
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const callMutation = useCallLeadMutation()
  const updateMutation = useUpdateLeadMutation()
  const deleteMutation = useDeleteLeadMutation()

  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState('')
  const [editPhone, setEditPhone] = useState('')

  // Reset state when lead changes
  useEffect(() => {
    if (lead) {
      setEditName(lead.name)
      setEditPhone(lead.phone)
      setIsEditing(false)
    }
  }, [lead])

  const handleSave = () => {
    if (!lead) return
    updateMutation.mutate({
      id: lead.id,
      input: {
        name: editName,
        phone: editPhone,
        companyId: lead.companyId
      }
    }, {
      onSuccess: () => setIsEditing(false)
    })
  }

  const handleDelete = () => {
    if (!lead) return
    if (confirm('Are you sure you want to delete this lead? This cannot be undone.')) {
      deleteMutation.mutate(lead.id, {
        onSuccess: () => onOpenChange(false)
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-2xl'>
        <DialogHeader>
          <div className='flex items-center justify-between pr-6'>
            <div>
              <DialogTitle>
                {isEditing ? (
                  <Input 
                    value={editName} 
                    onChange={(e) => setEditName(e.target.value)} 
                    className="h-8 max-w-[200px]"
                  />
                ) : (
                  lead?.name ?? 'Lead Profile'
                )}
              </DialogTitle>
              <DialogDescription>
                Customer profile, call transcript, AI evaluation, and timeline activity.
              </DialogDescription>
            </div>
            <div className="flex gap-2">
              {lead && !isEditing && (
                <>
                  <Button variant="outline" size="icon" onClick={() => setIsEditing(true)}>
                    <Edit2 className="h-4 w-4 text-slate-500" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={handleDelete} disabled={deleteMutation.isPending}>
                    <Trash2 className="h-4 w-4 text-rose-500" />
                  </Button>
                </>
              )}
              {isEditing && (
                <>
                  <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
                    <X className="mr-2 h-4 w-4" /> Cancel
                  </Button>
                  <Button size="sm" onClick={handleSave} disabled={updateMutation.isPending || !editName || !editPhone}>
                    <Check className="mr-2 h-4 w-4" /> Save
                  </Button>
                </>
              )}
              {lead && !isEditing && (
                <Button 
                  onClick={() => callMutation.mutate(lead.id)}
                  disabled={callMutation.isPending}
                >
                  <PhoneCall className='mr-2 h-4 w-4' />
                  {callMutation.isPending ? 'Calling...' : 'Call Lead'}
                </Button>
              )}
            </div>
          </div>
        </DialogHeader>
        {lead ? (
          <div className='grid gap-4 md:grid-cols-2'>
            <section className='rounded-xl border border-slate-200 p-3 dark:border-slate-700'>
              <h4 className='text-sm font-semibold'>Customer profile</h4>
              <div className='mt-2 space-y-2'>
                {isEditing ? (
                  <div>
                    <label className="text-xs text-slate-500">Phone</label>
                    <Input 
                      value={editPhone} 
                      onChange={(e) => setEditPhone(e.target.value)} 
                      className="h-8"
                    />
                  </div>
                ) : (
                  <p className='text-sm text-slate-600 dark:text-slate-300'>Phone: {lead.phone}</p>
                )}
                <p className='text-sm text-slate-600 dark:text-slate-300'>Campaign: {lead.campaign}</p>
              </div>
            </section>
            <section className='rounded-xl border border-slate-200 p-3 dark:border-slate-700'>
              <h4 className='text-sm font-semibold'>AI evaluation</h4>
              <p className='mt-2 text-sm text-slate-600 dark:text-slate-300'>Lead score: {lead.score}/100</p>
              <p className='text-sm text-slate-600 dark:text-slate-300'>Current status: {lead.status}</p>
            </section>
            <section className='rounded-xl border border-slate-200 p-3 dark:border-slate-700 md:col-span-2'>
              <h4 className='text-sm font-semibold'>Call history and transcript</h4>
              <div className='mt-2 space-y-2 text-sm'>
                <p className='rounded-lg bg-slate-100 p-2 dark:bg-slate-800'>
                  Customer: "I want details on pricing and integration timelines."
                </p>
                <p className='rounded-lg bg-brand/10 p-2 text-brand'>
                  AI: "I can share enterprise tiers and schedule a specialist demo today."
                </p>
              </div>
            </section>
            <section className='rounded-xl border border-slate-200 p-3 dark:border-slate-700 md:col-span-2'>
              <h4 className='text-sm font-semibold'>Campaign history timeline</h4>
              <ul className='mt-2 space-y-2 text-sm text-slate-600 dark:text-slate-300'>
                <li>Created in Q3 Outbound campaign</li>
                <li>First call attempted</li>
                <li>AI suggested human follow-up</li>
              </ul>
            </section>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}
