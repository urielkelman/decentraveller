from typing import Optional

from fastapi import Depends, HTTPException, Query
from fastapi_utils.cbv import cbv
from fastapi_utils.inferring_router import InferringRouter
from sqlalchemy.orm import Session
from starlette.status import HTTP_400_BAD_REQUEST, HTTP_404_NOT_FOUND

from src.api_models.profile import ProfileBody
from src.dependencies import get_db
from src.orms.profile import ProfileORM
from sqlalchemy.exc import IntegrityError

profile_router = InferringRouter()


@cbv(profile_router)
class ProfileCBV:
    session: Session = Depends(get_db)

    @staticmethod
    def query_profile(session: Session,
                      owner: Optional[str], nickname: Optional[str]) -> Optional[ProfileORM]:
        """
        Database querying for a profile

        :param session: the database session
        :param owner: the owner of the profile
        :param nickname: the nickname of the profile
        :return: a ProfileORM or none if missing
        """
        if owner:
            profile: Optional[ProfileORM] = session.query(ProfileORM).get(owner)
            if profile and nickname and profile.nickname != nickname:
                return None
        elif nickname:
            profile: Optional[ProfileORM] = session.query(ProfileORM). \
                filter(ProfileORM.nickname == nickname).first()
        else:
            return None
        return profile

    @profile_router.get("/profile")
    def get_profile(self, owner: str = Query(None),
                    nickname: str = Query(None)) -> ProfileBody:
        """
        Gets a profile given either the owner or the nickname

        :param session: the database session
        :param owner: the address of the owner
        :param nickname: the nickname
        :return: a profile orm
        """
        if not owner and not nickname:
            raise HTTPException(status_code=HTTP_400_BAD_REQUEST,
                                detail="Must provide either 'owner' or 'nickname' as query params.")

        profile = self.query_profile(self.session, owner, nickname)

        if profile is None:
            raise HTTPException(status_code=HTTP_404_NOT_FOUND)

        return ProfileBody.from_orm(profile)

    @profile_router.post("/profile", status_code=201)
    def post_profile(self, profile: ProfileBody) -> ProfileBody:
        """
        Creates a new profile in the database

        :param profile: the profile data for creation
        :return: the profile data
        """
        profile_orm = self.query_profile(self.session, profile.owner, None)
        if profile_orm:
            update_data = profile.dict(exclude_unset=True)
            for k, v in update_data.items():
                profile_orm.__setattr__(k, v)
        else:

            profile_orm = ProfileORM(owner=profile.owner, nickname=profile.nickname,
                                     country=profile.country,
                                     interest=profile.interest)
            self.session.add(profile_orm)
        try:
            self.session.commit()
        except IntegrityError:
            raise HTTPException(status_code=HTTP_400_BAD_REQUEST,
                                detail="The nickname is already in use.")
        return ProfileBody.from_orm(profile_orm)
