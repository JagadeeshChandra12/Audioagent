from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.database import connect_to_mongo, close_mongo_connection
from app.routes import companies, leads, vapi, dashboard, campaigns, analytics, call_logs
from app.seed import seed_db
from dotenv import load_dotenv

load_dotenv()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    await connect_to_mongo()
    await seed_db()
    yield
    # Shutdown
    await close_mongo_connection()

app = FastAPI(title="AudioAgent API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(dashboard.router)
app.include_router(companies.router)
app.include_router(leads.router)
app.include_router(campaigns.router)
app.include_router(analytics.router)
app.include_router(call_logs.router)
app.include_router(vapi.router)

@app.get("/health")
async def health_check():
    return {"status": "ok"}
