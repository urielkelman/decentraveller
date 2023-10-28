import logging

from fastapi import Depends, HTTPException, Query, Response, File
from typing_extensions import Annotated
from fastapi_utils.cbv import cbv
from fastapi_utils.inferring_router import InferringRouter
from sqlalchemy.exc import IntegrityError
from starlette.status import HTTP_400_BAD_REQUEST, HTTP_404_NOT_FOUND

from src.api_models.profile import ProfileInDB, ProfileBody, WalletID, wallet_id_validator, ProfilePushTokenBody
from src.dependencies.avatar_generator import AvatarGenerator
from src.dependencies.ipfs_service import IPFSService, MaximumUploadSizeExceeded
from src.dependencies.indexer_auth import indexer_auth
from src.dependencies.relational_database import build_relational_database, RelationalDatabase
from src.orms.profile import ProfileORM
from io import BytesIO
from PIL import Image

profile_router = InferringRouter()


@cbv(profile_router)
class ProfileCBV:
    database: RelationalDatabase = Depends(build_relational_database)
    avatar_generator: AvatarGenerator = Depends(AvatarGenerator)
    ipfs_service: IPFSService = Depends(IPFSService)

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

    @staticmethod
    def resize_image(image: bytes, size: int) -> bytes:
        """
        Resizes an image as squared and compress it
        :param image: the image bytes
        :param size: new size of the image
        :return: the new image bytes
        """
        image = Image.open(BytesIO(image))
        image = image.resize((size, size)).convert('RGBA')
        final = Image.new("RGB", image.size, (255, 255, 255))
        final.paste(image, (0, 0), image)

        bytesfile = BytesIO()
        final.save(bytesfile, format='jpeg', optimize=True, quality=95)
        return bytesfile.getvalue()

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

        if not profile.ipfs_hash:
            return Response(content=self.avatar_generator.generate_default_avatar(profile.owner, res),
                            media_type="image/jpeg")
        else:
            try:
                image_bytes = self.ipfs_service.get_file(profile.ipfs_hash)
                image_bytes = self.resize_image(image_bytes, res)
                return Response(content=image_bytes,
                                media_type="image/jpeg")
            except FileNotFoundError:
                raise HTTPException(status_code=HTTP_404_NOT_FOUND)

    @staticmethod
    def adapt_new_avatar(image: bytes) -> bytes:
        """
        Resizes an image as squared and compress it
        :param image: the image bytes
        :return: the new image bytes
        """
        image = Image.open(BytesIO(image))
        minsize = min(*image.size)
        minsize = min(minsize, 2048)
        image = image.resize((minsize, minsize)).convert('RGBA')
        final = Image.new("RGB", image.size, (255, 255, 255))
        final.paste(image, (0, 0), image)

        bytesfile = BytesIO()
        final.save(bytesfile, format='jpeg', optimize=True, quality=95)
        return bytesfile.getvalue()

    @profile_router.post("/profile/{owner}/avatar.jpg")
    def upload_avatar(self, file: Annotated[bytes, File()],
                      owner: WalletID = Depends(wallet_id_validator)):
        """
        Uploads a profile avatar

        :param file: uploaded file
        :param owner: the address of the owner
        """

        profile = self.database.get_profile_orm(owner)
        file = self.adapt_new_avatar(file)
        try:
            filehash = self.ipfs_service.add_file(file)
        except MaximumUploadSizeExceeded:
            raise HTTPException(status_code=HTTP_400_BAD_REQUEST,
                                detail="The file is too big.")
        self.ipfs_service.pin_file(filehash)
        self.database.add_image(filehash, pinned=True)
        profile.ipfs_hash = filehash
        self.database.session.add(profile)
        self.database.session.commit()
        return ProfileInDB.from_orm(profile)

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

            profile_orm = ProfileORM(owner=profile.owner.lower(), nickname=profile.nickname,
                                     country=profile.country,
                                     interest=profile.interest,
                                     role=profile.role)
            self.database.session.add(profile_orm)
        try:
            self.database.session.commit()
        except IntegrityError:
            raise HTTPException(status_code=HTTP_400_BAD_REQUEST,
                                detail="The nickname is already in use.")
        return ProfileInDB.from_orm(profile_orm)

    @profile_router.post("/profile/push-token", status_code=201)
    def post_profile_push_address(self, profile_push_token: ProfilePushTokenBody):
        """
            Saves a push token for an existing profile, so it can be used to send notifications later.

            :param profile_push_token: the push token associated to an owner
        """
        profile_orm = self.database.get_profile_orm(WalletID(profile_push_token.owner.lower()))
        if not profile_orm:
            logging.error('Profile for address {} was not found.'.format(profile_push_token.owner))
            raise HTTPException(status_code=HTTP_404_NOT_FOUND,
                                detail="Non existent profile")

        profile_orm.push_token = profile_push_token.push_token
        self.database.session.add(profile_orm)
        self.database.session.commit()

        return Response(status_code=201)



