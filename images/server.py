from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List
import uuid
from datetime import datetime, timezone
import json

from emergentintegrations.llm.chat import LlmChat, UserMessage


# ------------------ ENV SETUP ------------------
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

MONGO_URL = os.getenv("MONGO_URL")
DB_NAME = os.getenv("DB_NAME")
EMERGENT_LLM_KEY = os.getenv("EMERGENT_LLM_KEY")

if not MONGO_URL or not DB_NAME:
    raise RuntimeError("Missing MongoDB configuration in .env")

# ------------------ DB ------------------
client = AsyncIOMotorClient(MONGO_URL)
db = client[DB_NAME]

# ------------------ APP ------------------
app = FastAPI()
api_router = APIRouter(prefix="/api")


# ------------------ MODELS ------------------
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class StatusCheckCreate(BaseModel):
    client_name: str


class AnalyzeMoodRequest(BaseModel):
    lyrics: str


class AnalyzeMoodResponse(BaseModel):
    mood: str
    confidence: float
    explanation: str


# ------------------ ROUTES ------------------
@api_router.get("/")
async def root():
    return {"message": "Hello World"}


@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_obj = StatusCheck(**input.model_dump())

    # MongoDB supports datetime directly
    await db.status_checks.insert_one(status_obj.model_dump())

    return status_obj


@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    return status_checks


@api_router.post("/analyze-mood", response_model=AnalyzeMoodResponse)
async def analyze_mood(request: AnalyzeMoodRequest):
    try:
        chat = LlmChat(
            api_key=EMERGENT_LLM_KEY,
            session_id=str(uuid.uuid4()),
            system_message="""You are an expert music mood classifier. Analyze song lyrics and classify them into EXACTLY ONE of these moods:
            - Happy
            - Sad
            - Angry
            - Romantic
            - Calm/Chill
            - Exciting
            - Patriotic
            - Thrilling
            - Horror
            
            Respond ONLY in JSON:
            {
                "mood": "<one>",
                "confidence": <0-100>,
                "explanation": "<brief>"
            }"""
        ).with_model("openai", "gpt-5.2")

        user_message = UserMessage(
            text=f"Analyze these lyrics:\n\n{request.lyrics}"
        )

        response = await chat.send_message(user_message)

        # ✅ FIX: handle response correctly
        raw_text = response if isinstance(response, str) else getattr(response, "text", str(response))

        try:
            result = json.loads(raw_text)
        except json.JSONDecodeError:
            logging.warning("Invalid JSON from LLM, using fallback")
            result = {
                "mood": "Calm/Chill",
                "confidence": 70,
                "explanation": "Fallback due to parsing issue"
            }

        return AnalyzeMoodResponse(
            mood=result.get("mood", "Calm/Chill"),
            confidence=float(result.get("confidence", 70)),
            explanation=result.get("explanation", "Analysis complete")
        )

    except Exception as e:
        logging.exception("Mood analysis failed")
        raise HTTPException(status_code=500, detail="Mood analysis failed")


# ------------------ MIDDLEWARE ------------------
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.getenv("CORS_ORIGINS", "*").split(","),
    allow_methods=["*"],
    allow_headers=["*"],
)

# ------------------ LOGGING ------------------
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)

# ------------------ SHUTDOWN ------------------
@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()