"""Google Calendar API service — workout schedule sync (shell for Activity 3.4)."""

import os
from typing import Optional


class CalendarService:

    @staticmethod
    def is_configured() -> bool:
        client_id = os.getenv("GOOGLE_CALENDAR_CLIENT_ID", "")
        return bool(client_id and not client_id.startswith("your_"))

    @staticmethod
    def create_workout_event(
        title: str,
        description: str,
        start_datetime: str,
        end_datetime: str,
        access_token: str,
    ) -> Optional[dict]:
        """Create a Google Calendar event for a workout session.

        Full OAuth flow will be implemented in Activity 3.4.
        Returns None until then.
        """
        # Placeholder — requires OAuth 2.0 token exchange
        return {
            "status": "pending_integration",
            "message": "Google Calendar sync will be available after Activity 3.4",
            "event_preview": {
                "title": title,
                "description": description,
                "start": start_datetime,
                "end": end_datetime,
            },
        }
