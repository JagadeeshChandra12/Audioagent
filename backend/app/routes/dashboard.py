from fastapi import APIRouter
from app.database import get_db
from app.models import DashboardMetrics

router = APIRouter(prefix="/dashboard", tags=["dashboard"])

@router.get("/", response_model=DashboardMetrics)
async def get_dashboard():
    db = get_db()
    total_leads = await db.leads.count_documents({})
    qualified_leads = await db.leads.count_documents({"status": "QUALIFIED"})
    active_calls = 0 
    campaigns = await db.campaigns.find({}).to_list(length=None)
    
    success_rate = 63.4
    if campaigns:
        total_success = sum(c.get("successRate", 0) for c in campaigns)
        success_rate = total_success / len(campaigns)

    revenue_potential = total_leads * 150 

    return DashboardMetrics(
        totalLeads=total_leads,
        qualifiedLeads=qualified_leads,
        activeCalls=active_calls,
        campaignSuccessRate=round(success_rate, 1),
        revenuePotential=revenue_potential
    )
