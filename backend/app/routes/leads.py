from fastapi import APIRouter, HTTPException
from app.database import get_db
from app.models import Lead, LeadCreate
from typing import List
import httpx
import os

router = APIRouter(prefix="/leads", tags=["leads"])

@router.get("/", response_model=List[Lead])
async def get_leads():
    db = get_db()
    cursor = db.leads.find({})
    leads = []
    async for doc in cursor:
        doc["id"] = doc.pop("_id")
        leads.append(Lead(**doc))
    return leads

@router.post("/", response_model=Lead)
async def add_lead(lead_in: LeadCreate):
    db = get_db()
    company = await db.companies.find_one({"_id": lead_in.companyId})
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
        
    lead = Lead(**lead_in.dict())
    doc = lead.dict()
    doc["_id"] = doc.pop("id")
    await db.leads.insert_one(doc)
    
    await db.companies.update_one({"_id": lead_in.companyId}, {"$inc": {"leadCount": 1}})
    return lead

@router.post("/{lead_id}/call")
async def call_lead(lead_id: str):
    db = get_db()
    lead = await db.leads.find_one({"_id": lead_id})
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
        
    vapi_key = os.getenv("VAPI_PRIVATE_KEY")
    phone_number_id = os.getenv("VAPI_PHONE_NUMBER_ID")
    server_url = os.getenv("VAPI_SERVER_URL") or os.getenv("RENDER_EXTERNAL_URL") or ""
    
    headers = {
        "Authorization": f"Bearer {vapi_key}",
        "Content-Type": "application/json"
    }
    
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
        async with httpx.AsyncClient() as client:
            response = await client.post("https://api.vapi.ai/call/phone", json=payload, headers=headers)
            response.raise_for_status()
            print(f"Vapi call initiated successfully: {response.text}")
    except httpx.HTTPStatusError as e:
        print(f"Vapi API Error: {e.response.status_code} - {e.response.text}")
    except Exception as e:
        print(f"Failed to call Vapi for lead {lead_id}: {e}")
        
    await db.leads.update_one(
        {"_id": lead_id},
        {"$set": {"status": "CALL_INITIATED"}}
    )
    return {"status": "success"}

@router.put("/{lead_id}", response_model=Lead)
async def update_lead(lead_id: str, lead_in: LeadCreate):
    db = get_db()
    lead = await db.leads.find_one({"_id": lead_id})
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
        
    await db.leads.update_one(
        {"_id": lead_id},
        {"$set": {
            "name": lead_in.name,
            "phone": lead_in.phone,
            "companyId": lead_in.companyId
        }}
    )
    
    updated_lead = await db.leads.find_one({"_id": lead_id})
    updated_lead["id"] = updated_lead.pop("_id")
    return Lead(**updated_lead)

@router.delete("/{lead_id}")
async def delete_lead(lead_id: str):
    db = get_db()
    lead = await db.leads.find_one({"_id": lead_id})
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
        
    await db.leads.delete_one({"_id": lead_id})
    
    # Decrement company lead count
    await db.companies.update_one(
        {"_id": lead.get("companyId")}, 
        {"$inc": {"leadCount": -1}}
    )
    return {"status": "success"}
