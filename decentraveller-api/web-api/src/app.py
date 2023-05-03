from fastapi import FastAPI

from src.routers.place_router import place_router
from src.routers.review_router import review_router
from src.routers.gecoding_router import geocoding_router

app = FastAPI()
app.include_router(place_router)
app.include_router(review_router)
app.include_router(geocoding_router)
