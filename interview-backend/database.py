from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime, ForeignKey, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from datetime import datetime

SQLALCHEMY_DATABASE_URL ="sqlite:///./interview.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args = {"check_same_thread" : False}
)

SessionLocal = sessionmaker(engine)

Base = declarative_base()

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key = True, index=True)
    email = Column(String, unique=True, index = True)
    username = Column(String, unique=True, index = True)
    hashed_password = Column(String)
    created_at= Column(DateTime, default=datetime.utcnow)

    sessions = relationship("InterviewSession", back_populates="user")


class InterviewSession(Base):
    __tablename__= "interview_sessions"

    id = Column(Integer, primary_key = True, index = True)
    user_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, default = datetime.utcnow)
    overall_score = Column(Float)

    user = relationship("User", back_populates = "sessions")
    answers = relationship("Answer", back_populates="session")


class Answer(Base):
    __tablename__ = "answers"

    id = Column(Integer, primary_key = True, index = True)
    session_id = Column(Integer, ForeignKey("interview_sessions.id"))
    question = Column(String)
    transcript = Column(Text)
    feedback = Column(Text)
    word_count = Column(Integer)
    eye_contact_pct = Column(Float)
    created_at = Column(DateTime, default = datetime.utcnow)

    session = relationship("InterviewSession", back_populates = "answers")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def create_tables():
    Base.metadata.create_all(bind = engine)