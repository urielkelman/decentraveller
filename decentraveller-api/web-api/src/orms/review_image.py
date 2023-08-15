from sqlalchemy import Column, ForeignKey, ForeignKeyConstraint, Integer

from src.orms import Base


class ReviewImageORM(Base):
    """
    Review image object-relational mapping
    """
    __tablename__ = "review_images"

    hash = Column(ForeignKey("images.hash"), primary_key=True)
    review_id = Column(Integer, primary_key=True)
    place_id = Column(Integer, primary_key=True)
    __table_args__ = (ForeignKeyConstraint(["review_id", "place_id"],
                                           ["reviews.id", "reviews.place_id"]),
                      {})
