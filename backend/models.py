from pydantic import BaseModel

class CaseCreate(BaseModel):
    child_name: str
    age: int
    last_seen_location: str
    last_seen_timestamp: str
    description: str
    photo_url: str
