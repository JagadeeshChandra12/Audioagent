import * as VapiModule from '@vapi-ai/web'
import { useEffect, useMemo, useRef, useState } from 'react'

import { env, hasVapiConfig } from '@/lib/env'

type VoiceEvent = {
  role?: string
  content?: string
  type?: string
  message?: {
    role?: string
    content?: string
  }
}

type AgentStatus = 'idle' | 'connecting' | 'listening' | 'speaking' | 'error'

const assistantConfig = {
  name: 'VoiceOS Sales Agent',
  firstMessage: 'Hello, this is VoiceOS. How can I help today?',
  model: {
    provider: 'openai',
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content:
          'You are a premium enterprise voice AI sales assistant for a multi-tenant SaaS platform. Speak clearly, listen carefully, qualify the lead, and keep responses concise and professional.',
      },
    ],
  },
  voice: {
    provider: '11labs',
    voiceId: 'burt',
  },
}

export function useVapiSession() {
  const vapiRef = useRef<any>(null)
  const configured = hasVapiConfig
  const [status, setStatus] = useState<AgentStatus>('idle')
  const [isMuted, setIsMuted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [transcript, setTranscript] = useState<Array<{ speaker: string; text: string }>>([])
  const [volume, setVolume] = useState(0)

  useEffect(() => {
    if (!configured || !env.vapiPublicKey) return

    const VapiCtor =
      (VapiModule as { default?: { default?: new (apiToken: string, apiBaseUrl?: string) => any } }).default
        ?.default ??
      (VapiModule as { default?: new (apiToken: string, apiBaseUrl?: string) => any }).default ??
      (VapiModule as unknown as new (apiToken: string, apiBaseUrl?: string) => any)
    const client = new VapiCtor(env.vapiPublicKey, env.vapiBaseUrl)
    vapiRef.current = client

    const onCallStart = () => {
      setError(null)
      setStatus('listening')
    }

    const onCallEnd = () => {
      setStatus('idle')
      setIsMuted(false)
    }

    const onSpeechStart = () => setStatus('speaking')
    const onSpeechEnd = () => setStatus('listening')

    const onVolumeLevel = (nextVolume: number) => setVolume(nextVolume)

    const onMessage = (message: VoiceEvent) => {
      const speaker = message.message?.role ?? message.role ?? 'assistant'
      const text = message.message?.content ?? message.content ?? ''
      if (!text) return
      setTranscript((current) => [...current, { speaker, text }].slice(-12))
    }

    const onError = (value: unknown) => {
      setStatus('error')
      setError(value instanceof Error ? value.message : 'Vapi call failed')
    }

    client.on('call-start', onCallStart)
    client.on('call-end', onCallEnd)
    client.on('speech-start', onSpeechStart)
    client.on('speech-end', onSpeechEnd)
    client.on('volume-level', onVolumeLevel)
    client.on('message', onMessage)
    client.on('error', onError)

    return () => {
      client.removeListener('call-start', onCallStart)
      client.removeListener('call-end', onCallEnd)
      client.removeListener('speech-start', onSpeechStart)
      client.removeListener('speech-end', onSpeechEnd)
      client.removeListener('volume-level', onVolumeLevel)
      client.removeListener('message', onMessage)
      client.removeListener('error', onError)
      client.stop()
      vapiRef.current = null
    }
  }, [configured])

  const start = async () => {
    if (!vapiRef.current) {
      setError('Vapi is not configured. Check your .env.local file.')
      return
    }

    setStatus('connecting')
    setError(null)
    try {
      await vapiRef.current.start(assistantConfig)
    } catch (caughtError) {
      setStatus('error')
      setError(caughtError instanceof Error ? caughtError.message : 'Unable to start Vapi session')
    }
  }

  const stop = async () => {
    await vapiRef.current?.stop()
    setStatus('idle')
    setIsMuted(false)
  }

  const toggleMute = () => {
    if (!vapiRef.current) return
    const nextMuted = !vapiRef.current.isMuted()
    vapiRef.current.setMuted(nextMuted)
    setIsMuted(nextMuted)
  }

  return useMemo(
    () => ({
      ready: configured,
      status,
      isMuted,
      error,
      transcript,
      volume,
      start,
      stop,
      toggleMute,
      configured: hasVapiConfig,
    }),
    [configured, error, isMuted, status, transcript, volume],
  )
}
