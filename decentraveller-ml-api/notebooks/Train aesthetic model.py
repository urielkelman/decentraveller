# ---
# jupyter:
#   jupytext:
#     text_representation:
#       extension: .py
#       format_name: light
#       format_version: '1.5'
#       jupytext_version: 1.15.0
#   kernelspec:
#     display_name: Python 3
#     language: python
#     name: python3
# ---

# + pycharm={"name": "#%%\n"}
import pandas as pd
import matplotlib.pyplot as plt

# + pycharm={"name": "#%%\n"}
AVA_DATASET_BASE_PATH = "/mnt/z/Descargas/AVA_Dataset"
IMAGES_PATH = AVA_DATASET_BASE_PATH + "/images/images/{image_id}.jpg"

# + pycharm={"name": "#%%\n"}
images_data = pd.read_csv(AVA_DATASET_BASE_PATH + "/AVA.txt", sep=' ', header=None,
                          names=(['index', 'image_id'] + [str(i) for i in range(1, 11)] + ["tag1", "tag2", "challenge_id"])).drop(columns="index")

# + pycharm={"name": "#%%\n"}
images_data

# + pycharm={"name": "#%%\n"}
images_data['total_votes'] = images_data[[str(i) for i in range(1, 11)]].sum(axis=1)
images_data['score'] = sum(images_data[str(i)]*i/10 for i in range(1, 11))/images_data['total_votes']
images_data

# + pycharm={"name": "#%%\n"}
images_data['total_votes'].min()

# + pycharm={"name": "#%%\n"}
images_data = images_data[['image_id', 'score']]
images_data

# + pycharm={"name": "#%%\n"}
ids_to_use = []
with open(AVA_DATASET_BASE_PATH + "/aesthetics_image_lists/generic_ls_train.jpgl", "r") as file:
    for l in file:
        ids_to_use.append(l)
with open(AVA_DATASET_BASE_PATH + "/aesthetics_image_lists/generic_test.jpgl", "r") as file:
    for l in file:
        ids_to_use.append(int(l.rstrip()))
ids_to_use = set(ids_to_use)

# + pycharm={"name": "#%%\n"}
images_data = images_data[images_data['image_id'].isin(ids_to_use)]
images_data

# + pycharm={"name": "#%%\n"}
plt.hist(images_data['score'])

# + pycharm={"name": "#%%\n"}
images_data['score'].mean()

# + pycharm={"name": "#%%\n"}
(abs(images_data['score']-images_data['score'].mean())/images_data['score']).mean()

# + pycharm={"name": "#%%\n"}
images_data = images_data.sample(len(images_data))
images_data['path'] = images_data['image_id'].map(lambda x: IMAGES_PATH.format(image_id=x))
images_data['score'] = (images_data['score']>0.5).astype('int')

# + pycharm={"name": "#%%\n"}
(images_data['score']==1).mean()

# + pycharm={"name": "#%%\n"}
import pandas as pd
import numpy as np
from tensorflow import keras
import matplotlib.pyplot as plt
import matplotlib.image as mpimg
import h5py
import cv2
from tensorflow.keras.layers import Flatten, Dense, Input,concatenate, Reshape
from tensorflow.keras.layers import Conv2D, MaxPooling2D
from tensorflow.keras.layers import Activation, Dropout
from tensorflow.keras.models import Model
from tensorflow.keras.models import Sequential
from tensorflow.keras.applications.vgg16 import VGG16
from tensorflow.keras.applications.mobilenet import preprocess_input
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.callbacks import EarlyStopping

import tensorflow as tf

# + pycharm={"name": "#%%\n"}
mobilenet = keras.applications.mobilenet.MobileNet()

# + pycharm={"name": "#%%\n"}
mobilenet.summary()

# + pycharm={"name": "#%%\n"}
outencoder = mobilenet.layers[-6].output

# + pycharm={"name": "#%%\n"}
encoder = Model(inputs=mobilenet.input, outputs=outencoder)
encoder.trainable = False

# + pycharm={"name": "#%%\n"}
input_regressor = encoder(mobilenet.input)

dense1 = Dense(256, activation='tanh')(input_regressor)
regressor = Dense(1, activation='sigmoid')(dense1)

final_model = Model(inputs=mobilenet.input, outputs=regressor)

# + pycharm={"name": "#%%\n"}
final_model.summary()

# + pycharm={"name": "#%%\n"}
BATCH_SIZE = 64

# + pycharm={"name": "#%%\n"}
from keras import backend as K

def earth_mover_distance(**kwargs):
    """
    Wrapper for earth_mover distance for unified interface with self-guided earth mover distance loss.
    """
    def _earth_mover_distance(
            y_true: K.placeholder,
            y_pred: K.placeholder
    ) -> K.placeholder:
        y_true = tf.cast(y_true, tf.float32)
        return tf.reduce_mean(tf.square(tf.cumsum(y_true, axis=-1) - tf.cumsum(y_pred, axis=-1)), axis=-1)

    return _earth_mover_distance


# + pycharm={"name": "#%%\n"}
train_generator = ImageDataGenerator(width_shift_range=0.15, 
                                     height_shift_range=0.15,
                                     horizontal_flip=False, 
                                     vertical_flip=False,
                                     zoom_range=0,
                                     validation_split=0.15,
                                     preprocessing_function=preprocess_input)

test_generator = ImageDataGenerator(preprocessing_function=preprocess_input) 

traingen = train_generator.flow_from_dataframe(images_data,
                                               x_col='path',
                                               y_col='score',
                                               target_size=(224, 224),
                                               class_mode='raw',
                                               subset='training',
                                               batch_size=BATCH_SIZE, 
                                               shuffle=True,
                                               seed=42)

validgen = train_generator.flow_from_dataframe(images_data,
                                               x_col='path',
                                               y_col='score',
                                               target_size=(224, 224),
                                               class_mode='raw',
                                               subset='validation',
                                               batch_size=BATCH_SIZE,
                                               shuffle=True,
                                               seed=42)

# + pycharm={"name": "#%%\n"}
final_model.compile(optimizer=Adam(0.0005), loss=earth_mover_distance(), metrics=['accuracy', tf.keras.metrics.AUC()])
early_stop = EarlyStopping(monitor='val_accuracy',
                           patience=6,
                           restore_best_weights=True,
                           mode='max')

# + pycharm={"name": "#%%\n"}
final_model.compile(optimizer=Adam(0.0005), loss=earth_mover_distance(), metrics=['accuracy', tf.keras.metrics.AUC()])
early_stop = EarlyStopping(monitor='val_accuracy',
                           patience=6,
                           restore_best_weights=True,
                           mode='max')

# + pycharm={"name": "#%%\n"}
from PIL import ImageFile
ImageFile.LOAD_TRUNCATED_IMAGES = True

hist = final_model.fit(traingen,
                     batch_size=BATCH_SIZE,
                     epochs=40,
                     validation_data=validgen,
                     steps_per_epoch=traingen.samples // BATCH_SIZE,
                     validation_steps=validgen.samples // BATCH_SIZE,
                     callbacks=[early_stop])

# + pycharm={"name": "#%%\n"}
import os
import pickle
import tarfile
from abc import abstractmethod, ABC
from io import BytesIO
from tempfile import NamedTemporaryFile, TemporaryDirectory
from typing import Iterator, NamedTuple, Optional, overload, cast, List, Tuple, Union

def get_bytes_from_model(model: Model) -> bytes:
    model_path = TemporaryDirectory()

    model.save(model_path.name)
    with NamedTemporaryFile() as tar_temp_file:
        with tarfile.open(tar_temp_file.name, mode="w:gz") as archive:
            archive.add(model_path.name, arcname="model")

        model_path.cleanup()
        with open(tar_temp_file.name, "rb") as model_tarfile:
            model_bytes = model_tarfile.read()
    model_path.cleanup()
    return model_bytes


# + pycharm={"name": "#%%\n"}
model_bytes = get_bytes_from_model(final_model)

# + pycharm={"name": "#%%\n"}
with open('../web-api/beauty_model.model', 'wb') as file:
    file.write(model_bytes)

# + pycharm={"name": "#%%\n"}

