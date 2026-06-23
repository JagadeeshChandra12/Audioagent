import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { api } from '@/lib/api'
import type { Company, Lead } from '@/types/domain'

export const keys = {
  dashboard: ['dashboard'],
  companies: ['companies'],
  leads: ['leads'],
  campaigns: ['campaigns'],
  analytics: ['analytics'],
  callLogs: ['callLogs'],
}

export const useDashboardQuery = () =>
  useQuery({ queryKey: keys.dashboard, queryFn: api.getDashboard, refetchInterval: 5000 })

export const useCompaniesQuery = () =>
  useQuery({ queryKey: keys.companies, queryFn: api.getCompanies })

export const useLeadsQuery = () =>
  useQuery({ queryKey: keys.leads, queryFn: api.getLeads })

export const useCampaignsQuery = () =>
  useQuery({ queryKey: keys.campaigns, queryFn: api.getCampaigns })

export const useAnalyticsQuery = (companyId?: string) =>
  useQuery({ queryKey: [...keys.analytics, companyId], queryFn: () => api.getAnalytics(companyId), refetchInterval: 5000 })

export const useCallLogsQuery = () =>
  useQuery({ queryKey: keys.callLogs, queryFn: api.getCallLogs, refetchInterval: 5000 })

export const useAddCompanyMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: Pick<Company, 'name' | 'industry'>) => api.addCompany(input),
    onMutate: async (input) => {
      await queryClient.cancelQueries({ queryKey: keys.companies })
      const previous = queryClient.getQueryData<Company[]>(keys.companies)
      const optimistic: Company = {
        id: `optimistic-${Date.now()}`,
        name: input.name,
        industry: input.industry,
        leadCount: 0,
        qualificationRate: 0,
        activeCampaigns: 0,
        lastActivity: 'just now',
      }

      queryClient.setQueryData<Company[]>(keys.companies, (current = []) => [
        optimistic,
        ...current,
      ])
      return { previous }
    },
    onError: (_, __, context) => {
      if (context?.previous) {
        queryClient.setQueryData(keys.companies, context.previous)
      }
      toast.error('Failed to add company. Please retry.')
    },
    onSuccess: () => {
      toast.success('Company added successfully')
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: keys.companies })
    },
  })
}

export const useUploadProtocolMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ companyId, file }: { companyId: string, file: File }) => api.uploadProtocol(companyId, file),
    onSuccess: () => {
      toast.success('Protocol file processed successfully')
      void queryClient.invalidateQueries({ queryKey: keys.companies })
    },
    onError: () => {
      toast.error('Failed to process protocol file')
    }
  })
}

export const useAddLeadMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: Pick<Lead, 'name' | 'phone' | 'companyId'>) => api.addLead(input),
    onSuccess: () => {
      toast.success('Lead added successfully')
      void queryClient.invalidateQueries({ queryKey: keys.leads })
      void queryClient.invalidateQueries({ queryKey: keys.companies })
    },
    onError: () => {
      toast.error('Failed to add lead')
    }
  })
}

export const useUpdateLeadMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: Pick<Lead, 'name' | 'phone' | 'companyId'> }) => api.updateLead(id, input),
    onSuccess: () => {
      toast.success('Lead updated successfully')
      void queryClient.invalidateQueries({ queryKey: keys.leads })
    },
    onError: () => {
      toast.error('Failed to update lead')
    }
  })
}

export const useDeleteLeadMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.deleteLead(id),
    onSuccess: () => {
      toast.success('Lead deleted successfully')
      void queryClient.invalidateQueries({ queryKey: keys.leads })
      void queryClient.invalidateQueries({ queryKey: keys.companies })
    },
    onError: () => {
      toast.error('Failed to delete lead')
    }
  })
}

export const useCallLeadMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (leadId: string) => api.callLead(leadId),
    onSuccess: () => {
      toast.success('Call initiated successfully')
      void queryClient.invalidateQueries({ queryKey: keys.leads })
      void queryClient.invalidateQueries({ queryKey: keys.dashboard })
    },
    onError: () => {
      toast.error('Failed to initiate call')
    }
  })
}

export const useLaunchCampaignMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (campaignId: string) => api.launchCampaign(campaignId),
    onSuccess: (data) => {
      toast.success(`Campaign launched! Called ${data.launched} leads.`)
      void queryClient.invalidateQueries({ queryKey: keys.campaigns })
      void queryClient.invalidateQueries({ queryKey: keys.leads })
      void queryClient.invalidateQueries({ queryKey: keys.dashboard })
      void queryClient.invalidateQueries({ queryKey: keys.analytics })
    },
    onError: () => {
      toast.error('Failed to launch campaign')
    }
  })
}

export const useCreateBulkCampaignMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: { name: string, companyId: string, leads: {name: string, phone: string}[] }) => api.createBulkCampaign(input),
    onSuccess: () => {
      toast.success('Campaign and leads generated successfully!')
      void queryClient.invalidateQueries({ queryKey: keys.campaigns })
      void queryClient.invalidateQueries({ queryKey: keys.leads })
      void queryClient.invalidateQueries({ queryKey: keys.companies })
    },
    onError: () => {
      toast.error('Failed to create bulk campaign')
    }
  })
}
