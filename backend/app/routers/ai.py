from fastapi import APIRouter
from app.schemas import AIAdvisorQuery, AIAdvisorResponse
from app.ai_advisor import run_ai_advisor

router = APIRouter(prefix="/api/ai", tags=["AI Advisor"])

@router.post("/analyze-profile", response_model=AIAdvisorResponse)
async def analyze_profile_ai(query: AIAdvisorQuery):
    return await run_ai_advisor(query.user_prompt, query.profile)
