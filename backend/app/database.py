import os
from motor.motor_asyncio import AsyncIOMotorClient

class Database:
    client: AsyncIOMotorClient = None
    db = None

db_instance = Database()

async def connect_to_mongo():
    url = os.getenv("MONGODB_URL") or os.getenv("MONGODB_URI") or "mongodb://mongodb:27017"
    db_name = os.getenv("DB_NAME", "audioagent")
    db_instance.client = AsyncIOMotorClient(url)
    db_instance.db = db_instance.client[db_name]

async def close_mongo_connection():
    if db_instance.client:
        db_instance.client.close()

def get_db():
    return db_instance.db
