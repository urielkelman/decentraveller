from io import BytesIO

from PIL import Image
from fastapi import Depends, HTTPException, File
from fastapi_utils.cbv import cbv
from fastapi_utils.inferring_router import InferringRouter
from starlette.status import HTTP_400_BAD_REQUEST
from typing_extensions import Annotated

from src.dependencies.ipfs_service import IPFSService, MaximumUploadSizeExceeded
from src.dependencies.ml_services import MLServices
from src.dependencies.relational_database import build_relational_database, RelationalDatabase

image_asset_router = InferringRouter()


@cbv(image_asset_router)
class ImageAssetCBV:
    database: RelationalDatabase = Depends(build_relational_database)
    ipfs_service: IPFSService = Depends(IPFSService)
    ml_services: MLServices = Depends(MLServices)

    @staticmethod
    def image_jpeg_compression(image: bytes) -> bytes:
        """
        Compresses an image and make its jpg
        :param image: the image bytes
        :return: the new image bytes
        """
        image = Image.open(BytesIO(image)).convert('RGBA')
        final = Image.new("RGB", image.size, (255, 255, 255))
        final.paste(image, (0, 0), image)

        bytesfile = BytesIO()
        final.save(bytesfile, format='jpeg', optimize=True, quality=95)
        return bytesfile.getvalue()

    @image_asset_router.post("/upload")
    def upload_image(self, file: Annotated[bytes, File()]):
        """
        Uploads an image

        :param file: uploaded file
        """
        compressed_file = self.image_jpeg_compression(file)
        try:
            filehash = self.ipfs_service.add_file(compressed_file)
        except MaximumUploadSizeExceeded:
            raise HTTPException(status_code=HTTP_400_BAD_REQUEST,
                                detail="The file is too big.")
        self.database.add_image(filehash,
                                score=self.ml_services.aesthetic_score(file))
        return {"hash": filehash}
