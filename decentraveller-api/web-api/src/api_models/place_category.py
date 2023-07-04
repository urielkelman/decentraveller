import enum

class PlaceCategory(str, enum.Enum):
    """
    Categories for places
    """
    GASTRONOMY = "GASTRONOMY"
    ACCOMMODATION = "ACCOMMODATION"
    ENTERTAINMENT = "ENTERTAINMENT"
    OTHER = "OTHER"