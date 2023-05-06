from typing import Optional

from fastapi import Depends, HTTPException
from fastapi_utils.cbv import cbv
from fastapi_utils.inferring_router import InferringRouter
from sqlalchemy.orm import Session
from starlette.status import HTTP_404_NOT_FOUND

from src.api_models.place import PlaceID, PlaceUpdate, PlaceInDB, PlaceBody
from src.dependencies import get_db
from src.orms.place import PlaceORM

place_router = InferringRouter()


@cbv(place_router)
class PlaceCBV:
    session: Session = Depends(get_db)

    @staticmethod
    def query_place(session: Session, place_id: PlaceID) -> Optional[PlaceORM]:
        """
        Gets a place from the database by its id
        
        :param session: the database session
        :param place_id: the item id
        :return: a place ORM or None if the id does not exist
        """
        place: Optional[PlaceORM] = session.query(PlaceORM).get(place_id)

        return place

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
                             categories=place.categories,
                             sub_categories=place.sub_categories)
        self.session.add(place_orm)
        self.session.commit()
        return PlaceInDB.from_orm(place_orm)

    @place_router.get("/place/{place_id}")
    def get_place(self, place_id: PlaceID) -> PlaceInDB:
        """
        Get a place by its id

        :param place_id: the place id to query
        :return: the place data
        """
        place_orm = self.query_place(self.session, place_id)
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
        place_orm = self.query_place(self.session, place_id)

        if place_orm is None:
            raise HTTPException(status_code=HTTP_404_NOT_FOUND)

        if not place.latitude or not place.longitude:
            place.longitude, place.latitude = self.geo_coder.forward_geocoding(place.address)

        place_orm.name = place.name
        place_orm.address = place.address
        place_orm.latitude = place.latitude
        place_orm.longitude = place.longitude
        place_orm.categories = place.categories
        place_orm.sub_categories = place.sub_categories

        self.session.add(place_orm)
        self.session.commit()
        return PlaceInDB.from_orm(place_orm)

    @place_router.patch("/place/{place_id}")
    def update_place(self, place_id: PlaceID, place: PlaceUpdate) -> PlaceInDB:
        """
        Updates a place in the database

        :param place_id: the place id
        :param place: the place data to update
        :return: the place data updated
        """
        place_orm = self.query_place(self.session, place_id)

        if place_orm is None:
            raise HTTPException(status_code=HTTP_404_NOT_FOUND)

        update_data = place.dict(exclude_unset=True)
        for k, v in update_data.items():
            place_orm.__setattr__(k, v)

        self.session.add(place_orm)
        self.session.commit()
        return PlaceInDB.from_orm(place_orm)
