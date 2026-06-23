import { Building2, Plus, Upload } from 'lucide-react'
import { useState, useRef } from 'react'

import { EmptyState, QueryError, QueryLoading } from '@/components/shared/query-state'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useAddCompanyMutation, useCompaniesQuery, useUploadProtocolMutation } from '@/hooks/use-data'

export function CompaniesPage() {
  const { data, isLoading, isError, refetch } = useCompaniesQuery()
  const mutation = useAddCompanyMutation()
  const uploadMutation = useUploadProtocolMutation()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploadingCompanyId, setUploadingCompanyId] = useState<string | null>(null)

  const [name, setName] = useState('')
  const [industry, setIndustry] = useState('')

  if (isLoading) return <QueryLoading rows={5} />
  if (isError || !data) return <QueryError onRetry={() => void refetch()} />

  return (
    <div className='space-y-4'>
      <div className='flex flex-wrap items-center justify-between gap-2'>
        <h1 className='text-2xl font-semibold'>Companies</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className='mr-2 h-4 w-4' /> Add company
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Company</DialogTitle>
              <DialogDescription>
                Configure company name, industry, qualification prompt, and voice assistant setup.
              </DialogDescription>
            </DialogHeader>
            <div className='space-y-3'>
              <Input placeholder='Name' value={name} onChange={(e) => setName(e.target.value)} />
              <Input placeholder='Industry' value={industry} onChange={(e) => setIndustry(e.target.value)} />
              <Input placeholder='Qualification prompt' />
              <Input placeholder='Voice assistant configuration' />
              <Button
                className='w-full'
                onClick={() => mutation.mutate({ name, industry })}
                disabled={!name || !industry || mutation.isPending}
              >
                {mutation.isPending ? 'Saving...' : 'Save company'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {data.length === 0 ? (
        <EmptyState
          title='No companies yet'
          description='Add your first tenant to begin campaign operations.'
        />
      ) : (
        <section className='grid gap-4 md:grid-cols-2 xl:grid-cols-3'>
          {data.map((company) => (
            <Card key={company.id} className='cursor-pointer transition hover:-translate-y-0.5'>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <Building2 className='h-4 w-4 text-brand' /> {company.name}
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-2 text-sm text-slate-600 dark:text-slate-300'>
                <p>Industry: {company.industry}</p>
                <p>Lead count: {company.leadCount}</p>
                {/* <p>Qualification: {company.qualificationRate.toFixed(1)}%</p> */}
                {/* <p>Active campaigns: {company.activeCampaigns}</p> */}
                
                {company.protocol_metadata && (
                  <div className="mt-2 rounded-md bg-slate-100 p-2 text-xs dark:bg-slate-800">
                    <p className="font-semibold text-brand">Protocol Metadata</p>
                    <p><strong>Summary:</strong> {company.protocol_metadata.summary}</p>
                    <p><strong>Audience:</strong> {company.protocol_metadata.target_audience}</p>
                  </div>
                )}
                
                <div className='pt-2'>
                  <Button 
                    variant='outline' 
                    size='sm' 
                    className='w-full'
                    disabled={uploadMutation.isPending && uploadingCompanyId === company.id}
                    onClick={(e) => {
                      e.stopPropagation()
                      setUploadingCompanyId(company.id)
                      fileInputRef.current?.click()
                    }}
                  >
                    <Upload className='mr-2 h-4 w-4' /> 
                    {uploadMutation.isPending && uploadingCompanyId === company.id ? 'Processing...' : 'Upload Protocol'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>
      )}
      <input 
        type="file" 
        className="hidden" 
        ref={fileInputRef} 
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file && uploadingCompanyId) {
            uploadMutation.mutate({ companyId: uploadingCompanyId, file })
          }
          if (fileInputRef.current) {
            fileInputRef.current.value = ''
          }
        }}
        accept=".pdf,.txt,.docx"
      />
    </div>
  )
}
