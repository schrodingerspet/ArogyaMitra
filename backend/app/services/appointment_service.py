from sqlalchemy.orm import Session
from datetime import date, datetime, timedelta
from ..models import Appointment, Doctor, Recommendation, Reminder, WaitingListEntry

class AppointmentService:
    @staticmethod
    def get_available_slots(doctor_id: int, db: Session) -> list:
        # Standard working hours
        all_slots = [
            {"time": "09:00 AM", "status": "available"},
            {"time": "09:30 AM", "status": "available"},
            {"time": "10:00 AM", "status": "available"},
            {"time": "10:30 AM", "status": "available"},
            {"time": "11:00 AM", "status": "break"},
            {"time": "11:30 AM", "status": "available"},
            {"time": "12:00 PM", "status": "available"},
            {"time": "12:30 PM", "status": "available"},
            {"time": "02:00 PM", "status": "available"},
            {"time": "02:30 PM", "status": "available"},
            {"time": "03:00 PM", "status": "available"}
        ]
        
        # Get today's bookings for this doctor
        today = date.today()
        bookings = db.query(Appointment).filter(
            Appointment.doctor_id == doctor_id,
            Appointment.date_time >= datetime(today.year, today.month, today.day)
        ).all()
        
        booked_times = [b.date_time.strftime("%I:%M %p").lstrip("0") for b in bookings]
        
        for slot in all_slots:
            if slot["status"] != "break":
                # Normalize time strings
                slot_t = slot["time"].lstrip("0")
                if slot_t in booked_times:
                    slot["status"] = "booked"
        
        # Make a mock slot booked for variation if it's doctor id 1 and no bookings
        if doctor_id == 1 and not bookings:
            all_slots[1]["status"] = "booked"
            all_slots[5]["status"] = "booked"
            
        return all_slots

    @staticmethod
    def get_recommendations(user_id: int, db: Session) -> list:
        recs = db.query(Recommendation).filter(Recommendation.user_id == user_id).all()
        result = []
        for r in recs:
            doctor_name = r.doctor.name if r.doctor else "General Doctor"
            result.append({
                "id": r.id,
                "doctor": doctor_name,
                "specialty": r.specialty,
                "reason": r.reason,
                "dueDate": r.due_date.strftime("%b %d, %Y"),
                "urgency": r.urgency
            })
        return result

    @staticmethod
    def get_reminders(user_id: int, db: Session) -> list:
        rems = db.query(Reminder).filter(Reminder.user_id == user_id).all()
        return [
            {
                "id": r.id,
                "type": r.type,
                "details": r.details,
                "time": r.time_string,
                "status": r.status
            }
            for r in rems
        ]

    @staticmethod
    def get_waiting_list(db: Session) -> list:
        # We can just return all or filter by today. For now, return all in table
        entries = db.query(WaitingListEntry).all()
        return [
            {
                "id": e.id,
                "name": e.patient_name,
                "doctor": e.doctor.name if e.doctor else "Unknown",
                "waitTime": f"{e.wait_time_mins} mins",
                "priority": e.priority
            }
            for e in entries
        ]
