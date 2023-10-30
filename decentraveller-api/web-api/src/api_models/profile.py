from typing import NewType
from datetime import datetime
from fastapi_utils.api_model import APIModel
from src.api_models.place_category import PlaceCategory
from pydantic import validator
import re

from src.api_models.user_role import ProfileRole


class InvalidWalletAddressException(Exception):
    """
    The wallet address is invalid
    """
    pass


WalletID = NewType("WalletId", str)


def wallet_id_validator(owner: WalletID) -> str:
    """
    Walet ID validator
    :param owner: wallet_id
    :return: the wallet id
    """
    if not re.match("0x[a-fA-F0-9]{40}$", owner):
        raise InvalidWalletAddressException
    return owner.lower()


class RoleChangeBody(APIModel):
    """
    Role body
    """
    owner: WalletID
    role: ProfileRole


class ProfileBody(APIModel):
    """
    Profile body API Model
    """
    owner: WalletID
    nickname: str
    country: str
    interest: PlaceCategory
    role: ProfileRole

    @validator('owner')
    def wallet_id_validator(cls, v):
        return wallet_id_validator(v)


class ProfilePushTokenBody(APIModel):
    """
        Profile body API Model
    """
    owner: WalletID
    push_token: str


class ProfileInDB(ProfileBody):
    """
    Profile DB API Model
    """
    created_at: datetime
