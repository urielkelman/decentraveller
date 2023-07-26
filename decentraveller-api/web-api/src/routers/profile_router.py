from fastapi import Depends, HTTPException, Query, Response
from fastapi_utils.cbv import cbv
from fastapi_utils.inferring_router import InferringRouter
from sqlalchemy.exc import IntegrityError
from starlette.status import HTTP_400_BAD_REQUEST, HTTP_404_NOT_FOUND

from src.api_models.profile import ProfileInDB, ProfileBody, WalletID, wallet_id_validator
from src.dependencies.avatar_generator import AvatarGenerator
from src.dependencies.indexer_auth import indexer_auth
from src.dependencies.relational_database import build_relational_database, RelationalDatabase
from src.orms.profile import ProfileORM

profile_router = InferringRouter()


@cbv(profile_router)
class ProfileCBV:
    database: RelationalDatabase = Depends(build_relational_database)
    avatar_generator: AvatarGenerator = Depends(AvatarGenerator)

    @profile_router.get("/profile/{owner}")
    def get_profile(self, owner: WalletID = Depends(wallet_id_validator)) -> ProfileInDB:
        """
        Gets a profile given either the owner or the nickname

        :param owner: the address of the owner
        :return: a profile orm
        """

        profile = self.database.get_profile_orm(owner)

        if profile is None:
            raise HTTPException(status_code=HTTP_404_NOT_FOUND)

        return ProfileInDB.from_orm(profile)

    @profile_router.get("/profile/{owner}/avatar.jpg",
                        responses={
                            200: {
                                "content": {"image/png": {}}
                            }
                        },
                        response_class=Response)
    def get_avatar(self, owner: WalletID = Depends(wallet_id_validator),
                   res: int = Query(512)):
        """
        Gets a profile avatar

        :param owner: the address of the owner
        :param res: squared output resolution
        :return: jpg avatar image
        """

        profile = self.database.get_profile_orm(owner)

        if profile is None:
            raise HTTPException(status_code=HTTP_404_NOT_FOUND)

        if not profile.avatar_ipfs_uri:
            return Response(content=self.avatar_generator.generate_default_avatar(profile.owner, res),
                            media_type="image/jpeg")

        return Response(content=b"", media_type="image/jpeg")

    @profile_router.post("/profile", status_code=201, dependencies=[Depends(indexer_auth)])
    def post_profile(self, profile: ProfileBody) -> ProfileInDB:
        """
        Creates a new profile in the database

        :param profile: the profile data for creation
        :return: the profile data
        """
        profile_orm = self.database.get_profile_orm(profile.owner)
        if profile_orm:
            update_data = profile.dict(exclude_unset=True)
            for k, v in update_data.items():
                profile_orm.__setattr__(k, v)
        else:

            profile_orm = ProfileORM(owner=profile.owner, nickname=profile.nickname,
                                     country=profile.country,
                                     interest=profile.interest)
            self.database.session.add(profile_orm)
        try:
            self.database.session.commit()
        except IntegrityError:
            raise HTTPException(status_code=HTTP_400_BAD_REQUEST,
                                detail="The nickname is already in use.")
        return ProfileInDB.from_orm(profile_orm)
