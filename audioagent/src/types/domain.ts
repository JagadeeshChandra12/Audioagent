export type LeadStatus =
  | 'PENDING'
  | 'CALL_INITIATED'
  | 'QUALIFIED'
  | 'NOT_INTERESTED'
  | 'FAILED'
  | 'NEEDS_REVIEW'

export type Lead = {
  id: string
  name: string
  phone: string
  status: LeadStatus
  lastCall: string
  campaign: string
  score: number
  companyId: string
}

export type Company = {
  id: string
  name: string
  industry: string
  leadCount: number
  qualificationRate: number
  activeCampaigns: number
  lastActivity: string
  protocol_metadata?: {
    summary?: string
    target_audience?: string
    key_selling_points?: string[]
  }
}

export type Campaign = {
  id: string
  name: string
  companyId?: string
  totalLeads: number
  completed: number
  active: number
  successRate: number
  eta: string
}

export type CallLog = {
  id: string
  customer: string
  duration: string
  confidence: number
  summary: string
  evaluation: 'Qualified' | 'Review' | 'Not Interested'
  transcript: Array<{ speaker: 'customer' | 'ai'; message: string }>
}

export type DashboardMetrics = {
  totalLeads: number
  qualifiedLeads: number
  activeCalls: number
  campaignSuccessRate: number
  revenuePotential: number
}

export type FunnelDatum = { stage: string; value: number }
export type DailyCallDatum = { day: string; calls: number }
export type OutcomeDatum = { name: string; value: number }
