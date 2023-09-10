import os

SQLALCHEMY_DATABASE_URL = os.getenv("SQLALCHEMY_DATABASE_URL")
WEAVIATE_DATABASE_URL = os.getenv("WEAVIATE_DATABASE_URL")

RECOMMENDATION_MATRIX_QUERY = """SELECT place_id, owner FROM reviews
WHERE score >= 3 AND place_id IN (SELECT place_id FROM reviews GROUP BY 1 HAVING COUNT(*) >= 3)
ORDER BY place_id"""

PLACE_ID_AND_LOCATIONS = "SELECT id, latitude, longitude FROM places"

PLACE_CLASS_NAME = "Place"

PLACE_CLASS = {
    "class": PLACE_CLASS_NAME,
    "vectorizer": "none",
    "properties": [
        {
            "name": "place_id",
            "description": "The place id",
            "dataType": ["int"]
        },
        {
            "name": "latitude",
            "description": "The place latitude",
            "dataType": ["number"],
        },
        {
            "name": "longitude",
            "description": "The place longitude",
            "dataType": ["number"],
        }
    ]
}

DEFAULT_BATCH_SIZE = 100
