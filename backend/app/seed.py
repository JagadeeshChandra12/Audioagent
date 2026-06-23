from app.database import get_db

async def seed_db():
    db = get_db()
    
    # Check if companies exist
    count = await db.companies.count_documents({})
    if count == 0:
        companies = [
            {"_id": "c1", "name": "Apex Health Systems", "industry": "Healthcare", "leadCount": 1820, "qualificationRate": 61.4, "activeCampaigns": 4, "lastActivity": "2 min ago"},
            {"_id": "c2", "name": "Orbit Legal Partners", "industry": "Legal Services", "leadCount": 980, "qualificationRate": 54.9, "activeCampaigns": 2, "lastActivity": "12 min ago"},
            {"_id": "c3", "name": "BluePeak SaaS", "industry": "Software", "leadCount": 3320, "qualificationRate": 69.2, "activeCampaigns": 5, "lastActivity": "5 min ago"},
            {"_id": "c4", "name": "Nexa Realty Group", "industry": "Real Estate", "leadCount": 2140, "qualificationRate": 58.1, "activeCampaigns": 3, "lastActivity": "1 hour ago"},
        ]
        await db.companies.insert_many(companies)

    # Check if campaigns exist
    count = await db.campaigns.count_documents({})
    if count == 0:
        campaigns = [
            {"_id": "cmp-1", "name": "Q3 Enterprise Outbound", "totalLeads": 4200, "completed": 2670, "active": 128, "successRate": 62.5, "eta": "2h 35m"},
            {"_id": "cmp-2", "name": "SMB Winback Pulse", "totalLeads": 1800, "completed": 1240, "active": 52, "successRate": 58.1, "eta": "1h 10m"},
            {"_id": "cmp-3", "name": "Partner Expansion", "totalLeads": 2900, "completed": 2015, "active": 73, "successRate": 67.3, "eta": "3h 05m"},
        ]
        await db.campaigns.insert_many(campaigns)

    # Check if call logs exist
    count = await db.call_logs.count_documents({})
    if count == 0:
        call_logs = [
            {
                "_id": "log-1", "customer": "Emily Carter", "duration": "08:14", "confidence": 0.91, "summary": "Customer is interested in a custom enterprise plan and requested pricing.", "evaluation": "Qualified",
                "transcript": [
                    {"speaker": "customer", "message": "Can you explain onboarding support?"},
                    {"speaker": "ai", "message": "Absolutely. We include white-glove onboarding for enterprise."},
                    {"speaker": "customer", "message": "Great, please share pricing details."},
                    {"speaker": "ai", "message": "I can route this to a specialist right away."}
                ]
            },
            {
                "_id": "log-2", "customer": "Ravi Menon", "duration": "05:49", "confidence": 0.78, "summary": "Customer asked to be contacted next quarter.", "evaluation": "Review",
                "transcript": [
                    {"speaker": "customer", "message": "We are evaluating options next quarter."},
                    {"speaker": "ai", "message": "No problem. Would you like a follow-up reminder scheduled?"}
                ]
            }
        ]
        await db.call_logs.insert_many(call_logs)

    # Check if leads exist
    count = await db.leads.count_documents({})
    if count == 0:
        statuses = ['PENDING', 'CALL_INITIATED', 'QUALIFIED', 'NOT_INTERESTED', 'FAILED', 'NEEDS_REVIEW']
        leads = []
        for i in range(200):
            leads.append({
                "_id": f"L-{1000 + i}",
                "name": f"Lead {i + 1}",
                "phone": f"+1 (555) {str(100 + (i % 899)).zfill(3)}-{str(1000 + (i % 8999)).zfill(4)}",
                "status": statuses[i % len(statuses)],
                "lastCall": f"{(i % 28) + 1} Jun 2026",
                "campaign": ['Q3 Outbound', 'Retention Sprint', 'Winback Pro'][i % 3],
                "score": 45 + (i % 55),
                "companyId": f"c{(i % 4) + 1}"
            })
        await db.leads.insert_many(leads)
