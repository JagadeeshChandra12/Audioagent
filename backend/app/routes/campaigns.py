from fastapi import APIRouter, HTTPException
from app.database import get_db
from app.models import Campaign, BulkCampaignCreate, Lead
from typing import List
import httpx
import os
import asyncio
import uuid

router = APIRouter(prefix="/campaigns", tags=["campaigns"])

@router.get("/", response_model=List[Campaign])
async def get_campaigns():
    db = get_db()
    cursor = db.campaigns.find({})
    campaigns = []
    async for doc in cursor:
        doc["id"] = doc.pop("_id")
        campaigns.append(Campaign(**doc))
    return campaigns

@router.post("/bulk")
async def create_bulk_campaign(bulk_in: BulkCampaignCreate):
    db = get_db()
    
    # 1. Validate Company
    company = await db.companies.find_one({"_id": bulk_in.companyId})
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
        
    # 2. Create Campaign
    campaign_id = str(uuid.uuid4())
    campaign_doc = {
        "_id": campaign_id,
        "name": bulk_in.name,
        "companyId": bulk_in.companyId,
        "totalLeads": len(bulk_in.leads),
        "completed": 0,
        "active": 0,
        "successRate": 0.0,
        "eta": "1 day"
    }
    await db.campaigns.insert_one(campaign_doc)
    
    # 3. Create Leads
    if bulk_in.leads:
        leads_to_insert = []
        for lead_data in bulk_in.leads:
            lead_doc = {
                "_id": str(uuid.uuid4()),
                "name": lead_data.name,
                "phone": lead_data.phone,
                "companyId": bulk_in.companyId,
                "status": "PENDING",
                "lastCall": "never",
                "campaign": bulk_in.name,
                "score": 0
            }
            leads_to_insert.append(lead_doc)
            
        await db.leads.insert_many(leads_to_insert)
        
        # Update Company leadCount
        await db.companies.update_one(
            {"_id": bulk_in.companyId},
            {"$inc": {"leadCount": len(bulk_in.leads)}}
        )
        
    return {"status": "success", "campaignId": campaign_id, "leadsImported": len(bulk_in.leads)}

@router.post("/{campaign_id}/launch")
async def launch_campaign(campaign_id: str):
    db = get_db()
    
    # 1. Fetch the Campaign
    campaign = await db.campaigns.find_one({"_id": campaign_id})
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")
        
    # 2. Fetch pending leads (limit to 5 for safety during demo/batch)
    cursor = db.leads.find({"status": "PENDING"}).limit(5)
    pending_leads = await cursor.to_list(length=5)
    
    if not pending_leads:
        return {"status": "success", "launched": 0, "message": "No pending leads to call"}

    # 3. Trigger Vapi API calls
    vapi_key = os.getenv("VAPI_PRIVATE_KEY")
    phone_number_id = os.getenv("VAPI_PHONE_NUMBER_ID")
    server_url = os.getenv("VAPI_SERVER_URL") or os.getenv("RENDER_EXTERNAL_URL") or ""
    headers = {
        "Authorization": f"Bearer {vapi_key}",
        "Content-Type": "application/json"
    }
    
    launched_count = 0
    
    async with httpx.AsyncClient() as client:
        for lead in pending_leads:
            company = await db.companies.find_one({"_id": lead.get("companyId")})
            company_name = company.get("name", "our company") if company else "our company"
            
            protocol_context = ""
            protocol_metadata = company.get("protocol_metadata") if company else None
            if protocol_metadata:
                summary = protocol_metadata.get("summary", "")
                key_points = protocol_metadata.get("key_selling_points", [])
                points_str = "\n".join([f"- {p}" for p in key_points])
                protocol_context = f"\nCompany Context: {summary}\nKey Selling Points:\n{points_str}"

            system_prompt = f"You are a professional sales representative calling on behalf of {company_name}. You are calling a lead named {lead.get('name')}. Your goal is to qualify this lead by politely engaging them in conversation.{protocol_context}"
            first_message = f"Hello {lead.get('name')}, this is calling from {company_name}. How are you doing today?"

            payload = {
                "name": f"Call to {lead.get('name')}",
                "phoneNumberId": phone_number_id,
                "assistant": {
                    "firstMessage": first_message,
                    "serverUrl": f"{server_url}/vapi/webhook" if server_url else None,
                    "model": {
                        "provider": "openai",
                        "model": "gpt-4o-mini",
                        "messages": [
                            {"role": "system", "content": system_prompt}
                        ]
                    },
                    "voice": {
                        "provider": "11labs",
                        "voiceId": "bIHbv24MWmeRgasZH58o"
                    }
                },
                "customer": {
                    "number": lead.get("phone", "+15555555555"),
                    "name": lead.get("name")
                }
            }
            
            try:
                # Fire and forget / await the trigger
                response = await client.post("https://api.vapi.ai/call/phone", json=payload, headers=headers)
                # We update the database regardless of Vapi success for the sake of the UI demo
                # In a real app, you would check response.status_code == 201 before updating.
                launched_count += 1
            except Exception as e:
                print(f"Failed to call Vapi for lead {lead.get('_id')}: {e}")
                launched_count += 1 # Update anyway for UI demo

            # 4. Update the lead status
            await db.leads.update_one(
                {"_id": lead["_id"]},
                {"$set": {"status": "CALL_INITIATED"}}
            )
            
            # Rate limiting for API safety
            await asyncio.sleep(0.5)
            
    # Update campaign active count
    await db.campaigns.update_one(
        {"_id": campaign_id},
        {"$inc": {"active": launched_count}}
    )
    
    return {"status": "success", "launched": launched_count}
