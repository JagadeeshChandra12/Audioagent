import { env } from '@/lib/env'
import { HttpClient } from '@/lib/http'
import type { Company } from '@/types/domain'

const http = new HttpClient(env.apiBaseUrl ?? 'http://localhost:8000')

export const api = {
  async getDashboard() {
    return http.get<any>('/dashboard')
  },
  async getCompanies() {
    return http.get<Company[]>('/companies')
  },
  async addCompany(input: Pick<Company, 'name' | 'industry'>) {
    return http.post<Company>('/companies', input)
  },
  async uploadProtocol(companyId: string, file: File) {
    const formData = new FormData()
    formData.append('file', file)
    
    const response = await fetch(`${env.apiBaseUrl ?? 'http://localhost:8000'}/companies/${companyId}/protocol`, {
      method: 'POST',
      body: formData,
    })
    if (!response.ok) throw new Error('Upload failed')
    return response.json() as Promise<Company>
  },
  async getLeads() {
    return http.get<any[]>('/leads')
  },
  async addLead(input: any) {
    return http.post<any>('/leads', input)
  },
  async updateLead(leadId: string, input: any) {
    return http.put<any>(`/leads/${leadId}`, input)
  },
  async deleteLead(leadId: string) {
    return http.delete<any>(`/leads/${leadId}`)
  },
  async callLead(leadId: string) {
    return http.post<any>(`/leads/${leadId}/call`, {})
  },
  async getCampaigns() {
    return http.get<any[]>('/campaigns')
  },
  async createBulkCampaign(input: { name: string, companyId: string, leads: {name: string, phone: string}[] }) {
    return http.post<any>('/campaigns/bulk', input)
  },
  async launchCampaign(campaignId: string) {
    return http.post<any>(`/campaigns/${campaignId}/launch`, {})
  },
  async getAnalytics(companyId?: string) {
    const url = companyId ? `/analytics?companyId=${companyId}` : '/analytics'
    return http.get<any>(url)
  },
  async getCallLogs() {
    return http.get<any[]>('/call-logs')
  },
}
