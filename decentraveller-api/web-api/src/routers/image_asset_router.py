from io import BytesIO

from PIL import Image
from fastapi import Depends, HTTPException, File
from fastapi_utils.cbv import cbv
from fastapi_utils.inferring_router import InferringRouter
from starlette.status import HTTP_400_BAD_REQUEST
from typing_extensions import Annotated

from src.dependencies.ipfs_service import IPFSService, MaximumUploadSizeExceeded

image_asset_router = InferringRouter()


@cbv(image_asset_router)
class ImageAssetCBV:
    ipfs_controller: IPFSService = Depends(IPFSService)

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
        file = self.image_jpeg_compression(file)
        try:
            filehash = self.ipfs_controller.add_file(file)
        except MaximumUploadSizeExceeded:
            raise HTTPException(status_code=HTTP_400_BAD_REQUEST,
                                detail="The file is too big.")
        self.ipfs_controller.pin_file(filehash)
        return {"hash": filehash}
