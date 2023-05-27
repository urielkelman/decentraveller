from typing import Optional, List

from fastapi import Depends, HTTPException, Query
from fastapi_utils.cbv import cbv
from fastapi_utils.inferring_router import InferringRouter
from sqlalchemy import func, distinct, not_
from starlette.status import HTTP_404_NOT_FOUND

from src.api_models.place import PlaceID, PlaceInDB, PlaceWithStats
from src.dependencies.relational_database import RelationalDatabase
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
    database: RelationalDatabase = Depends(RelationalDatabase)
    vector_database: VectorDatabase = Depends(VectorDatabase)

    @staticmethod
    def get_good_nearby_places(database: RelationalDatabase,
                               latitude: float, longitude: float,
                               degree_distance: float, excluded_place_ids: List[PlaceID],
                               limit: int = 5) -> List[PlaceWithStats]:
        """
        Get good nearby places to a location

        :param database: the database
        :param latitude: the latitude
        :param longitude: the longitude
        :param degree_distance: admitted degree distance to consider nearby
        :param excluded_place_ids: place ids excluded from recommendation
        :param limit: the limit of recommendations
        :return: a list of places
        """
        nearby = database.session.query(PlaceORM). \
            filter(PlaceORM.latitude >= latitude - degree_distance). \
            filter(PlaceORM.latitude <= latitude + degree_distance). \
            filter(PlaceORM.longitude >= longitude - degree_distance). \
            filter(PlaceORM.longitude <= longitude + degree_distance). \
            filter(not_(PlaceORM.id.in_(excluded_place_ids))).subquery()
        distance_similars = database.session.query(ReviewORM.place_id). \
            join(nearby, nearby.c.id == ReviewORM.place_id). \
            group_by(ReviewORM.place_id). \
            having(func.count(distinct(ReviewORM.owner)) >= MINIMUM_REVIEWS_TO_RECOMMEND). \
            order_by((func.avg(ReviewORM.score) * func.log(func.count(distinct(ReviewORM.owner)))).desc()). \
            limit(limit).subquery()
        distance_similars = database.session.query(PlaceORM.id). \
            join(distance_similars, distance_similars.c.place_id == PlaceORM.id).all()
        distance_similars = [t[0] for t in distance_similars]
        similars = database.query_places(distance_similars)
        if similars:
            return similars[:limit]

    @staticmethod
    def get_similars_to_place(database: RelationalDatabase,
                              vector_database: VectorDatabase,
                              place_id: PlaceID, limit: int = 5) -> List[PlaceWithStats]:
        """
        Get similars to a place id

        :param database: the database
        :param vector_database: the vector database
        :param place_id: the place id
        :param limit: the limit of recommendations
        :return: a list of places
        """
        similars = []
        vector_similars = vector_database.get_similars_to_place(place_id, limit)
        if vector_similars:
            similars += database.query_places(vector_similars)
        if len(similars) < limit:
            place = database.query_places(place_id)
            if not place:
                raise HTTPException(status_code=HTTP_404_NOT_FOUND)
            distance_similars = RecommendationCBV.get_good_nearby_places(database, place.latitude,
                                                                         place.longitude, NEAR_PLACE_DISTANCE,
                                                                         [place_id], limit)
            if distance_similars:
                similars += distance_similars
        if similars:
            similars = similars[:limit]
            return similars

    @staticmethod
    def get_best_places(database: RelationalDatabase,
                        excluded_place_ids: List[PlaceID],
                        limit: int = 5) -> List[PlaceWithStats]:
        """
        Get the best places of the whole site

        :param database: the database
        :param excluded_place_ids: the place ids to exclude
        :param limit: the limit to query
        :return: the best places
        """
        best_places = database.session.query(ReviewORM.place_id). \
            filter(not_(ReviewORM.place_id.in_(excluded_place_ids))). \
            group_by(ReviewORM.place_id). \
            order_by((func.avg(ReviewORM.score) * func.log(func.count(distinct(ReviewORM.owner)))).desc()). \
            limit(limit).all()
        best_places = [t[0] for t in best_places]
        best_places = database.query_places(best_places)
        return best_places

    @recommendation_router.get("/place/{place_id}/similars")
    def get_place_similars(self, place_id: PlaceID,
                           limit: int = Query(default=5)) -> List[PlaceWithStats]:
        """
        Get place recommendations by another place id

        :param place_id: the place id to query
        :param limit: limit of similars
        :return: the places data
        """
        similars = self.get_similars_to_place(self.database, self.vector_database,
                                              place_id, limit)
        if similars:
            return similars
        raise HTTPException(status_code=HTTP_404_NOT_FOUND)

    @recommendation_router.get("/profile/{owner}/recommendations")
    def get_profile_recommendation(self, owner: str,
                                   limit: int = Query(default=20),
                                   latitude: Optional[float] = Query(default=None),
                                   longitude: Optional[float] = Query(default=None)) -> List[PlaceWithStats]:
        """
        Get profile recommendations base on the last places liked

        :param owner: the owner of the profile
        :param limit: the limit of results
        :param latitude: latitude of the user, if provided used to recommend
        :param longitude: longitude of the user, if provided used to recommend
        :return: the places data
        """
        last_places = self.database.session.query(ReviewORM.place_id). \
            filter(ReviewORM.owner == owner).order_by(ReviewORM.id.desc()). \
            limit(LAST_VISITED_PLACES_TO_CONSIDER).all()
        last_places = [l[0] for l in last_places]
        nearby = None
        if latitude and longitude:
            nearby = self.get_good_nearby_places(self.database, latitude, longitude,
                                                 NEAR_PLACE_DISTANCE, last_places, limit)
        place_similars = []
        for place_id in last_places[:LAST_VISITED_PLACES_TO_QUERY_SIMILARS]:
            place_similars.append(self.get_similars_to_place(self.database, self.vector_database,
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
            best_places = self.get_best_places(self.database,
                                               list(places_to_avoid),
                                               limit - len(result))
            result += best_places

        if result:
            return result

        raise HTTPException(status_code=HTTP_404_NOT_FOUND)

    @recommendation_router.get("/recommendations")
    def get_home_recommendation(self,
                                limit: int = Query(default=20),
                                latitude: Optional[float] = Query(default=None),
                                longitude: Optional[float] = Query(default=None)) -> List[PlaceWithStats]:
        """
        Get profile recommendations based on the location

        :param limit: the limit of results
        :param latitude: latitude of the user, if provided used to recommend
        :param longitude: longitude of the user, if provided used to recommend
        :return: the places data
        """
        result = []
        places_to_avoid = set()
        if latitude and longitude:
            nearby = self.get_good_nearby_places(self.database, latitude, longitude,
                                                  NEAR_PLACE_DISTANCE, [], limit)
            if nearby:
                result += [p for p in nearby[:limit - len(result)]]
                places_to_avoid.update([r.id for r in result])

        if len(result) < limit:
            best_places = self.get_best_places(self.database,
                                               list(places_to_avoid),
                                               limit - len(result))
            result += best_places

        if result:
            return result

        raise HTTPException(status_code=HTTP_404_NOT_FOUND)
