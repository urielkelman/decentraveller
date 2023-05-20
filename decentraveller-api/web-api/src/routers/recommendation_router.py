from typing import Optional, List

from fastapi import Depends, HTTPException, Query
from fastapi_utils.cbv import cbv
from fastapi_utils.inferring_router import InferringRouter
from sqlalchemy import func, distinct
from sqlalchemy.orm import Session
from starlette.status import HTTP_404_NOT_FOUND

from src.api_models.place import PlaceID, PlaceInDB
from src.dependencies import get_db
from src.dependencies.vector_database import VectorDatabase
from src.orms.place import PlaceORM
from src.orms.review import ReviewORM

recommendation_router = InferringRouter()

NEAR_PLACE_DISTANCE = 0.03
MINIMUM_REVIEWS_TO_RECOMMEND = 10


@cbv(recommendation_router)
class RecommendationCBV:
    """
    Recommendations
    """
    session: Session = Depends(get_db)
    vector_database: VectorDatabase = Depends(VectorDatabase)

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

    @recommendation_router.get("/place/{place_id}/similars")
    def get_recommendation(self, place_id: PlaceID,
                           limit: int = Query(default=5)) -> List[PlaceInDB]:
        """
        Get place recommendations by another place id

        :param place_id: the place id to query
        :param limit: limit of similars
        :return: the places data
        """
        similars = []
        vector_similars = self.vector_database.get_similars_to_place(place_id, limit)
        if vector_similars:
            vector_similars = PlaceORM.query.filter(PlaceORM.id.in_(tuple(vector_similars))).all()
            similars += [PlaceInDB.from_orm(p) for p in vector_similars]
        if len(similars) < limit:
            place = self.query_place(self.session, place_id)
            if not place:
                raise HTTPException(status_code=HTTP_404_NOT_FOUND)
            nearby = self.session.query(PlaceORM). \
                filter(PlaceORM.latitude >= place.latitude - NEAR_PLACE_DISTANCE). \
                filter(PlaceORM.latitude <= place.latitude + NEAR_PLACE_DISTANCE). \
                filter(PlaceORM.longitude >= place.longitude - NEAR_PLACE_DISTANCE). \
                filter(PlaceORM.longitude <= place.longitude + NEAR_PLACE_DISTANCE). \
                filter(PlaceORM.id != place.id).subquery()
            distance_similars = self.session.query(ReviewORM.place_id). \
                join(nearby, nearby.c.id == ReviewORM.place_id). \
                group_by(ReviewORM.place_id). \
                having(func.count(distinct(ReviewORM.owner)) >= MINIMUM_REVIEWS_TO_RECOMMEND). \
                order_by(func.avg(ReviewORM.score).desc()). \
                limit(limit).subquery()
            distance_similars = self.session.query(PlaceORM). \
                join(distance_similars, distance_similars.c.place_id == PlaceORM.id).all()
            similars += [PlaceInDB.from_orm(p) for p in distance_similars]
        if similars:
            similars = similars[:limit]
            return similars
        raise HTTPException(status_code=HTTP_404_NOT_FOUND)
