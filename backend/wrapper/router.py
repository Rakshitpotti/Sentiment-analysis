from fastapi import APIRouter, UploadFile, File, Form
from crew.crew import create_crew

router = APIRouter()

@router.post("/automate")
async def automate_task(
    user_input: str = Form(...),
    session_id: str = Form(None),
    file: UploadFile = File(...)
):
    file_bytes = await file.read()

    result = create_crew(file_bytes, user_input, session_id)

    return result 
