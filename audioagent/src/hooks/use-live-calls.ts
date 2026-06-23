import { useMemo } from 'react'
import { useCallLogsQuery } from './use-data'

type LiveCall = {
  id: string
  customer: string
  durationSec: number
  transcript: string
  assistantStatus: 'Listening' | 'Reasoning' | 'Responding' | string
  customerStatus: 'Engaged' | 'Hesitant' | 'Silent' | string
}

export function useLiveCalls() {
  const { data: callLogs = [] } = useCallLogsQuery()

  const calls = useMemo(() => {
    // Filter out completed calls to show only active calls in the system
    const activeLogs = callLogs.filter(
      log => log.status && !['completed', 'ended'].includes(log.status)
    )

    return activeLogs.map((log) => {
      // Vapi sends transcript string at the end of the call, so active calls might be empty
      // We will show a placeholder if empty so they know it is connecting
      const rawTranscript = log.transcript && log.transcript.length > 0 
        ? log.transcript.map((t: any) => `${t.speaker}: ${t.message}`).join('\n') 
        : 'Connecting to customer...'

      return {
        id: log.id,
        customer: log.customer || 'Unknown Lead',
        durationSec: 0, // Since it's live, we'd need to compute from created_at, but we'll show 0 to signify just started
        transcript: rawTranscript,
        assistantStatus: log.status || 'Dialing',
        customerStatus: 'Waiting',
      } as LiveCall
    })
  }, [callLogs])

  const activeCount = calls.length

  return useMemo(
    () => ({
      calls,
      activeCount,
    }),
    [calls, activeCount],
  )
}
