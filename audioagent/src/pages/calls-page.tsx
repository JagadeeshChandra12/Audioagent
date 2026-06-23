import { Download, FileDown } from 'lucide-react'

import { QueryError, QueryLoading } from '@/components/shared/query-state'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useCallLogsQuery } from '@/hooks/use-data'

export function CallsPage() {
  const { data, isLoading, isError, refetch } = useCallLogsQuery()

  if (isLoading) return <QueryLoading rows={3} />
  if (isError || !data) return <QueryError onRetry={() => void refetch()} />

  const downloadTranscript = (transcript: any[], customer: string) => {
    if (!transcript || transcript.length === 0) return
    const text = transcript.map(t => `${t.speaker.toUpperCase()}: ${t.message}`).join('\n')
    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `transcript-${customer.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className='space-y-4'>
      <div className='flex flex-wrap items-center justify-between gap-2'>
        <h1 className='text-2xl font-semibold'>Call Logs</h1>
        <div className='flex gap-2'>
          <Button variant='outline'>
            <FileDown className='mr-2 h-4 w-4' /> Export PDF
          </Button>
        </div>
      </div>

      {data.map((log) => (
        <Card key={log.id}>
          <CardHeader className='flex flex-row items-center justify-between'>
            <CardTitle>{log.customer}</CardTitle>
            {log.transcript && log.transcript.length > 0 && (
              <Button variant='outline' size='sm' onClick={() => downloadTranscript(log.transcript, log.customer)}>
                <Download className='mr-2 h-4 w-4' /> Download Transcript
              </Button>
            )}
          </CardHeader>
          <CardContent className='space-y-3'>
            <div className='grid gap-2 text-sm sm:grid-cols-2 lg:grid-cols-4'>
              <p>Duration: {log.duration}</p>
              <p>Confidence: {(log.confidence * 100).toFixed(0)}%</p>
              <p>Evaluation: {log.evaluation}</p>
              <p>Summary: {log.summary}</p>
            </div>
            <div className='grid gap-2'>
              {log.transcript.map((line: any, index: number) => (
                <div
                  key={index}
                  className={`rounded-xl p-3 text-sm ${
                    line.speaker === 'customer'
                      ? 'mr-auto max-w-[80%] bg-slate-100 dark:bg-slate-800'
                      : 'ml-auto max-w-[80%] bg-brand/10 text-brand'
                  }`}
                >
                  <span className='font-medium capitalize'>{line.speaker}: </span>
                  {line.message}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
