from fastapi_utils.api_model import APIModel


class ProfileBody(APIModel):
    """
    Profile API Model
    """
    owner: str
    nickname: str
    country: str
    interest: str
