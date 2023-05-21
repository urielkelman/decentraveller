from typing import Optional, List

from fastapi import Depends, HTTPException, Query
from fastapi_utils.cbv import cbv
from fastapi_utils.inferring_router import InferringRouter
from sqlalchemy import func, distinct, not_
from sqlalchemy.orm import Session
from starlette.status import HTTP_404_NOT_FOUND

from src.api_models.place import PlaceID, PlaceInDB
from src.dependencies import get_db
from src.dependencies.vector_database import VectorDatabase
from src.orms.place import PlaceORM
from src.orms.review import ReviewORM

recommendation_router = InferringRouter()

NEAR_PLACE_DISTANCE = 0.03
MINIMUM_REVIEWS_TO_RECOMMEND = 4
LAST_VISITED_PLACES_TO_QUERY_SIMILARS = 5
LAST_VISITED_PLACES_TO_CONSIDER = 1000


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

    @staticmethod
    def get_good_nearby_places(session: Session, latitude: float, longitude: float,
                               degree_distance: float, excluded_place_ids: List[PlaceID],
                               limit: int = 5) -> List[PlaceInDB]:
        """
        Get good nearby places to a location

        :param session: the database
        :param latitude: the latitude
        :param longitude: the longitude
        :param degree_distance: admitted degree distance to consider nearby
        :param excluded_place_ids: place ids excluded from recommendation
        :param limit: the limit of recommendations
        :return: a list of places
        """
        nearby = session.query(PlaceORM). \
            filter(PlaceORM.latitude >= latitude - degree_distance). \
            filter(PlaceORM.latitude <= latitude + degree_distance). \
            filter(PlaceORM.longitude >= longitude - degree_distance). \
            filter(PlaceORM.longitude <= longitude + degree_distance). \
            filter(not_(PlaceORM.id.in_(tuple(excluded_place_ids)))).subquery()
        distance_similars = session.query(ReviewORM.place_id). \
            join(nearby, nearby.c.id == ReviewORM.place_id). \
            group_by(ReviewORM.place_id). \
            having(func.count(distinct(ReviewORM.owner)) >= MINIMUM_REVIEWS_TO_RECOMMEND). \
            order_by((func.avg(ReviewORM.score) * func.log(func.count(distinct(ReviewORM.owner)))).desc()). \
            limit(limit).subquery()
        distance_similars = session.query(PlaceORM). \
            join(distance_similars, distance_similars.c.place_id == PlaceORM.id).all()
        similars = [PlaceInDB.from_orm(p) for p in distance_similars]
        if similars:
            return similars[:limit]

    @staticmethod
    def get_similars_to_place(session: Session, vector_database: VectorDatabase,
                              place_id: PlaceID, limit: int = 5) -> List[PlaceInDB]:
        """
        Get similars to a place id

        :param session: the database
        :param vector_database: the vector database
        :param place_id: the place id
        :param limit: the limit of recommendations
        :return: a list of places
        """
        similars = []
        vector_similars = vector_database.get_similars_to_place(place_id, limit)
        if vector_similars:
            vector_similars = session.query(PlaceORM).filter(PlaceORM.id.in_(tuple(vector_similars))).all()
            similars += [PlaceInDB.from_orm(p) for p in vector_similars]
        if len(similars) < limit:
            place = RecommendationCBV.query_place(session, place_id)
            if not place:
                raise HTTPException(status_code=HTTP_404_NOT_FOUND)
            distance_similars = RecommendationCBV.get_good_nearby_places(session, place.latitude,
                                                                         place.longitude, NEAR_PLACE_DISTANCE,
                                                                         [place_id], limit)
            if distance_similars:
                similars += distance_similars
        if similars:
            similars = similars[:limit]
            return similars

    @recommendation_router.get("/place/{place_id}/similars")
    def get_place_similars(self, place_id: PlaceID,
                           limit: int = Query(default=5)) -> List[PlaceInDB]:
        """
        Get place recommendations by another place id

        :param place_id: the place id to query
        :param limit: limit of similars
        :return: the places data
        """
        similars = self.get_similars_to_place(self.session, self.vector_database,
                                              place_id, limit)
        if similars:
            return similars
        raise HTTPException(status_code=HTTP_404_NOT_FOUND)

    @recommendation_router.get("/profile/{owner}/recommendations")
    def get_profile_recommendation(self, owner: str,
                                   limit: int = Query(default=20),
                                   latitude: Optional[float] = Query(default=None),
                                   longitude: Optional[float] = Query(default=None)) -> List[PlaceInDB]:
        """
        Get profile recommendations base on the last places liked

        :param owner: the owner of the profile
        :param limit: the limit of results
        :param latitude: latitude of the user, if provided used to recommend
        :param longitude: longitude of the user, if provided used to recommend
        :return: the places data
        """
        last_places = self.session.query(ReviewORM.place_id). \
            filter(ReviewORM.owner == owner).order_by(ReviewORM.id.desc()). \
            limit(LAST_VISITED_PLACES_TO_CONSIDER).all()
        last_places = [l[0] for l in last_places]
        nearby = None
        if latitude and longitude:
            nearby = self.get_good_nearby_places(self.session, latitude, longitude,
                                                 NEAR_PLACE_DISTANCE, last_places, limit)
        place_similars = []
        for place_id in last_places[:LAST_VISITED_PLACES_TO_QUERY_SIMILARS]:
            place_similars.append(self.get_similars_to_place(self.session, self.vector_database,
                                                         place_id,
                                                         2 * (limit // LAST_VISITED_PLACES_TO_QUERY_SIMILARS)))
        result = []
        places_to_avoid = set(last_places)
        if place_similars:
            place_similars = [[p for p in sims if p.id not in places_to_avoid]
                               for sims in place_similars]
            while len(result) < limit and all(len(sims) > 0
                                              for sims in place_similars):
                for sims in place_similars:
                    if sims:
                        result.append(sims.pop(0))

        if len(result) < limit and nearby:
            result += [p for p in nearby[:limit - len(result)]]
            places_to_avoid.update([r.id for r in result])

        if len(result) < limit:
            best_places = self.session.query(ReviewORM.place_id). \
                filter(not_(ReviewORM.place_id.in_(list(places_to_avoid)))).\
                group_by(ReviewORM.place_id). \
                order_by((func.avg(ReviewORM.score) * func.log(func.count(distinct(ReviewORM.owner)))).desc()).\
                limit(limit - len(result))
            best_places = [PlaceInDB.from_orm(self.query_place(self.session, i))
                           for i in best_places]
            result += best_places

        if result:
            return result

        raise HTTPException(status_code=HTTP_404_NOT_FOUND)
