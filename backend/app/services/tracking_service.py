from sqlalchemy.orm import Session
from ..models import Medication, MedicationRenewal, Notification, SymptomLog, Vaccination

class TrackingService:
    @staticmethod
    def get_medications_data(user_id: int, db: Session) -> dict:
        meds = db.query(Medication).filter(Medication.user_id == user_id).all()
        rens = db.query(MedicationRenewal).filter(MedicationRenewal.user_id == user_id).all()
        
        return {
            "medications": [
                {
                    "id": m.id,
                    "name": m.name,
                    "dose": m.dose,
                    "schedule": m.schedule,
                    "status": m.status,
                    "icon": m.icon
                } for m in meds
            ],
            "renewals": [
                {
                    "id": r.id,
                    "name": r.name,
                    "refills": r.refills,
                    "nextRefill": r.next_refill
                } for r in rens
            ]
        }

    @staticmethod
    def get_notifications(user_id: int, db: Session) -> list:
        notifs = db.query(Notification).filter(Notification.user_id == user_id).order_by(Notification.id.desc()).all()
        return [
            {
                "id": n.id,
                "type": n.type,
                "msg": n.msg,
                "time": n.time_str,
                "read": n.read
            }
            for n in notifs
        ]

    @staticmethod
    def get_symptoms(user_id: int, db: Session) -> list:
        symps = db.query(SymptomLog).filter(SymptomLog.user_id == user_id).order_by(SymptomLog.id.desc()).all()
        return [
            {
                "id": s.id,
                "date": s.date_str,
                "time": s.time_str,
                "symptom": s.symptom,
                "severity": s.severity,
                "notes": s.notes
            }
            for s in symps
        ]

    @staticmethod
    def get_vaccinations(user_id: int, db: Session) -> list:
        vaxs = db.query(Vaccination).filter(Vaccination.user_id == user_id).all()
        return [
            {
                "id": v.id,
                "name": v.name,
                "date": v.date_str,
                "status": v.status,
                "for_patient": v.patient_name
            }
            for v in vaxs
        ]
