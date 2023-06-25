import os
from io import BytesIO
from PIL import Image


class AvatarGenerator:
    """
    Avatar generator
    """
    FACES_PATH = 'src/assets/avatars/faces'
    ACCESSORIES_PATH = 'src/assets/avatars/accessory'
    OVERLAYS_PATH = 'src/assets/avatars/overlay'
    AVATAR_BACKGROUND = (69, 113, 78)

    def __init__(self):
        cwd = os.getcwd()

        print(f"Current working directory: {cwd}")
        self.faces = os.listdir(self.FACES_PATH)
        self.accesories = os.listdir(self.ACCESSORIES_PATH)
        self.overlays = os.listdir(self.OVERLAYS_PATH)

    def generate_default_avatar(self, user: str, res: int) -> bytes:
        """
        Generates an avatar for an user

        :param user: the username
        :param res: the resolution
        :return: the bytes of a jpg
        """
        code = hash(user)
        face_file = self.faces[code % len(self.faces)]
        code -= len(self.faces)
        acc_file = self.accesories[code % len(self.accesories)]
        code -= len(self.accesories)
        over_file = self.overlays[code % len(self.overlays)]
        face = Image.open(os.path.join(self.FACES_PATH, face_file)).convert('RGBA')
        acc = Image.open(os.path.join(self.ACCESSORIES_PATH, acc_file)).convert('RGBA')
        over = Image.open(os.path.join(self.OVERLAYS_PATH, over_file)).convert('RGBA')
        face = Image.alpha_composite(face, acc)
        face = Image.alpha_composite(face, over)
        face = face.resize((res, res))
        final = Image.new("RGB", (res, res), self.AVATAR_BACKGROUND)
        final.paste(face, (0, 0), face)

        bytesfile = BytesIO()
        final.save(bytesfile, format='jpeg')
        return bytesfile.getvalue()
