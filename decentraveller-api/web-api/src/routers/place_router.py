from fastapi import Depends, HTTPException
from fastapi_utils.cbv import cbv
from fastapi_utils.inferring_router import InferringRouter
from sqlalchemy.exc import IntegrityError
from starlette.status import HTTP_404_NOT_FOUND, HTTP_400_BAD_REQUEST

from src.api_models.place import PlaceID, PlaceUpdate, PlaceInDB, PlaceBody
from src.orms.place import PlaceORM
from src.dependencies.vector_database import VectorDatabase
from src.dependencies.relational_database import RelationalDatabase

place_router = InferringRouter()


@cbv(place_router)
class PlaceCBV:
    database: RelationalDatabase = Depends(RelationalDatabase)
    vector_database: VectorDatabase = Depends(VectorDatabase)

    @place_router.post("/place", status_code=201)
    def create_place(self, place: PlaceInDB) -> PlaceInDB:
        """
        Creates a new place in the database

        :param place: the place data for creation
        :param geo_coder: geo coder api object
        :return: the place data
        """
        place_orm = PlaceORM(id=place.id, name=place.name, address=place.address,
                             latitude=place.latitude, longitude=place.longitude,
                             category=place.category)
        self.database.session.add(place_orm)
        try:
            self.database.session.commit()
        except IntegrityError:
            raise HTTPException(status_code=HTTP_400_BAD_REQUEST,
                                detail="The place id is already on the database.")
        return PlaceInDB.from_orm(place_orm)

    @place_router.get("/place/{place_id}")
    def get_place(self, place_id: PlaceID) -> PlaceInDB:
        """
        Get a place by its id

        :param place_id: the place id to query
        :return: the place data
        """
        place_orm = self.database.query_place(place_id)
        if place_orm is None:
            raise HTTPException(status_code=HTTP_404_NOT_FOUND)
        return PlaceInDB.from_orm(place_orm)

    @place_router.put("/place/{place_id}")
    def overwrite_place(self, place_id: PlaceID, place: PlaceBody) -> PlaceInDB:
        """
        Overwrites a place in the database

        :param place_id: the place id
        :param place: the place data to update
        :return: the place data updated
        """
        place_orm = self.database.query_place(place_id)

        if place_orm is None:
            raise HTTPException(status_code=HTTP_404_NOT_FOUND)

        if not place.latitude or not place.longitude:
            place.longitude, place.latitude = self.geo_coder.forward_geocoding(place.address)

        place_orm.name = place.name
        place_orm.address = place.address
        place_orm.latitude = place.latitude
        place_orm.longitude = place.longitude
        place_orm.categories = place.category

        self.database.session.add(place_orm)
        self.database.session.commit()
        return PlaceInDB.from_orm(place_orm)

    @place_router.patch("/place/{place_id}")
    def update_place(self, place_id: PlaceID, place: PlaceUpdate) -> PlaceInDB:
        """
        Updates a place in the database

        :param place_id: the place id
        :param place: the place data to update
        :return: the place data updated
        """
        place_orm = self.database.query_place(place_id)

        if place_orm is None:
            raise HTTPException(status_code=HTTP_404_NOT_FOUND)

        update_data = place.dict(exclude_unset=True)
        for k, v in update_data.items():
            place_orm.__setattr__(k, v)

        self.database.session.add(place_orm)
        self.database.session.commit()
        return PlaceInDB.from_orm(place_orm)
