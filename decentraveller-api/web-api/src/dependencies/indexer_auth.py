from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
import os

INDEXER_API_KEY = os.getenv("INDEXER_API_KEY")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


def indexer_auth(api_key: str = Depends(oauth2_scheme)):
    """
    Api key bearer token auth
    :param api_key: the api key given
    """
    if api_key != INDEXER_API_KEY:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Forbidden"
        )