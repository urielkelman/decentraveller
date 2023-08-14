from tensorflow.keras.models import Model, load_model
import os
import tarfile
from io import BytesIO
from tempfile import TemporaryDirectory
from keras.preprocessing import image
import numpy as np
from PIL import Image


class AestheticScorer:
    def __init__(self, model_path: str):
        with open(model_path, 'rb') as file:
            self.model = self.get_model_from_bytes(file.read())

    @staticmethod
    def get_model_from_bytes(data: bytes) -> Model:
        """
        Given bytes from keras model serialized with get_bytes_from_model method
        returns the model

        :param data: the model bytes
        :return: a keras model
        """
        input_tarfile = tarfile.open(fileobj=BytesIO(data))
        with TemporaryDirectory() as output_dir:
            input_tarfile.extractall(output_dir)
            model = load_model(os.path.join(output_dir, "model"), compile=False)
        return model

    def predict(self, image_bytes: bytes) -> float:
        """
        Predicts image aesthetic score

        :param image_bytes: the image bytes
        :return: a float score
        """

        img = Image.open(BytesIO(image_bytes))
        img = img.convert('RGB')
        img = img.resize((224, 224), Image.NEAREST)
        img = image.img_to_array(img)
        img = np.expand_dims(img, axis=0)
        return float(self.model.predict(img)[0][0])