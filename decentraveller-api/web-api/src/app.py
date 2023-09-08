from fastapi import FastAPI, Request

from src.loaders.initial_rules_loader import load_initial_rules
from src.routers.gecoding_router import geocoding_router
from src.routers.place_router import place_router
from src.routers.profile_router import profile_router
from src.routers.review_router import review_router
from src.routers.recommendation_router import recommendation_router
from src.routers.image_asset_router import image_asset_router
from src.api_models.profile import InvalidWalletAddressException
from fastapi.responses import JSONResponse
from starlette.status import HTTP_400_BAD_REQUEST

import logging.config

app = FastAPI()
app.include_router(place_router)
app.include_router(review_router)
app.include_router(geocoding_router)
app.include_router(profile_router)
app.include_router(recommendation_router)
app.include_router(image_asset_router)

logging.config.fileConfig('logging.conf', disable_existing_loggers=False)


@app.on_event("startup")
async def load_rules():
    logging.info("Loadddd")
    await load_initial_rules()


@app.exception_handler(InvalidWalletAddressException)
async def invalid_wallet_exception_handler(request: Request, exc: InvalidWalletAddressException):
    """
    Invalid wallet address exception handler
    """
    return JSONResponse(status_code=HTTP_400_BAD_REQUEST,
                        content={"message": "The wallet address provided is invalid."})
