from pydantic import BaseModel, Field
from typing import List, Optional
import uuid

class ProtocolMetadata(BaseModel):
    summary: Optional[str] = None
    target_audience: Optional[str] = None
    key_selling_points: Optional[List[str]] = None
    raw_text_extracted: Optional[str] = None

class CompanyBase(BaseModel):
    name: str
    industry: str

class CompanyCreate(CompanyBase):
    pass

class Company(CompanyBase):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    leadCount: int = 0
    qualificationRate: float = 0.0
    activeCampaigns: int = 0
    lastActivity: str = "just now"
    protocol_metadata: Optional[ProtocolMetadata] = None

class LeadBase(BaseModel):
    name: str
    phone: str
    companyId: str

class LeadCreate(LeadBase):
    pass

class Lead(LeadBase):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    status: str = "PENDING"
    lastCall: str = "never"
    campaign: str = "default"
    score: int = 0

class DashboardMetrics(BaseModel):
    totalLeads: int
    qualifiedLeads: int
    activeCalls: int
    campaignSuccessRate: float
    revenuePotential: int

class Campaign(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    companyId: Optional[str] = None
    totalLeads: int
    completed: int
    active: int
    successRate: float
    eta: str

class BulkLeadCreate(BaseModel):
    name: str
    phone: str

class BulkCampaignCreate(BaseModel):
    name: str
    companyId: str
    leads: List[BulkLeadCreate]

class FunnelDatum(BaseModel):
    stage: str
    value: int

class DailyCallDatum(BaseModel):
    day: str
    calls: int

class OutcomeDatum(BaseModel):
    name: str
    value: int

class AnalyticsData(BaseModel):
    funnelData: List[FunnelDatum]
    dailyCalls: List[DailyCallDatum]
    outcomeData: List[OutcomeDatum]
    qualificationRate: float
    campaignPerformance: List[Campaign]

class TranscriptMessage(BaseModel):
    speaker: str
    message: str

class CallLog(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    customer: str = "Unknown"
    duration: str = "00:00"
    confidence: float = 0.0
    summary: str = ""
    status: Optional[str] = "completed"
    evaluation: str = "Pending"
    transcript: List[TranscriptMessage] = Field(default_factory=list)
