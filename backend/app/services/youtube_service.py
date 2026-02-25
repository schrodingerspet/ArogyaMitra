"""YouTube Data API service — exercise video search (shell for Activity 3.2)."""

import os
from typing import Optional, List

import httpx

YOUTUBE_SEARCH_URL = "https://www.googleapis.com/youtube/v3/search"


class YouTubeService:

    @staticmethod
    def search_exercise_video(exercise_name: str, max_results: int = 3) -> List[dict]:
        """Search YouTube for exercise demonstration videos."""
        api_key = os.getenv("YOUTUBE_API_KEY")
        if not api_key or api_key.startswith("your_"):
            return []

        params = {
            "part": "snippet",
            "q": f"{exercise_name} exercise tutorial",
            "type": "video",
            "maxResults": max_results,
            "key": api_key,
            "videoDuration": "short",
            "relevanceLanguage": "en",
        }

        try:
            resp = httpx.get(YOUTUBE_SEARCH_URL, params=params, timeout=10)
            resp.raise_for_status()
            data = resp.json()
            results = []
            for item in data.get("items", []):
                results.append({
                    "video_id": item["id"]["videoId"],
                    "title": item["snippet"]["title"],
                    "thumbnail": item["snippet"]["thumbnails"]["medium"]["url"],
                    "url": f"https://www.youtube.com/watch?v={item['id']['videoId']}",
                })
            return results
        except Exception:
            return []
