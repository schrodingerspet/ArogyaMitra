from sqlalchemy.orm import Session
from ..models import MedicalDocument, TimelineEvent

class RecordsService:
    @staticmethod
    def get_documents(user_id: int, db: Session) -> list:
        docs = db.query(MedicalDocument).filter(MedicalDocument.user_id == user_id).all()
        return [
            {
                "id": d.id,
                "name": d.name,
                "date": d.date_str,
                "type": d.file_type,
                "size": d.size_str
            }
            for d in docs
        ]

    @staticmethod
    def get_timeline_events(user_id: int, db: Session) -> list:
        events = db.query(TimelineEvent).filter(TimelineEvent.user_id == user_id).order_by(TimelineEvent.id.desc()).all()
        return [
            {
                "id": e.id,
                "date": e.date_str,
                "title": e.title,
                "type": e.type,
                "desc": e.description,
                "icon": e.icon_name,
                "color": e.color
            }
            for e in events
        ]
