import enum

class ProfileRole(str, enum.Enum):
    """
    Roles for profiles.
    """
    NORMAL = "NORMAL"
    MODERATOR = "MODERATOR"
