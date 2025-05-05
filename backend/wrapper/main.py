from fastapi import FastAPI
from wrapper.router import router as unified_router

app = FastAPI()
app.include_router(unified_router)

