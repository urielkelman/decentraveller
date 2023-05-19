import pandas as pd
from config import *
from sqlalchemy import create_engine
import weaviate
import numpy as np
from scipy import sparse
from sklearn.decomposition import TruncatedSVD

engine = create_engine(SQLALCHEMY_DATABASE_URL)

arr = pd.read_sql_query(RECOMMENDATION_MATRIX_QUERY, con=engine)
arr = arr.apply(lambda s:s.astype("category"))
place_ids = arr.place_id.cat.categories
arr = sparse.coo_matrix((np.ones(arr.shape[0]),
    (arr.place_id.cat.codes, arr.owner.cat.codes)))
arr = TruncatedSVD(n_components=min(100, arr.shape[1])).fit_transform(arr)

place_locations = pd.read_sql_query(PLACE_ID_AND_LOCATIONS, con=engine)
place_locations.set_index('id', drop=True, inplace=True)
place_locations = place_locations.to_dict(orient='index')

client = weaviate.Client(WEAVIATE_DATABASE_URL)
client.schema.get()
try:
    client.schema.delete_class(PLACE_CLASS_NAME)
except Exception:
    pass
client.schema.create_class(PLACE_CLASS)

with client.batch as batch:
    batch.batch_size = DEFAULT_BATCH_SIZE
    batch.dynamic = True
    for i in range(len(place_ids)):
        data_obj = {"place_id": int(place_ids[i]),
                    "latitude": place_locations[place_ids[i]]["latitude"],
                    "longitude": place_locations[place_ids[i]]["longitude"]}
        batch.add_data_object(
            data_obj,
            PLACE_CLASS_NAME,
            vector=arr[i].flatten().tolist(),
            uuid=weaviate.util.generate_uuid5(place_ids[i])
        )