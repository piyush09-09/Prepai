from fastapi import FastAPI, UploadFile, Form, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel
from groq import Groq
from sqlalchemy.orm import Session
import os
import tempfile
from dotenv import load_dotenv
from rag import retrieve_relevant_examples, examples, store_job_description, retrieve_jd_context
from database import get_db, User, InterviewSession, Answer, create_tables
from auth import hash_password, verify_password, create_access_token, get_current_user
from auth import SECRET_KEY, ALGORITHM

load_dotenv()

app = FastAPI()

create_tables()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://prepai-azure.vercel.app",
        "http://localhost:5173"
    ],
    allow_methods=["*"],
    allow_headers=["*"],
)

groq_client = Groq(api_key=os.getenv("GROQ_API_KEY"))

# ─── Models ─────────────────────────────────────────────────
class SignupRequest(BaseModel):
    email: str
    username: str
    password: str

class AnswerRequest(BaseModel):
    question: str
    answer: str

class SaveSessionRequest(BaseModel):
    overall_score: float
    answers: list

class JDRequest(BaseModel):
    jd_text: str

# ─── Auth Routes ────────────────────────────────────────────
@app.post("/signup")
def signup(request: SignupRequest, db: Session = Depends(get_db)):
    existing = db.query(User).filter(
        (User.email == request.email) | (User.username == request.username)
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email or username already exists")

    user = User(
        email=request.email,
        username=request.username,
        hashed_password=hash_password(request.password)
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token({"sub": user.email})
    return {"access_token": token, "token_type": "bearer", "username": user.username, "user_id": user.id}

@app.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect email or password")

    token = create_access_token({"sub": user.email})
    return {"access_token": token, "token_type": "bearer", "username": user.username, "user_id": user.id}

@app.get("/me")
def get_me(current_user: User = Depends(get_current_user)):
    return {"email": current_user.email, "username": current_user.username}

# ─── Questions Route ─────────────────────────────────────────
@app.get("/questions")
def get_questions():
    return {"questions": [e["question"] + "?" for e in examples]}

# ─── JD Upload Route ─────────────────────────────────────────
@app.post("/upload-jd")
def upload_jd(
    request: JDRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    store_job_description(current_user.id, request.jd_text)
    return {"message": "Job description stored successfully"}

# ─── Session Save Route ──────────────────────────────────────
@app.post("/save-session")
def save_session(
    request: SaveSessionRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    session = InterviewSession(
        user_id=current_user.id,
        overall_score=request.overall_score
    )
    db.add(session)
    db.flush()

    for ans in request.answers:
        answer = Answer(
            session_id=session.id,
            question=ans["question"],
            transcript=ans["transcript"],
            feedback=ans["feedback"],
            word_count=ans["wordCount"],
            eye_contact_pct=ans["eyeContactPct"]
        )
        db.add(answer)

    db.commit()
    return {"message": "Session saved", "session_id": session.id}

# ─── History Route ───────────────────────────────────────────
@app.get("/history")
def get_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    sessions = db.query(InterviewSession).filter(
        InterviewSession.user_id == current_user.id
    ).order_by(InterviewSession.created_at.desc()).all()

    result = []
    for session in sessions:
        result.append({
            "id": session.id,
            "created_at": session.created_at.isoformat(),
            "overall_score": session.overall_score,
            "answers": [
                {
                    "question": a.question,
                    "transcript": a.transcript,
                    "feedback": a.feedback,
                    "wordCount": a.word_count,
                    "eyeContactPct": a.eye_contact_pct
                }
                for a in session.answers
            ]
        })

    return {"sessions": result}

# ─── Feedback Routes ─────────────────────────────────────────
@app.post("/feedback")
def get_feedback(request: AnswerRequest):
    response = groq_client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "user",
                "content": f"I was asked this interview question: '{request.question}' and my answer was: '{request.answer}'. Give me brief feedback in 2-3 sentences."
            }
        ]
    )
    return {"feedback": response.choices[0].message.content}

@app.post("/transcribe-and-feedback")
async def transcribe_and_feedback(
    audio: UploadFile,
    question: str = Form(...),
    authorization: str = Form("")
):
    # get user_id from JWT token instead of trusting frontend
    user_id = 0
    if authorization:
        try:
            from jose import jwt
            payload = jwt.decode(authorization, SECRET_KEY, algorithms=[ALGORITHM])
            email = payload.get("sub")
            if email:
                from database import SessionLocal
                db = SessionLocal()
                user = db.query(User).filter(User.email == email).first()
                if user:
                    user_id = user.id
                db.close()
        except:
            pass

    with tempfile.NamedTemporaryFile(suffix=".webm", delete=False) as f:
        f.write(await audio.read())
        temp_path = f.name

    with open(temp_path, "rb") as audio_file:
        transcription = groq_client.audio.transcriptions.create(
            model="whisper-large-v3",
            file=("answer.webm", audio_file, "audio/webm"),
            response_format="text",
            prompt="This is an interview answer in English."
        )

    transcript = transcription.strip()

    jd_context = ""
    if user_id > 0:
        jd_context = retrieve_jd_context(user_id, question, transcript)

    relevant_examples = retrieve_relevant_examples(question, transcript)

    context = ""
    for example in relevant_examples:
        context += f"\nExample strong answer: {example['document']}"
        context += f"\nTip: {example['tips']}\n"

    jd_section = f"\nJob Description Context:\n{jd_context}\n" if jd_context else ""

    response = groq_client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "system",
                "content": "You are an expert interview coach. Use the provided examples, tips, and job description context to give specific feedback tailored to the role."
            },
            {
                "role": "user",
                "content": f"""Interview question: '{question}'
Candidate's answer: '{transcript}'

Reference examples and tips:
{context}
{jd_section}
Give specific feedback in 3-4 sentences. If job description context is provided, mention specific requirements from it."""
            }
        ]
    )

    feedback = response.choices[0].message.content
    return {"transcript": transcript, "feedback": feedback}