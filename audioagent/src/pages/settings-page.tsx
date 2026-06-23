import { CheckCircle2, ShieldAlert } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { env, hasVapiConfig } from '@/lib/env'
import { vapiClient } from '@/lib/vapi'

export function SettingsPage() {
  return (
    <div className='space-y-4'>
      <h1 className='text-2xl font-semibold'>Settings</h1>
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            {hasVapiConfig ? <CheckCircle2 className='h-4 w-4 text-emerald-500' /> : <ShieldAlert className='h-4 w-4 text-amber-500' />}
            Vapi Connection
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-2 text-sm text-slate-600 dark:text-slate-300'>
          <p>{vapiClient.connectionLabel()}</p>
          <p>
            API base: {env.vapiBaseUrl ?? 'unset'}
          </p>
          <p>
            Important: secrets should live behind a backend proxy. Use a public token or server-side
            relay for production audio calls.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Configuration Workspace</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue='voice'>
            <TabsList className='mb-4 flex flex-wrap'>
              <TabsTrigger value='voice'>Voice</TabsTrigger>
              <TabsTrigger value='llm'>OpenAI</TabsTrigger>
              <TabsTrigger value='vapi'>Vapi</TabsTrigger>
              <TabsTrigger value='webhook'>Webhook</TabsTrigger>
              <TabsTrigger value='prompt'>Prompt Builder</TabsTrigger>
              <TabsTrigger value='theme'>Theme</TabsTrigger>
            </TabsList>

            <TabsContent value='voice' className='grid gap-3 md:grid-cols-2'>
              <Input placeholder='Default voice name' />
              <Select defaultValue='alloy'>
                <SelectTrigger>
                  <SelectValue placeholder='Voice model' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='alloy'>Alloy</SelectItem>
                  <SelectItem value='verse'>Verse</SelectItem>
                  <SelectItem value='nova'>Nova</SelectItem>
                </SelectContent>
              </Select>
            </TabsContent>

            <TabsContent value='llm' className='space-y-3'>
              <Input placeholder='OpenAI API base URL or proxy endpoint' />
              <Textarea placeholder='System prompt and model behavior notes' />
            </TabsContent>

            <TabsContent value='vapi' className='space-y-3'>
              <Input placeholder={env.vapiBaseUrl ?? 'https://api.vapi.ai'} />
              <Input placeholder={hasVapiConfig ? vapiClient.connectionLabel() : 'Vapi token / proxy token'} />
            </TabsContent>

            <TabsContent value='webhook' className='space-y-3'>
              <Input placeholder='Webhook URL' />
              <Input placeholder='Signing secret' />
            </TabsContent>

            <TabsContent value='prompt' className='space-y-3'>
              <Textarea placeholder='Company-specific qualification prompt' />
              <Separator />
              <div className='flex items-center justify-between rounded-xl border border-slate-200 px-3 py-2 dark:border-slate-700'>
                <div>
                  <p className='font-medium'>Adaptive prompt tuning</p>
                  <p className='text-sm text-slate-500'>Auto-optimize prompt blocks based on outcomes.</p>
                </div>
                <Switch defaultChecked />
              </div>
            </TabsContent>

            <TabsContent value='theme' className='space-y-3'>
              <div className='flex items-center justify-between rounded-xl border border-slate-200 px-3 py-2 dark:border-slate-700'>
                <div>
                  <p className='font-medium'>Dark mode</p>
                  <p className='text-sm text-slate-500'>Use system-friendly dark surfaces.</p>
                </div>
                <Switch defaultChecked={document.documentElement.classList.contains('dark')} />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
