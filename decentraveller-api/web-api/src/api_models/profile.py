from fastapi_utils.api_model import APIModel


class ProfileBody(APIModel):
    """
    Profile API Model
    """
    owner: str
    nickname: str
    name: str
    country: str
    gender: str
    interest: str
