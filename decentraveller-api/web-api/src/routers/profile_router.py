from fastapi import Depends, HTTPException, Query, Response, File
from typing_extensions import Annotated
from fastapi_utils.cbv import cbv
from fastapi_utils.inferring_router import InferringRouter
from sqlalchemy.exc import IntegrityError
from starlette.status import HTTP_400_BAD_REQUEST, HTTP_404_NOT_FOUND

from src.api_models.profile import ProfileInDB, ProfileBody, WalletID, wallet_id_validator
from src.dependencies.avatar_generator import AvatarGenerator
from src.dependencies.ipfs_controller import IPFSController, MaximumUploadSizeExceeded
from src.dependencies.relational_database import build_relational_database, RelationalDatabase
from src.orms.profile import ProfileORM
from io import BytesIO
from PIL import Image

profile_router = InferringRouter()


@cbv(profile_router)
class ProfileCBV:
    database: RelationalDatabase = Depends(build_relational_database)
    avatar_generator: AvatarGenerator = Depends(AvatarGenerator)
    ipfs_controller: IPFSController = Depends(IPFSController)

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

        if not profile.ipfs_hash:
            return Response(content=self.avatar_generator.generate_default_avatar(profile.owner, res),
                            media_type="image/jpeg")
        else:
            try:
                return Response(content=self.ipfs_controller.get_file(profile.ipfs_hash),
                                media_type="image/jpeg")
            except FileNotFoundError:
                raise HTTPException(status_code=HTTP_404_NOT_FOUND)

    @staticmethod
    def resize_image_squared(image: bytes) -> bytes:
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
        file = self.resize_image_squared(file)
        try:
            filehash = self.ipfs_controller.add_file(file)
        except MaximumUploadSizeExceeded:
            raise HTTPException(status_code=HTTP_400_BAD_REQUEST,
                                detail="The file is too big.")
        self.ipfs_controller.pin_file(filehash)
        profile.ipfs_hash = filehash
        self.database.session.add(profile)
        self.database.session.commit()
        return ProfileInDB.from_orm(profile)

    @profile_router.post("/profile", status_code=201)
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
