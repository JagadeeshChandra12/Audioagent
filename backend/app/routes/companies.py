from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from app.database import get_db
from app.models import Company, CompanyCreate, ProtocolMetadata
from typing import List
import os
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import PromptTemplate

router = APIRouter(prefix="/companies", tags=["companies"])

@router.get("/", response_model=List[Company])
async def get_companies():
    db = get_db()
    cursor = db.companies.find({})
    companies = []
    async for doc in cursor:
        doc["id"] = doc.pop("_id")
        companies.append(Company(**doc))
    return companies

@router.post("/", response_model=Company)
async def add_company(company_in: CompanyCreate):
    db = get_db()
    company = Company(**company_in.dict())
    doc = company.dict()
    doc["_id"] = doc.pop("id")
    await db.companies.insert_one(doc)
    return company

@router.post("/{company_id}/protocol", response_model=Company)
async def upload_protocol(company_id: str, file: UploadFile = File(...)):
    db = get_db()
    doc = await db.companies.find_one({"_id": company_id})
    if not doc:
        raise HTTPException(status_code=404, detail="Company not found")
    
    content = await file.read()
    text_content = content.decode('utf-8', errors='ignore')
    
    api_key = os.getenv("GEMINI_API_KEY")
    metadata = ProtocolMetadata(raw_text_extracted=text_content)
    
    if api_key:
        try:
            llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash", google_api_key=api_key)
            prompt = PromptTemplate.from_template(
                "Extract the following metadata from this protocol document:\n"
                "- A short summary (2 sentences)\n"
                "- Target audience\n"
                "- Key selling points (comma separated list)\n\n"
                "Document:\n{text}\n\n"
                "Format your response exactly like this:\n"
                "SUMMARY: ...\nTARGET_AUDIENCE: ...\nKEY_SELLING_POINTS: item1, item2..."
            )
            chain = prompt | llm
            response = await chain.ainvoke({"text": text_content[:10000]})
            res_text = response.content
            
            summary = ""
            target_audience = ""
            key_selling_points = []
            
            for line in res_text.split('\n'):
                if line.startswith("SUMMARY:"): summary = line.replace("SUMMARY:", "").strip()
                elif line.startswith("TARGET_AUDIENCE:"): target_audience = line.replace("TARGET_AUDIENCE:", "").strip()
                elif line.startswith("KEY_SELLING_POINTS:"):
                    ksp = line.replace("KEY_SELLING_POINTS:", "").strip()
                    key_selling_points = [x.strip() for x in ksp.split(",") if x.strip()]
            
            metadata.summary = summary
            metadata.target_audience = target_audience
            metadata.key_selling_points = key_selling_points
        except Exception as e:
            print(f"Gemini API error: {e}")
            metadata.summary = "Error extracting metadata. See raw text."
    
    # update company
    doc["protocol_metadata"] = metadata.dict()
    await db.companies.update_one({"_id": company_id}, {"$set": {"protocol_metadata": doc["protocol_metadata"]}})
    doc["id"] = doc.pop("_id")
    return Company(**doc)
