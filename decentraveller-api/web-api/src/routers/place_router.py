from typing import Optional

from fastapi import Depends, HTTPException, Query, Response
from fastapi_utils.cbv import cbv
from fastapi_utils.inferring_router import InferringRouter
from sqlalchemy import func, distinct, desc, asc, text
from sqlalchemy.exc import IntegrityError
from starlette.status import HTTP_404_NOT_FOUND, HTTP_400_BAD_REQUEST

from src.api_models.bulk_results import PaginatedPlaces, PaginatedPlacesWithDistance
from src.api_models.place import PlaceID, PlaceUpdate, PlaceInDB, PlaceBody, \
    PlaceWithStats, PlaceWithDistance, PlaceCategory
from src.api_models.profile import WalletID, wallet_id_validator
from src.dependencies.indexer_auth import indexer_auth
from src.dependencies.relational_database import build_relational_database, RelationalDatabase
from src.dependencies.vector_database import VectorDatabase
from src.dependencies.ipfs_service import IPFSService
from src.orms.place import PlaceORM
from src.orms.review import ReviewORM
from io import BytesIO
from PIL import Image

place_router = InferringRouter()

with open('src/assets/no_place_image.jpg', 'rb') as file:
    DEFAULT_PLACE_IMAGE = file.read()


@cbv(place_router)
class PlaceCBV:
    database: RelationalDatabase = Depends(build_relational_database)
    vector_database: VectorDatabase = Depends(VectorDatabase)
    ipfs_service: IPFSService = Depends(IPFSService)

    @place_router.post("/place", status_code=201, dependencies=[Depends(indexer_auth)])
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
                                detail="The place id is already on the database or the profile does not exist.")
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

    @place_router.put("/place/{place_id}", dependencies=[Depends(indexer_auth)])
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

    @place_router.patch("/place/{place_id}", dependencies=[Depends(indexer_auth)])
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

    @place_router.get("/profile/{owner}/places")
    def get_places_by_profile(self, per_page: int, page: int,
                              owner: WalletID = Depends(wallet_id_validator)) -> PaginatedPlaces:
        """
        Gets a user places paginated

        :param owner: the profile
        :param per_page: items per page
        :param page: number of page
        :return: the places data
        """

        places = self.database.query_places_by_profile(owner, page, per_page)
        if not places.places:
            raise HTTPException(status_code=HTTP_404_NOT_FOUND)
        return places

    @place_router.get("/places/search")
    def search_places(self,
                      page: int = Query(default=0),
                      per_page: int = Query(default=20),
                      latitude: Optional[float] = Query(default=None),
                      longitude: Optional[float] = Query(default=None),
                      at_least_stars: Optional[float] = Query(default=None),
                      maximum_distance: Optional[float] = Query(default=None),
                      place_category: Optional[PlaceCategory] = Query(default=None),
                      sort_by: Optional[str] = Query(default="relevancy")) \
            -> PaginatedPlacesWithDistance:
        """
        Search places by multiple criteria

        :param page: the page
        :param per_page: per page results
        :param latitude: the latitude (optional)
        :param longitude: the longitude (optional)
        :param at_least_stars: minimum mean stars filter (optional)
        :param maximum_distance: maximum distance filter. Ignored if latitude and longitude not provided (optional)
        :param place_category: place type to query (optional)
        :param sort_by: default is relevancy (optional). Possible options: relevancy, score, distance, reviews
        :return: the places data
        """
        located_query = latitude is not None and longitude is not None
        if located_query:
            places = self.database.session.query(PlaceORM, func.avg(ReviewORM.score).label("score"),
                                                 func.count(ReviewORM.id).label("reviews"),
                                                 RelationalDatabase.km_distance_query_func(PlaceORM.latitude,
                                                                                           PlaceORM.longitude,
                                                                                           latitude, longitude).
                                                 label("distance"))
        else:
            places = self.database.session.query(PlaceORM, func.avg(ReviewORM.score).label("score"),
                                                 func.count(ReviewORM.id).label("reviews"))
        places = places.join(ReviewORM, ReviewORM.place_id == PlaceORM.id, isouter=True).\
            group_by(PlaceORM.id)
        if place_category is not None:
            places = places.filter(PlaceORM.category == place_category)
        if at_least_stars:
            places = places.filter(text(f"score >={at_least_stars}"))
        if maximum_distance is not None and located_query:
            if not located_query:
                raise HTTPException(status_code=HTTP_400_BAD_REQUEST,
                                    detail=f"Can't filter by distance if latitude and longitude is not provided")
            places = places.filter(text(f"distance <={maximum_distance}"))
        if sort_by == "relevancy":
            places = places.order_by((self.database.relevancy_score(
                func.avg(ReviewORM.score), func.count(distinct(ReviewORM.owner)))).desc())
        elif sort_by == "score":
            places = places.order_by(desc("score"))
        elif sort_by == "distance":
            if not located_query:
                raise HTTPException(status_code=HTTP_400_BAD_REQUEST,
                                    detail=f"Can't sort by distance if latitude and longitude is not provided")
            places = places.order_by(asc("distance"))
        elif sort_by == "reviews":
            places = places.order_by(desc("reviews"))
        else:
            raise HTTPException(status_code=HTTP_400_BAD_REQUEST,
                                detail=f"sort_by parameter does not accept the value: {sort_by}")
        places.order_by(PlaceORM.id.desc())
        total_count = places.count()
        places = places.limit(per_page).offset(page * per_page).all()

        if places:
            places = [PlaceWithDistance(**PlaceInDB.from_orm(p[0]).dict(),
                                        score=p[1], reviews=p[2],
                                        km_distance=p[3] if located_query else None)
                      for p in places]
            return PaginatedPlacesWithDistance(places=places, total=total_count,
                                               page=per_page, per_page=per_page)
        else:
            raise HTTPException(status_code=HTTP_404_NOT_FOUND)

    @staticmethod
    def resize_image(image: bytes, maxsize: int) -> bytes:
        """
        Resizes an image keeping relative size
        :param image: the image bytes
        :param maxsize: new size of the image
        :return: the new image bytes
        """
        image = Image.open(BytesIO(image))
        if image.size[0] >= image.size[1]:
            ratio = image.size[1]/image.size[0]
            image = image.resize((maxsize, int(ratio * maxsize))).convert('RGBA')
        else:
            ratio = image.size[0] / image.size[1]
            image = image.resize((int(ratio * maxsize), maxsize)).convert('RGBA')
        final = Image.new("RGB", image.size, (255, 255, 255))
        final.paste(image, (0, 0), image)

        bytesfile = BytesIO()
        final.save(bytesfile, format='jpeg', optimize=True, quality=95)
        return bytesfile.getvalue()

    @place_router.get("/place/{place_id}/image.jpg")
    def get_place_image(self, place_id: PlaceID):
        """
        Get a place image by its id

        :param place_id: the place id
        :return: the image or 404 if there is no image
        """
        image_hash = self.database.get_place_image_hash(place_id)
        if image_hash is None:
            return Response(content=DEFAULT_PLACE_IMAGE,
                            media_type="image/jpeg")
        image_bytes = self.ipfs_service.get_file(image_hash)
        return Response(content=image_bytes,
                        media_type="image/jpeg")

    @place_router.get("/place/{place_id}/thumbnail.jpg")
    def get_place_thumbail(self, place_id: PlaceID):
        """
        Get a place image by its id

        :param place_id: the place id
        :return: the image or 404 if there is no image
        """
        image_hash = self.database.get_place_image_hash(place_id)
        if image_hash is None:
            image_bytes = self.resize_image(DEFAULT_PLACE_IMAGE, 256)
            return Response(content=image_bytes,
                            media_type="image/jpeg")
        image_bytes = self.ipfs_service.get_file(image_hash)
        image_bytes = self.resize_image(image_bytes, 256)
        return Response(content=image_bytes,
                        media_type="image/jpeg")