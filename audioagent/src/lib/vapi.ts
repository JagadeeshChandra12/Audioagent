import { env } from '@/lib/env'

export type VapiStatus = 'configured' | 'mock' | 'missing'

export const vapiClient = {
  status(): VapiStatus {
    if (env.vapiBaseUrl || env.vapiPublicKey) return 'configured'
    return 'missing'
  },
  connectionLabel() {
    if (env.vapiBaseUrl) return 'Vapi backend connected'
    if (env.vapiPublicKey) return 'Vapi key detected'
    return 'Vapi not configured'
  },
  createAgentPayload(prompt: string, companyName: string) {
    return {
      prompt,
      companyName,
      voice: 'en-US',
      agentType: 'outbound-sales',
    }
  },
}
