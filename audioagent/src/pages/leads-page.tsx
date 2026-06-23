import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { LeadDrawer } from '@/components/leads/lead-drawer'
import { LeadsTable } from '@/components/leads/leads-table'
import { QueryError, QueryLoading } from '@/components/shared/query-state'
import { useLeadsQuery, useAddLeadMutation, useCompaniesQuery } from '@/hooks/use-data'
import { useUIStore } from '@/stores/ui-store'
import type { Lead } from '@/types/domain'

export function LeadsPage() {
  const { data, isLoading, isError, refetch } = useLeadsQuery()
  const { data: companiesData } = useCompaniesQuery()
  const mutation = useAddLeadMutation()
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [companyId, setCompanyId] = useState('')
  const [open, setOpen] = useState(false)

  const selectedCompanyId = useUIStore((s) => s.selectedCompanyId)

  if (isLoading) return <QueryLoading rows={6} />
  if (isError || !data) return <QueryError onRetry={() => void refetch()} />

  // Map companyId to companyName for the table
  const leadsWithCompany = data.map(lead => {
    const company = companiesData?.find(c => c.id === lead.companyId)
    return {
      ...lead,
      companyName: company?.name || 'Unknown Company'
    }
  })

  // Filter leads by global dropdown
  const filteredLeads = leadsWithCompany.filter(lead => lead.companyId === selectedCompanyId)

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-semibold'>Lead Management</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className='mr-2 h-4 w-4' /> Add lead
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Lead</DialogTitle>
              <DialogDescription>
                Enter lead details and assign to a company.
              </DialogDescription>
            </DialogHeader>
            <div className='space-y-3'>
              <Input placeholder='Lead Name' value={name} onChange={(e) => setName(e.target.value)} />
              <Input placeholder='Phone Number' value={phone} onChange={(e) => setPhone(e.target.value)} />
              
              <Select value={companyId} onValueChange={setCompanyId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Company" />
                </SelectTrigger>
                <SelectContent>
                  {companiesData?.map(c => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                className='w-full'
                onClick={() => {
                  mutation.mutate({ name, phone, companyId }, {
                    onSuccess: () => {
                      setOpen(false)
                      setName('')
                      setPhone('')
                      setCompanyId('')
                    }
                  })
                }}
                disabled={!name || !phone || !companyId || mutation.isPending}
              >
                {mutation.isPending ? 'Saving...' : 'Save lead'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <LeadsTable leads={filteredLeads} onOpenLead={setSelectedLead} />
      <LeadDrawer
        lead={selectedLead}
        open={!!selectedLead}
        onOpenChange={(open) => {
          if (!open) setSelectedLead(null)
        }}
      />
    </div>
  )
}
