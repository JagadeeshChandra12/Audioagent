import { motion } from 'framer-motion'
import { Mic, MicOff, PhoneCall, PhoneOff, Volume2 } from 'lucide-react'

import { EmptyState } from '@/components/shared/query-state'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useLiveCalls } from '@/hooks/use-live-calls'
import { useVapiSession } from '@/hooks/use-vapi-session'
import { hasVapiConfig } from '@/lib/env'

export function LiveMonitorPage() {
  const { calls, activeCount } = useLiveCalls()
  const {
    configured,
    error,
    isMuted,
    ready,
    start,
    status,
    stop,
    toggleMute,
    transcript,
    volume,
  } = useVapiSession()

  const downloadTranscript = () => {
    const text = transcript.map(t => `${t.speaker.toUpperCase()}: ${t.text}`).join('\n')
    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `live-transcript-${Date.now()}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className='space-y-4'>
      <h1 className='text-2xl font-semibold'>Live Call Monitor</h1>
      
      <Tabs defaultValue="runtime" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
          <TabsTrigger value="runtime">Voice Agent Runtime</TabsTrigger>
          <TabsTrigger value="active">Active System Calls</TabsTrigger>
        </TabsList>
        
        <TabsContent value="runtime" className="mt-4">
          <Card>
        <CardHeader>
          <CardTitle className='flex items-center justify-between gap-3'>
            <span>Voice Agent Runtime</span>
            <Badge variant={status === 'error' ? 'red' : status === 'connecting' ? 'yellow' : 'green'}>
              {status}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          {!hasVapiConfig ? (
            <EmptyState
              title='Vapi is not configured'
              description='Create a .env.local file from .env.example, then restart Vite so the public key is loaded.'
            />
          ) : null}

          <div className='grid gap-3 md:grid-cols-4'>
            <div className='rounded-xl border border-slate-200 p-3 dark:border-slate-700'>
              <p className='text-xs text-slate-500'>Connection</p>
              <p className='mt-1 text-sm font-medium'>{ready ? 'Ready' : 'Idle'}</p>
            </div>
            <div className='rounded-xl border border-slate-200 p-3 dark:border-slate-700'>
              <p className='text-xs text-slate-500'>Microphone</p>
              <p className='mt-1 text-sm font-medium'>{isMuted ? 'Muted' : 'Live'}</p>
            </div>
            <div className='rounded-xl border border-slate-200 p-3 dark:border-slate-700'>
              <p className='text-xs text-slate-500'>Assistant Volume</p>
              <p className='mt-1 text-sm font-medium'>{Math.round(volume * 100)}%</p>
            </div>
            <div className='rounded-xl border border-slate-200 p-3 dark:border-slate-700'>
              <p className='text-xs text-slate-500'>Configured</p>
              <p className='mt-1 text-sm font-medium'>{configured ? 'Yes' : 'No'}</p>
            </div>
          </div>

          <div className='flex flex-wrap gap-2'>
            <Button onClick={() => void start()} disabled={!hasVapiConfig || status === 'connecting'}>
              <PhoneCall className='mr-2 h-4 w-4' /> Start Voice Session
            </Button>
            <Button variant='secondary' onClick={() => void stop()} disabled={status === 'idle'}>
              <PhoneOff className='mr-2 h-4 w-4' /> Stop Session
            </Button>
            <Button variant='outline' onClick={toggleMute} disabled={!hasVapiConfig}>
              {isMuted ? <Mic className='mr-2 h-4 w-4' /> : <MicOff className='mr-2 h-4 w-4' />}
              {isMuted ? 'Unmute Mic' : 'Mute Mic'}
            </Button>
          </div>

          {error ? (
            <div className='rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300'>
              {error}
            </div>
          ) : null}

          <Separator />

          <div className='space-y-2'>
            <div className='flex items-center justify-between'>
              <p className='text-sm font-medium'>Live transcript</p>
              <div className='flex items-center gap-2'>
                {transcript.length > 0 && (
                  <Button variant="outline" size="sm" onClick={downloadTranscript}>
                    Download Transcript
                  </Button>
                )}
                <div className='flex items-center gap-2 text-xs text-slate-500'>
                  <Volume2 className='h-3.5 w-3.5' />
                  Talking in real time
                </div>
              </div>
            </div>
            {transcript.length === 0 ? (
              <p className='text-sm text-slate-500'>Start the session to hear and capture live speech.</p>
            ) : (
              <div className='space-y-2'>
                {transcript.map((entry, index) => (
                  <div key={`${entry.speaker}-${index}`} className='rounded-xl border border-slate-200 p-3 text-sm dark:border-slate-700'>
                    <p className='text-xs uppercase tracking-wide text-slate-500'>{entry.speaker}</p>
                    <p className='mt-1'>{entry.text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      </TabsContent>

      <TabsContent value="active" className="mt-4">
      <Card>
        <CardHeader>
          <CardTitle>Active Calls: {activeCount}</CardTitle>
        </CardHeader>
        <CardContent className='space-y-3'>
          {calls.map((call) => (
            <motion.div
              key={call.id}
              layout
              className='rounded-xl border border-slate-200 p-3 dark:border-slate-700'
            >
              <div className='mb-2 flex flex-wrap items-center gap-2'>
                <p className='font-medium'>{call.customer}</p>
                <span className='pulse-dot' />
                <Badge variant='blue'>Duration: {Math.floor(call.durationSec / 60)}:{String(call.durationSec % 60).padStart(2, '0')}</Badge>
                <Badge variant='green'>{call.assistantStatus}</Badge>
                <Badge variant='yellow'>{call.customerStatus}</Badge>
              </div>
              <p className='text-sm text-slate-600 dark:text-slate-300'>{call.transcript}</p>
            </motion.div>
          ))}
        </CardContent>
      </Card>
      </TabsContent>
      </Tabs>
    </div>
  )
}
