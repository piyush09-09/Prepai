# PrepAI — AI Interview Coach

An AI-powered mock interview platform that helps you practice interview questions with real-time feedback on your answers, eye contact, speech clarity, and filler word usage.

**Live Demo:** [prepai-azure.vercel.app](https://prepai-azure.vercel.app)

---

## What It Does

PrepAI simulates a real interview experience in your browser. You speak your answers out loud, and the AI analyzes everything — what you said, how you said it, and whether you maintained eye contact.

- **Speech-to-Text** — Your spoken answers are transcribed in real time using OpenAI's Whisper model
- **AI Feedback** — Each answer receives detailed coaching feedback from LLaMA 3.3 via Groq, referencing best practices and example answers
- **Eye Contact Tracking** — MediaPipe's FaceLandmarker detects iris position to measure whether you're looking at the camera
- **Filler Word Detection** — Automatically counts "um", "uh", "like", "basically" in your answers
- **Job Description Upload** — Paste a JD and the RAG pipeline tailors feedback to that specific role
- **Session History** — Every session is saved with detailed breakdowns and an improvement graph over time

---

## Tech Stack

### Frontend
- **React 19** with Vite
- **MediaPipe Tasks Vision** for real-time iris tracking
- **Web Audio API** for mic volume visualization
- **MediaRecorder API** for audio capture
- Deployed on **Vercel**

### Backend
- **FastAPI** (Python)
- **Groq API** — Whisper (speech-to-text) + LLaMA 3.3 (feedback generation)
- **ChromaDB** + **Sentence-Transformers** — RAG pipeline for context-aware feedback
- **SQLAlchemy** + **SQLite** — User accounts, session history
- **JWT Authentication** with passlib
- Deployed on **Railway**

---

## Architecture

```
┌─────────────────────────────────────────────────┐
│                   React Frontend                 │
│                                                  │
│  ┌──────────┐  ┌──────────┐  ┌───────────────┐  │
│  │ Camera   │  │   Mic    │  │   Question    │  │
│  │ Feed     │  │ Capture  │  │   Panel       │  │
│  └────┬─────┘  └────┬─────┘  └───────────────┘  │
│       │              │                           │
│  MediaPipe      MediaRecorder                    │
│  (eye contact)  (audio chunks)                   │
│       │              │                           │
│       ▼              ▼                           │
│  Score Display   Submit Answer                   │
│                      │                           │
└──────────────────────┼───────────────────────────┘
                       │ HTTP POST (audio + question)
                       ▼
┌─────────────────────────────────────────────────┐
│                 FastAPI Backend                   │
│                                                  │
│  ┌──────────┐  ┌──────────┐  ┌───────────────┐  │
│  │ Whisper  │  │ ChromaDB │  │   LLaMA 3.3   │  │
│  │ (STT)    │  │ (RAG)    │  │  (Feedback)   │  │
│  └──────────┘  └──────────┘  └───────────────┘  │
│                                                  │
│  ┌──────────┐  ┌──────────────────────────────┐  │
│  │ SQLite   │  │ JWT Auth                     │  │
│  │ (Users,  │  │ (Signup, Login, Sessions)    │  │
│  │ Sessions)│  └──────────────────────────────┘  │
│  └──────────┘                                    │
└─────────────────────────────────────────────────┘
```

---

## Features

### During Interview
- Live camera feed with real-time eye contact percentage
- Mic input with volume level indicator
- 5 curated interview questions (loaded from RAG database)
- Audio recording per answer — speak naturally, no typing needed
- Live score cards: words spoken, filler words, eye contact %, rating

### After Interview
- Session summary with overall score out of 100
- Per-question breakdown with transcript, word count, eye contact, and AI feedback
- Score saved to database for historical tracking

### Dashboard
- Latest score, average eye contact, total filler words, sessions completed
- Recent sessions list with scores
- AI Coach Insight — personalized tip based on your performance data

### Profile
- Profile photo upload
- Username editing
- Password change
- Account stats (best score, average eye contact, sessions done)

### History
- All past sessions with scores and dates
- Score improvement graph with hover tooltips
- Click any session to see full question-by-question breakdown

---

## RAG Pipeline

The feedback system uses Retrieval Augmented Generation:

1. **Vector Database** — 5 example strong answers stored in ChromaDB with sentence-transformer embeddings
2. **Job Description Storage** — When user uploads a JD, it's chunked and stored per-user in a separate ChromaDB collection
3. **Retrieval** — On each answer submission, the system retrieves the 2 most relevant example answers + JD context
4. **Generation** — LLaMA 3.3 receives the question, user's answer, retrieved examples, tips, and JD context to generate specific feedback

---

## Local Setup

### Prerequisites
- Node.js 20+
- Python 3.11+
- Git

### Frontend

```bash
cd interview-coach
npm install --legacy-peer-deps
npm run dev
```

Opens at `http://localhost:5173`

### Backend

```bash
cd interview-backend
python -m venv venv

# Windows
venv\Scripts\activate

# Mac/Linux
source venv/bin/activate

pip install -r requirements.txt
```

Create `.env` file in `interview-backend`:

```
GROQ_API_KEY=your_groq_api_key
```

Get a free Groq API key at [console.groq.com](https://console.groq.com)

```bash
uvicorn main:app --reload
```

Runs at `http://127.0.0.1:8000`

---

## Deployment

- **Frontend** — Vercel (auto-deploys from GitHub, root directory: `interview-coach`)
- **Backend** — Railway (auto-deploys from GitHub, root directory: `interview-backend`)
- Environment variables set in Railway dashboard

---

## Project Structure

```
PrepAI/
├── interview-coach/          # React frontend
│   ├── src/
│   │   ├── App.jsx           # Main app component with all interview logic
│   │   ├── Auth.jsx          # Login/Signup page
│   │   ├── Landing.jsx       # Landing page for new visitors
│   │   ├── Layout.jsx        # Sidebar + navigation shell
│   │   ├── Profile.jsx       # Profile + History views
│   │   ├── index.css         # Global styles (dark theme)
│   │   └── main.jsx          # React entry point
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── interview-backend/        # Python backend
│   ├── main.py               # FastAPI routes (auth, questions, feedback, history)
│   ├── auth.py               # JWT token + password hashing
│   ├── database.py           # SQLAlchemy models (User, Session, Answer)
│   ├── rag.py                # ChromaDB + sentence-transformers RAG pipeline
│   ├── requirements.txt
│   └── Procfile              # Railway deployment config
│
└── README.md
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/signup` | Create new account |
| POST | `/login` | Sign in, returns JWT token |
| GET | `/questions` | Get interview questions from RAG database |
| POST | `/upload-jd` | Upload job description for role-specific feedback |
| POST | `/transcribe-and-feedback` | Send audio, get transcript + AI feedback |
| POST | `/save-session` | Save completed session to database |
| GET | `/history` | Get user's past sessions |
| GET | `/me` | Get current user info |

---

## Scoring System

The overall score (0–100) is calculated from three components:

- **Word Count (40 points)** — Answers with 50+ words get full marks
- **Questions Answered (30 points)** — Completing all questions gets full marks
- **Filler Words (30 points)** — Each filler word deducts 3 points

Eye contact percentage is tracked separately per answer and shown in session history.

---

## Built By

**Piyush Kumar** — B.Tech CSE, IIIT Vadodara

- [GitHub](https://github.com/piyush09-09)
- [LinkedIn](https://www.linkedin.com/in/piyush-kumar-937889364/)

---

## License

This project is open source and available for learning purposes.
