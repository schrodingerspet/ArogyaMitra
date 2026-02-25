from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from ..database import get_db
from ..models import ChatSession, ChatMessage, User
from ..schemas import (
    ChatSessionCreate, ChatSessionResponse, ChatSessionListResponse,
    ChatMessageCreate, ChatMessageResponse,
)
from ..auth.dependencies import get_current_user

router = APIRouter(prefix="/chat", tags=["Chat / AROMI"])


@router.post("/sessions", response_model=ChatSessionResponse)
def create_session(
    data: ChatSessionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    session = ChatSession(owner_id=current_user.id, title=data.title or "New Chat")
    db.add(session)
    db.commit()
    db.refresh(session)
    return session


@router.get("/sessions", response_model=List[ChatSessionListResponse])
def get_sessions(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return (
        db.query(ChatSession)
        .filter(ChatSession.owner_id == current_user.id)
        .order_by(ChatSession.created_at.desc())
        .all()
    )


@router.get("/sessions/{session_id}", response_model=ChatSessionResponse)
def get_session(
    session_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    sess = db.query(ChatSession).filter(
        ChatSession.id == session_id, ChatSession.owner_id == current_user.id
    ).first()
    if not sess:
        raise HTTPException(404, "Chat session not found")
    return sess


@router.post("/sessions/{session_id}/messages", response_model=ChatMessageResponse)
def add_message(
    session_id: int,
    data: ChatMessageCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    sess = db.query(ChatSession).filter(
        ChatSession.id == session_id, ChatSession.owner_id == current_user.id
    ).first()
    if not sess:
        raise HTTPException(404, "Chat session not found")

    user_msg = ChatMessage(session_id=session_id, role="user", content=data.content)
    db.add(user_msg)
    db.commit()
    db.refresh(user_msg)

    # AI response placeholder — will be replaced by Groq integration in Activity 3.5
    ai_msg = ChatMessage(
        session_id=session_id,
        role="assistant",
        content="AROMI AI integration pending. This is a placeholder response.",
    )
    db.add(ai_msg)
    db.commit()
    db.refresh(ai_msg)

    return ai_msg


@router.get("/sessions/{session_id}/messages", response_model=List[ChatMessageResponse])
def get_messages(
    session_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    sess = db.query(ChatSession).filter(
        ChatSession.id == session_id, ChatSession.owner_id == current_user.id
    ).first()
    if not sess:
        raise HTTPException(404, "Chat session not found")
    return db.query(ChatMessage).filter(ChatMessage.session_id == session_id).order_by(ChatMessage.created_at).all()


@router.delete("/sessions/{session_id}")
def delete_session(
    session_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    sess = db.query(ChatSession).filter(
        ChatSession.id == session_id, ChatSession.owner_id == current_user.id
    ).first()
    if not sess:
        raise HTTPException(404, "Chat session not found")
    db.delete(sess)
    db.commit()
    return {"message": "Chat session deleted"}
