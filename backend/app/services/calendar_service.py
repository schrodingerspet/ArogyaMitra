"""Google Calendar API service — workout schedule sync."""

import os
from typing import Optional

import httpx


GOOGLE_CALENDAR_EVENTS_URL = "https://www.googleapis.com/calendar/v3/calendars/primary/events"


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
        timezone: str = "UTC",
    ) -> Optional[dict]:
        """Create a Google Calendar event for a workout session."""
        if not access_token or access_token.startswith("your_"):
            return {
                "status": "error",
                "message": "A valid Google OAuth access token is required.",
            }

        payload = {
            "summary": title,
            "description": description,
            "start": {"dateTime": start_datetime, "timeZone": timezone},
            "end": {"dateTime": end_datetime, "timeZone": timezone},
        }

        headers = {
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json",
        }

        try:
            response = httpx.post(
                GOOGLE_CALENDAR_EVENTS_URL,
                headers=headers,
                json=payload,
                timeout=15,
            )
            response.raise_for_status()
        except httpx.HTTPStatusError as exc:
            details = exc.response.text
            if exc.response.headers.get("content-type", "").startswith("application/json"):
                try:
                    details = exc.response.json()
                except ValueError:
                    details = exc.response.text
            return {
                "status": "error",
                "message": "Google Calendar API rejected the request.",
                "details": details,
            }
        except httpx.RequestError as exc:
            return {
                "status": "error",
                "message": f"Google Calendar API connection failed: {exc}",
            }

        event = response.json()
        return {
            "status": "created",
            "event_id": event.get("id"),
            "html_link": event.get("htmlLink"),
            "summary": event.get("summary"),
            "start": event.get("start"),
            "end": event.get("end"),
        }
