import { PlayCircle, Plus, UploadCloud } from 'lucide-react'
import { useState, useRef } from 'react'

import { QueryError, QueryLoading } from '@/components/shared/query-state'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useUIStore } from '@/stores/ui-store'
import { useCampaignsQuery, useLaunchCampaignMutation, useCompaniesQuery, useCreateBulkCampaignMutation } from '@/hooks/use-data'

export function CampaignsPage() {
  const { data, isLoading, isError, refetch } = useCampaignsQuery()
  const { data: companiesData } = useCompaniesQuery()
  const launchMutation = useLaunchCampaignMutation()
  const createBulkMutation = useCreateBulkCampaignMutation()
  const [launching, setLaunching] = useState<string | null>(null)
  
  const selectedCompanyId = useUIStore((s) => s.selectedCompanyId)

  const [openCreate, setOpenCreate] = useState(false)
  const [newName, setNewName] = useState('')
  const [newCompanyId, setNewCompanyId] = useState('')
  const [parsedLeads, setParsedLeads] = useState<{name: string, phone: string}[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const text = await file.text()
    const rows = text.split('\n').filter(r => r.trim() !== '')
    // Assuming CSV has no header or header is name,phone
    // Let's just grab all valid rows with comma
    const leads = rows.map(r => {
      const parts = r.split(',')
      return { name: parts[0]?.trim() || '', phone: parts[1]?.trim() || '' }
    }).filter(l => l.name && l.phone && l.name.toLowerCase() !== 'name')
    setParsedLeads(leads)
  }

  const handleCreate = () => {
    createBulkMutation.mutate({ name: newName, companyId: newCompanyId, leads: parsedLeads }, {
      onSuccess: () => {
        setOpenCreate(false)
        setNewName('')
        setNewCompanyId('')
        setParsedLeads([])
        if (fileInputRef.current) fileInputRef.current.value = ''
      }
    })
  }

  if (isLoading) return <QueryLoading rows={4} />
  if (isError || !data) return <QueryError onRetry={() => void refetch()} />

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-semibold'>Campaign Center</h1>
        <Dialog open={openCreate} onOpenChange={setOpenCreate}>
          <DialogTrigger asChild>
            <Button>
              <Plus className='mr-2 h-4 w-4' /> Create Campaign
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Bulk Campaign</DialogTitle>
              <DialogDescription>
                Upload a CSV file (Name, Phone) to automatically generate a campaign and its leads.
              </DialogDescription>
            </DialogHeader>
            <div className='space-y-4'>
              <div className='space-y-2'>
                <label className='text-sm font-medium'>Campaign Name</label>
                <Input placeholder='e.g. Q3 Healthcare Outreach' value={newName} onChange={e => setNewName(e.target.value)} />
              </div>
              <div className='space-y-2'>
                <label className='text-sm font-medium'>Assign to Company</label>
                <Select value={newCompanyId} onValueChange={setNewCompanyId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Company" />
                  </SelectTrigger>
                  <SelectContent>
                    {companiesData?.map(c => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className='space-y-2'>
                <label className='text-sm font-medium'>Upload Leads CSV</label>
                <div className='flex items-center gap-4'>
                  <Button variant='outline' onClick={() => fileInputRef.current?.click()} className='w-full'>
                    <UploadCloud className='mr-2 h-4 w-4' /> Select CSV File
                  </Button>
                  <input type='file' accept='.csv' className='hidden' ref={fileInputRef} onChange={handleFileUpload} />
                </div>
                {parsedLeads.length > 0 && (
                  <p className='text-sm text-green-600 font-medium text-center'>
                    Successfully parsed {parsedLeads.length} leads ready for import!
                  </p>
                )}
              </div>
              <Button 
                className='w-full' 
                disabled={!newName || !newCompanyId || parsedLeads.length === 0 || createBulkMutation.isPending}
                onClick={handleCreate}
              >
                {createBulkMutation.isPending ? 'Creating Campaign...' : `Create Campaign with ${parsedLeads.length} leads`}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <section className='grid gap-4 md:grid-cols-2 xl:grid-cols-3'>
        {data.filter(c => !c.companyId || c.companyId === selectedCompanyId).map((campaign) => (
          <Card key={campaign.id}>
            <CardHeader>
              <CardTitle>{campaign.name}</CardTitle>
            </CardHeader>
            <CardContent className='space-y-1 text-sm'>
              <p>Total Leads: {campaign.totalLeads}</p>
              <p>Completed: {campaign.completed}</p>
              <p>Active: {campaign.active}</p>
              <p>Success: {campaign.successRate.toFixed(1)}%</p>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className='mt-3 w-full'>
                    <PlayCircle className='mr-2 h-4 w-4' /> Launch Campaign
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Launch {campaign.name}</DialogTitle>
                    <DialogDescription>
                      Leads: {campaign.totalLeads} | Expected duration: {campaign.eta} | Estimated completion: today
                    </DialogDescription>
                  </DialogHeader>
                  <Button
                    className='w-full'
                    disabled={launchMutation.isPending && launching === campaign.id}
                    onClick={() => {
                      setLaunching(campaign.id)
                      launchMutation.mutate(campaign.id, {
                        onSettled: () => setLaunching(null)
                      })
                    }}
                  >
                    {launchMutation.isPending && launching === campaign.id ? 'Launching...' : 'Confirm Launch'}
                  </Button>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  )
}
