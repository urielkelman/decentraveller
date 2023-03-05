from fastapi import FastAPI

from src.routers.place_router import place_router

app = FastAPI()
app.include_router(place_router)
