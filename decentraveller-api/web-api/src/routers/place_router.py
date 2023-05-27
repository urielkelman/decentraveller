from fastapi import Depends, HTTPException
from fastapi_utils.cbv import cbv
from fastapi_utils.inferring_router import InferringRouter
from sqlalchemy.exc import IntegrityError
from starlette.status import HTTP_404_NOT_FOUND, HTTP_400_BAD_REQUEST

from src.api_models.place import PlaceID, PlaceUpdate, PlaceInDB, PlaceBody, PlaceWithStats
from src.dependencies.vector_database import VectorDatabase
from src.dependencies.relational_database import RelationalDatabase

place_router = InferringRouter()


@cbv(place_router)
class PlaceCBV:
    database: RelationalDatabase = Depends(RelationalDatabase)
    vector_database: VectorDatabase = Depends(VectorDatabase)

    @place_router.post("/place", status_code=201)
    def create_place(self, place: PlaceInDB) -> PlaceWithStats:
        """
        Creates a new place in the database

        :param place: the place data for creation
        :return: the place data
        """
        try:
            place = self.database.add_place(place)
        except IntegrityError:
            raise HTTPException(status_code=HTTP_400_BAD_REQUEST,
                                detail="The place id is already on the database.")
        return place

    @place_router.get("/place/{place_id}")
    def get_place(self, place_id: PlaceID) -> PlaceWithStats:
        """
        Get a place by its id

        :param place_id: the place id to query
        :return: the place data
        """
        place = self.database.query_places(place_id)
        if place is None:
            raise HTTPException(status_code=HTTP_404_NOT_FOUND)
        return place

    @place_router.put("/place/{place_id}")
    def overwrite_place(self, place_id: PlaceID, place: PlaceBody) -> PlaceWithStats:
        """
        Overwrites a place in the database

        :param place_id: the place id
        :param place: the place data to update
        :return: the place data updated
        """
        place = self.database.update_place(place_id, place.dict())
        if not place:
            raise HTTPException(status_code=HTTP_404_NOT_FOUND)
        return place

    @place_router.patch("/place/{place_id}")
    def update_place(self, place_id: PlaceID, place: PlaceUpdate) -> PlaceWithStats:
        """
        Updates a place in the database

        :param place_id: the place id
        :param place: the place data to update
        :return: the place data updated
        """

        place = self.database.update_place(place_id,
                                           place.dict(exclude_unset=True))
        if not place:
            raise HTTPException(status_code=HTTP_404_NOT_FOUND)
        return place
