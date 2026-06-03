import { useState, useRef, useEffect } from "react"
import Auth from "./Auth"
import Profile, { HistoryView } from "./Profile"
import Layout from "./Layout"
import Landing from "./Landing"

function CameraFeed({ started, onEyeContact, onStream }) {
  const videoRef = useRef(null)
  const eyeContactBuffer = useRef([])
  const animFrameRef = useRef(null)

  useEffect(() => {
    if (!started) return

    let running = true

    async function startCamera() {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      videoRef.current.srcObject = stream
      if (onStream) onStream(stream)

      await new Promise((resolve) => {
        videoRef.current.onloadedmetadata = resolve
      })

      const { FaceLandmarker, FilesetResolver } = await import("@mediapipe/tasks-vision")

      const filesetResolver = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm"
      )

      const faceLandmarker = await FaceLandmarker.createFromOptions(filesetResolver, {
        baseOptions: {
          modelAssetPath:
            "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
          delegate: "GPU",
        },
        outputFaceBlendshapes: false,
        runningMode: "VIDEO",
        numFaces: 1,
      })

      async function detect() {
        if (!running) return

        try {
          const results = faceLandmarker.detectForVideo(
            videoRef.current,
            performance.now()
          )

          if (results.faceLandmarks && results.faceLandmarks.length > 0) {
            const landmarks = results.faceLandmarks[0]

            const leftIris = landmarks[473]
            const leftInner = landmarks[362]
            const leftOuter = landmarks[263]

            const rightIris = landmarks[468]
            const rightInner = landmarks[33]
            const rightOuter = landmarks[133]

            const leftRatio =
              (leftIris.x - leftInner.x) / (leftOuter.x - leftInner.x)
            const rightRatio =
              (rightIris.x - rightInner.x) / (rightOuter.x - rightInner.x)

            const leftCentered = leftRatio > 0.38 && leftRatio < 0.58
            const rightCentered = rightRatio > 0.38 && rightRatio < 0.58

            eyeContactBuffer.current.push(leftCentered && rightCentered ? 1 : 0)
          } else {
            eyeContactBuffer.current.push(0)
          }

          if (eyeContactBuffer.current.length > 30) {
            eyeContactBuffer.current.shift()
          }

          const avg =
            eyeContactBuffer.current.reduce((a, b) => a + b, 0) /
            Math.max(eyeContactBuffer.current.length, 1)

          onEyeContact(Math.round(avg * 100))
        } catch (e) {
          console.log("Detection error:", e)
        }

        animFrameRef.current = requestAnimationFrame(detect)
      }

      detect()
    }

    startCamera()

    return () => {
      running = false
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
    }
  }, [started])

  return (
    <div style={{ width: "100%" }}>
      <video ref={videoRef} autoPlay style={{ width: "100%", borderRadius: "8px" }} />
    </div>
  )
}

function MicCapture({ started, onStream }) {
  const [volume, setVolume] = useState(0)

  useEffect(() => {
    if (!started) return

    async function startMic() {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      if (onStream) onStream(stream)

      const audioContext = new AudioContext()
      const source = audioContext.createMediaStreamSource(stream)
      const analyser = audioContext.createAnalyser()
      source.connect(analyser)

      const data = new Uint8Array(analyser.frequencyBinCount)
      function measureVolume() {
        analyser.getByteFrequencyData(data)
        const average = data.reduce((sum, val) => sum + val, 0) / data.length
        setVolume(Math.round(average))
        requestAnimationFrame(measureVolume)
      }
      measureVolume()
    }

    startMic()
  }, [started])

  return (
    <div>
      <div style={{ color: "#A0AEC0", fontSize: "13px", marginBottom: "10px" }}>
        Volume level: {volume}
      </div>
      <div style={{ height: "6px", background: "#1E2D4A", borderRadius: "4px", overflow: "hidden" }}>
        <div style={{
          height: "100%",
          width: `${Math.min(volume * 3, 100)}%`,
          background: volume > 20 ? "#48BB78" : "#3B82F6",
          borderRadius: "4px",
          transition: "width 0.1s"
        }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "6px" }}>
        <span style={{ color: "#4A5568", fontSize: "11px" }}>Silent</span>
        <span style={{ color: "#4A5568", fontSize: "11px" }}>Loud</span>
      </div>
    </div>
  )
}

function QuestionPanel({ question, onNext, isLast }) {
  return (
    <div style={{ background: "#0F1729", border: "0.5px solid #1E2D4A", borderRadius: "12px", padding: "16px" }}>
      <div style={{ color: "#718096", fontSize: "12px", marginBottom: "10px" }}>Current Question</div>
      <p style={{ color: "#E2E8F0", fontSize: "14px", lineHeight: "1.6", marginBottom: "16px" }}>{question}</p>
      {!isLast && (
        <button
          onClick={onNext}
          style={{
            padding: "7px 16px", background: "#1A2540",
            color: "#718096", border: "0.5px solid #1E2D4A",
            borderRadius: "8px", fontSize: "12px"
          }}
        >
          Next Question →
        </button>
      )}
      {isLast && <p style={{ color: "#4A5568", fontSize: "12px" }}>Last question — submit when ready.</p>}
    </div>
  )
}

function FeedbackPanel({ feedback, isLoading }) {
  return (
    <div style={{ background: "#0F1729", border: "0.5px solid #1E2D4A", borderRadius: "12px", padding: "16px" }}>
      <div style={{ color: "#718096", fontSize: "12px", marginBottom: "10px" }}>AI Feedback</div>
      {isLoading && (
        <div style={{ color: "#4A5568", fontSize: "13px", display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ width: "8px", height: "8px", background: "#3B82F6", borderRadius: "50%" }} />
          Analyzing your answer...
        </div>
      )}
      {feedback && <p style={{ color: "#A0AEC0", fontSize: "13px", lineHeight: "1.6" }}>{feedback}</p>}
      {!feedback && !isLoading && <p style={{ color: "#2D3748", fontSize: "13px" }}>Feedback will appear after you submit your answer.</p>}
    </div>
  )
}

function ScoreDisplay({ answer, eyeContactPct }) {
  const words = answer.trim().split(/\s+/).filter(w => w !== "")
  const wordCount = words.length
  const fillerWords = ["um", "uh", "like", "basically", "you know"]
  const fillerCount = words.filter(w => fillerWords.includes(w.toLowerCase())).length

  const metrics = [
    { label: "Words Spoken", value: wordCount, color: "#3B82F6" },
    { label: "Filler Words", value: fillerCount, color: fillerCount > 3 ? "#FC8181" : "#48BB78" },
    { label: "Eye Contact", value: `${eyeContactPct}%`, color: eyeContactPct >= 70 ? "#48BB78" : eyeContactPct >= 40 ? "#ECC94B" : "#FC8181" },
    { label: "Rating", value: wordCount === 0 ? "—" : wordCount < 20 ? "Short" : wordCount < 50 ? "Good" : "Great", color: "#9F7AEA" },
  ]

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px" }}>
      {metrics.map((m, i) => (
        <div key={i} style={{ background: "#0F1729", border: "0.5px solid #1E2D4A", borderRadius: "12px", padding: "14px" }}>
          <div style={{ color: "#4A5568", fontSize: "11px", marginBottom: "6px" }}>{m.label}</div>
          <div style={{ color: m.color, fontSize: "22px", fontWeight: "500" }}>{m.value}</div>
        </div>
      ))}
    </div>
  )
}

function SessionSummary({ history, onRestart }) {
  const totalWords = history.reduce((sum, entry) => sum + entry.wordCount, 0)
  const avgWords = history.length > 0 ? Math.round(totalWords / history.length) : 0
  const totalFillers = history.reduce((sum, entry) => {
    const fillerWords = ["um", "uh", "like", "basically", "you know"]
    const words = entry.transcript.toLowerCase().split(/\s+/)
    return sum + words.filter(w => fillerWords.includes(w)).length
  }, 0)

  const overallScore = Math.min(100, Math.round(
    (avgWords >= 50 ? 40 : (avgWords / 50) * 40) +
    (history.length >= 3 ? 30 : (history.length / 3) * 30) +
    Math.max(0, 30 - totalFillers * 3)
  ))

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ color: "#E2E8F0", marginBottom: "8px" }}>Session Summary</h2>
      <p style={{
        fontSize: "3rem", fontWeight: "500",
        color: overallScore >= 70 ? "#48BB78" : overallScore >= 40 ? "#ECC94B" : "#FC8181"
      }}>
        {overallScore}/100
      </p>
      <p style={{ color: "#718096", marginTop: "8px" }}>Questions answered: {history.length}</p>
      <p style={{ color: "#718096" }}>Average words per answer: {avgWords}</p>
      <p style={{ color: "#718096", marginBottom: "20px" }}>Total filler words: {totalFillers}</p>

      {history.map((entry, index) => (
        <div key={index} style={{
          background: "#0F1729", border: "0.5px solid #1E2D4A",
          borderRadius: "12px", padding: "20px", marginBottom: "12px"
        }}>
          <h3 style={{ color: "#E2E8F0", marginBottom: "12px" }}>Q{index + 1}: {entry.question}</h3>
          <p style={{ color: "#718096", fontSize: "13px", marginBottom: "6px" }}>
            <span style={{ color: "#A0AEC0" }}>Answer:</span> {entry.transcript}
          </p>
          <p style={{ color: "#718096", fontSize: "13px", marginBottom: "6px" }}>
            <span style={{ color: "#A0AEC0" }}>Words:</span> {entry.wordCount} &nbsp;
            <span style={{ color: "#A0AEC0" }}>Eye Contact:</span> {entry.eyeContactPct}%
          </p>
          <p style={{ color: "#718096", fontSize: "13px" }}>
            <span style={{ color: "#A0AEC0" }}>Feedback:</span> {entry.feedback}
          </p>
        </div>
      ))}

      <button
        onClick={onRestart}
        style={{
          marginTop: "8px", padding: "10px 24px",
          background: "#3B82F6", color: "white",
          border: "none", borderRadius: "8px", fontSize: "13px"
        }}
      >
        Start New Session
      </button>
    </div>
  )
}

export default function App() {
  const [started, setStarted] = useState(false)
  const [question, setQuestion] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answer, setAnswer] = useState("")
  const [feedback, setFeedback] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const wsRef = useRef(null)
  const mediaRecorderRef = useRef(null)
  const audioChunksRef = useRef([])
  const cameraStreamRef = useRef(null)
  const micStreamRef = useRef(null)
  const [sessionDone, setSessionDone] = useState(false)
  const [sessionHistory, setSessionHistory] = useState([])
  const [eyeContactPct, setEyeContactPct] = useState(0)
  const eyeContactSamplesRef = useRef([])
  const [user, setUser] = useState(localStorage.getItem("username") || null)
  const [token, setToken] = useState(localStorage.getItem("token") || null)
  const [currentPage, setCurrentPage] = useState("dashboard")
  const [jdText, setJdText] = useState("")
  const [jdUploaded, setJdUploaded] = useState(false)
  const [dashboardStats, setDashboardStats] = useState(null)
  const [showAuth, setShowAuth] = useState(false)


useEffect(() => {
  fetch("https://prepai-production-8ab9.up.railway.app/questions")
    .then(r => r.json())
    .then(data => {
      if (data.questions) setQuestion(data.questions)
    })
    .catch(err => console.log("Failed to fetch questions:", err))
}, [])

  useEffect(() => {
    if (!started) return

    async function startRecording() {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      micStreamRef.current = stream
      const recorder = new MediaRecorder(stream, { mimeType: "audio/webm;codecs=opus" })
      audioChunksRef.current = []
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data)
      }
      recorder.start(100)
      mediaRecorderRef.current = recorder
    }

    startRecording()

    return () => {
      mediaRecorderRef.current?.stop()
    }
  }, [started])

  useEffect(() => {
    if (currentPage !== "dashboard" || !token) return

    fetch("https://prepai-production-8ab9.up.railway.app/history", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(data => {
        const sessions = data.sessions
        if (sessions.length === 0) {
          setDashboardStats(null)
          return
        }

        const allAnswers = sessions.flatMap(s => s.answers)

        const avgEyeContact = Math.round(
          allAnswers.reduce((sum, a) => sum + (a.eyeContactPct || 0), 0) /
          Math.max(allAnswers.length, 1)
        )

        const totalFillers = allAnswers.reduce((sum, a) => {
          const fillerWords = ["um", "uh", "like", "basically", "you know"]
          const words = (a.transcript || "").toLowerCase().split(/\s+/)
          return sum + words.filter(w => fillerWords.includes(w)).length
        }, 0)

        const bestScore = Math.round(Math.max(...sessions.map(s => s.overall_score)))
        const latestScore = Math.round(sessions[0].overall_score)

        setDashboardStats({
          sessions: sessions.length,
          bestScore,
          latestScore,
          avgEyeContact,
          totalFillers,
          recentSessions: sessions.slice(0, 3)
        })
      })
  }, [currentPage, token])

  function stopAllStreams() {
    if (cameraStreamRef.current) {
      cameraStreamRef.current.getTracks().forEach(track => track.stop())
      cameraStreamRef.current = null
    }
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach(track => track.stop())
      micStreamRef.current = null
    }
    mediaRecorderRef.current?.stop()
    audioChunksRef.current = []
    eyeContactSamplesRef.current = []
  }

  async function handleSubmit() {
    setIsLoading(true)
    setFeedback("")

    mediaRecorderRef.current?.stop()
    await new Promise(resolve => setTimeout(resolve, 300))

    const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" })
    const formData = new FormData()
    formData.append("audio", audioBlob, "answer.webm")
    formData.append("question", question[currentIndex])
    formData.append("user_id", localStorage.getItem("user_id") || 0)

    const response = await fetch("https://prepai-production-8ab9.up.railway.app/transcribe-and-feedback", {
      method: "POST",
      body: formData
    })

    const data = await response.json()
    setAnswer(data.transcript)
    setFeedback(data.feedback)

    const avgEyeContact = eyeContactSamplesRef.current.length > 0
      ? Math.round(
          eyeContactSamplesRef.current.reduce((a, b) => a + b, 0) /
          eyeContactSamplesRef.current.length
        )
      : 0

    eyeContactSamplesRef.current = []

    setSessionHistory(prev => [...prev, {
      question: question[currentIndex],
      transcript: data.transcript,
      feedback: data.feedback,
      wordCount: data.transcript.split(/\s+/).filter(w => w !== "").length,
      eyeContactPct: avgEyeContact
    }])

    setIsLoading(false)
  }

  if (question.length === 0) {
    return <p style={{ padding: "20px", color: "#718096" }}>Loading...</p>
  }


  if (!user) {
    if (showAuth) {
      return <Auth onLogin={(username) => {
        setUser(username)
        setToken(localStorage.getItem("token"))
      }} />
    }
    return <Landing onGetStarted={() => setShowAuth(true)} />
  }

  return (
    <Layout
      user={user}
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
      onPageChange={(page) => {
        if (started) stopAllStreams()
        setStarted(false)
        setCurrentPage(page)
      }}
      onLogout={() => {
        if (started) stopAllStreams()
        localStorage.removeItem("token")
        localStorage.removeItem("username")
        localStorage.removeItem("user_id")
        setUser(null)
        setToken(null)
      }}
    >
      <div style={{ padding: "28px", maxWidth: "1200px" }}>

        {currentPage === "profile" && (
          <Profile token={token} user={user} />
        )}

        {currentPage === "history" && (
          <HistoryView token={token} />
        )}

        {currentPage === "interview" && (
          <div>
            {sessionDone ? (
              <SessionSummary
                history={sessionHistory}
                onRestart={() => {
                  setSessionDone(false)
                  setStarted(false)
                  setSessionHistory([])
                  setCurrentIndex(0)
                  setAnswer("")
                  setFeedback("")
                  setJdText("")
                  setJdUploaded(false)
                }}
              />
            ) : (
              <div>
                {!started && (
                  <div style={{ marginBottom: "24px" }}>
                    <h2 style={{ color: "#E2E8F0", fontSize: "20px", fontWeight: "500", marginBottom: "4px" }}>Mock Interview</h2>
                    <p style={{ color: "#4A5568", fontSize: "13px", marginBottom: "24px" }}>Paste a job description for role-specific feedback, then start your session.</p>

                    <div style={{
                      background: "#0F1729", border: "0.5px solid #1E2D4A",
                      borderRadius: "12px", padding: "20px", marginBottom: "16px"
                    }}>
                      <div style={{ color: "#A0AEC0", fontSize: "13px", fontWeight: "500", marginBottom: "8px" }}>Job Description (Optional)</div>
                      <textarea
                        value={jdText}
                        onChange={(e) => { setJdText(e.target.value); setJdUploaded(false) }}
                        placeholder="Paste job description here to get role-specific AI feedback..."
                        style={{
                          width: "100%", height: "120px", padding: "12px",
                          background: "#0B1120", border: "0.5px solid #1E2D4A",
                          borderRadius: "8px", color: "#E2E8F0", fontSize: "13px",
                          resize: "vertical", outline: "none", boxSizing: "border-box"
                        }}
                      />
                      {jdText.trim().length > 0 && (
                        <button
                          onClick={async () => {
                            await fetch("https://prepai-production-8ab9.up.railway.app/upload-jd", {
                              method: "POST",
                              headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
                              body: JSON.stringify({ jd_text: jdText })
                            })
                            setJdUploaded(true)
                          }}
                          style={{
                            marginTop: "10px", padding: "8px 16px",
                            background: jdUploaded ? "#14532D" : "#1E3A6E",
                            color: jdUploaded ? "#48BB78" : "#60A5FA",
                            border: `0.5px solid ${jdUploaded ? "#166534" : "#2B4C8C"}`,
                            borderRadius: "8px", fontSize: "13px"
                          }}
                        >
                          {jdUploaded ? "✓ JD Saved" : "Save Job Description"}
                        </button>
                      )}
                    </div>

                    <button
                      onClick={() => setStarted(true)}
                      style={{
                        padding: "11px 28px", background: "#3B82F6",
                        color: "white", border: "none", borderRadius: "8px",
                        fontSize: "14px", fontWeight: "500"
                      }}
                    >
                      Start Interview Session
                    </button>
                  </div>
                )}

                {started && (
                  <div>
                    <div style={{
                      display: "flex", justifyContent: "space-between",
                      alignItems: "center", marginBottom: "20px"
                    }}>
                      <div>
                        <div style={{ color: "#E2E8F0", fontSize: "16px", fontWeight: "500" }}>Session in Progress</div>
                        <div style={{ color: "#4A5568", fontSize: "12px", marginTop: "2px" }}>
                          Question {currentIndex + 1} of {question.length}
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          stopAllStreams()
                          setStarted(false)
                          setCurrentIndex(0)
                          setAnswer("")
                          setFeedback("")
                          setSessionHistory([])
                        }}
                        style={{
                          padding: "8px 16px",
                          background: "transparent",
                          color: "#FC8181",
                          border: "0.5px solid #742A2A",
                          borderRadius: "8px",
                          fontSize: "13px",
                          cursor: "pointer"
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = "#2D1B1B"}
                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                      >
                        Cancel Interview
                      </button>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
                      <div style={{ background: "#0F1729", border: "0.5px solid #1E2D4A", borderRadius: "12px", padding: "16px" }}>
                        <div style={{ color: "#718096", fontSize: "12px", marginBottom: "10px" }}>Camera Feed</div>
                        <CameraFeed
                          started={started}
                          onEyeContact={(pct) => {
                            setEyeContactPct(pct)
                            eyeContactSamplesRef.current.push(pct)
                          }}
                          onStream={(stream) => { cameraStreamRef.current = stream }}
                        />
                      </div>
                      <div style={{ background: "#0F1729", border: "0.5px solid #1E2D4A", borderRadius: "12px", padding: "16px" }}>
                        <div style={{ color: "#718096", fontSize: "12px", marginBottom: "10px" }}>Mic Input</div>
                        <MicCapture
                          started={started}
                          onStream={(stream) => { micStreamRef.current = stream }}
                        />
                      </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
                      <QuestionPanel
                        question={question[currentIndex]}
                        isLast={currentIndex === question.length - 1}
                        onNext={() => {
                          if (currentIndex < question.length - 1) setCurrentIndex(currentIndex + 1)
                          setAnswer("")
                          setFeedback("")
                          eyeContactSamplesRef.current = []
                          mediaRecorderRef.current?.stop()
                          audioChunksRef.current = []
                          setTimeout(async () => {
                            const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
                            micStreamRef.current = stream
                            const recorder = new MediaRecorder(stream, { mimeType: "audio/webm;codecs=opus" })
                            audioChunksRef.current = []
                            recorder.ondataavailable = (e) => { if (e.data.size > 0) audioChunksRef.current.push(e.data) }
                            recorder.start(100)
                            mediaRecorderRef.current = recorder
                          }, 300)
                        }}
                      />
                      <FeedbackPanel feedback={feedback} isLoading={isLoading} />
                    </div>

                    <div style={{ background: "#0F1729", border: "0.5px solid #1E2D4A", borderRadius: "12px", padding: "16px", marginBottom: "16px" }}>
                      <div style={{ color: "#718096", fontSize: "12px", marginBottom: "8px" }}>Your Answer</div>
                      <textarea
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        placeholder="Your transcribed answer will appear here, or type manually..."
                        style={{
                          width: "100%", height: "100px", padding: "12px",
                          background: "#0B1120", border: "0.5px solid #1E2D4A",
                          borderRadius: "8px", color: "#E2E8F0", fontSize: "13px",
                          resize: "none", outline: "none", boxSizing: "border-box"
                        }}
                      />
                      <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                        <button
                          onClick={handleSubmit}
                          style={{
                            padding: "9px 20px", background: "#3B82F6",
                            color: "white", border: "none", borderRadius: "8px",
                            fontSize: "13px", fontWeight: "500"
                          }}
                        >
                          Submit Answer
                        </button>
                        {sessionHistory.length > 0 && (
                          <button
                            onClick={async () => {
                              stopAllStreams()
                              const totalWords = sessionHistory.reduce((sum, e) => sum + e.wordCount, 0)
                              const avgWords = sessionHistory.length > 0 ? Math.round(totalWords / sessionHistory.length) : 0
                              const totalFillers = sessionHistory.reduce((sum, entry) => {
                                const fillerWords = ["um", "uh", "like", "basically", "you know"]
                                const words = entry.transcript.toLowerCase().split(/\s+/)
                                return sum + words.filter(w => fillerWords.includes(w)).length
                              }, 0)
                              const overallScore = Math.min(100, Math.round(
                                (avgWords >= 50 ? 40 : (avgWords / 50) * 40) +
                                (sessionHistory.length >= 3 ? 30 : (sessionHistory.length / 3) * 30) +
                                Math.max(0, 30 - totalFillers * 3)
                              ))
                              await fetch("https://prepai-production-8ab9.up.railway.app/save-session", {
                                method: "POST",
                                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
                                body: JSON.stringify({ overall_score: overallScore, answers: sessionHistory })
                              })
                              setSessionDone(true)
                            }}
                            style={{
                              padding: "9px 20px", background: "#0F1729",
                              color: "#718096", border: "0.5px solid #1E2D4A",
                              borderRadius: "8px", fontSize: "13px"
                            }}
                          >
                            End Session
                          </button>
                        )}
                      </div>
                    </div>

                    <ScoreDisplay answer={answer} eyeContactPct={eyeContactPct} />
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {currentPage === "dashboard" && (
          <div>
            <div style={{ marginBottom: "24px" }}>
              <h2 style={{ color: "#E2E8F0", fontSize: "20px", fontWeight: "500", marginBottom: "4px" }}>Dashboard</h2>
              <p style={{ color: "#4A5568", fontSize: "13px" }}>Welcome back, {user}. Ready to practice?</p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px", marginBottom: "20px" }}>
              {[
                {
                  label: "Latest Score",
                  value: dashboardStats ? `${dashboardStats.latestScore}` : "—",
                  sub: dashboardStats ? `Best: ${dashboardStats.bestScore}/100` : "Complete a session",
                  color: "#3B82F6",
                  pct: dashboardStats ? dashboardStats.latestScore : 0
                },
                {
                  label: "Avg Eye Contact",
                  value: dashboardStats ? `${dashboardStats.avgEyeContact}%` : "—",
                  sub: dashboardStats ? (dashboardStats.avgEyeContact >= 70 ? "Excellent" : dashboardStats.avgEyeContact >= 40 ? "Needs work" : "Keep practicing") : "No data yet",
                  color: "#06B6D4",
                  pct: dashboardStats ? dashboardStats.avgEyeContact : 0
                },
                {
                  label: "Total Filler Words",
                  value: dashboardStats ? `${dashboardStats.totalFillers}` : "—",
                  sub: dashboardStats ? (dashboardStats.totalFillers < 5 ? "Great control" : dashboardStats.totalFillers < 15 ? "Room to improve" : "Focus on this") : "No data yet",
                  color: dashboardStats && dashboardStats.totalFillers < 5 ? "#48BB78" : "#ECC94B",
                  pct: dashboardStats ? Math.max(0, 100 - dashboardStats.totalFillers * 5) : 0
                },
                {
                  label: "Sessions Done",
                  value: dashboardStats ? `${dashboardStats.sessions}` : "0",
                  sub: dashboardStats ? "Keep going!" : "Start your first",
                  color: "#9F7AEA",
                  pct: dashboardStats ? Math.min(dashboardStats.sessions * 10, 100) : 0
                },
              ].map((m, i) => (
                <div key={i} style={{ background: "#0F1729", border: "0.5px solid #1E2D4A", borderRadius: "12px", padding: "16px" }}>
                  <div style={{ color: "#4A5568", fontSize: "11px", marginBottom: "8px" }}>{m.label}</div>
                  <div style={{ color: "#E2E8F0", fontSize: "24px", fontWeight: "500" }}>{m.value}</div>
                  <div style={{ color: "#4A5568", fontSize: "11px", marginTop: "4px" }}>{m.sub}</div>
                  <div style={{ height: "3px", background: "#1E2D4A", borderRadius: "2px", marginTop: "10px" }}>
                    <div style={{ height: "100%", width: `${m.pct}%`, background: m.color, borderRadius: "2px", transition: "width 0.5s ease" }} />
                  </div>
                </div>
              ))}
            </div>

            {dashboardStats && dashboardStats.recentSessions.length > 0 && (
              <div style={{ background: "#0F1729", border: "0.5px solid #1E2D4A", borderRadius: "12px", padding: "20px", marginBottom: "16px" }}>
                <div style={{ color: "#A0AEC0", fontSize: "13px", fontWeight: "500", marginBottom: "14px", display: "flex", justifyContent: "space-between" }}>
                  <span>Recent Sessions</span>
                  <span
                    onClick={() => setCurrentPage("history")}
                    style={{ color: "#3B82F6", fontSize: "12px", cursor: "pointer" }}
                  >
                    View all →
                  </span>
                </div>
                {dashboardStats.recentSessions.map((session, i) => (
                  <div key={i} style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "12px", background: "#0B1120", borderRadius: "8px", marginBottom: "8px"
                  }}>
                    <div>
                      <div style={{ color: "#E2E8F0", fontSize: "13px", fontWeight: "500" }}>
                        Session {dashboardStats.sessions - i}
                      </div>
                      <div style={{ color: "#4A5568", fontSize: "11px", marginTop: "2px" }}>
                        {new Date(session.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })} · {session.answers.length} questions
                      </div>
                    </div>
                    <div style={{
                      fontSize: "16px", fontWeight: "500",
                      color: session.overall_score >= 70 ? "#48BB78" : session.overall_score >= 40 ? "#ECC94B" : "#FC8181"
                    }}>
                      {Math.round(session.overall_score)}/100
                    </div>
                  </div>
                ))}
              </div>
            )}

            {dashboardStats && (
              <div style={{ background: "#0F1729", border: "0.5px solid #1E2D4A", borderRadius: "12px", padding: "20px", marginBottom: "16px" }}>
                <div style={{ color: "#A0AEC0", fontSize: "13px", fontWeight: "500", marginBottom: "12px" }}>AI Coach Insight</div>
                <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                  <div style={{
                    width: "32px", height: "32px", borderRadius: "50%",
                    background: "#1E3A6E", display: "flex", alignItems: "center",
                    justifyContent: "center", flexShrink: 0
                  }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#60A5FA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>
                    </svg>
                  </div>
                  <p style={{ color: "#718096", fontSize: "13px", lineHeight: "1.6" }}>
                    {dashboardStats.avgEyeContact < 50
                      ? "Your eye contact needs improvement. Try looking directly at your camera lens instead of the screen."
                      : dashboardStats.totalFillers > 10
                      ? "You're using too many filler words. Try pausing silently instead of saying 'um' or 'like' — it makes you sound more confident."
                      : dashboardStats.latestScore < 60
                      ? "Your answers could be more detailed. Aim for 50+ words per answer using the STAR format: Situation, Task, Action, Result."
                      : "You're doing well! Keep practicing consistently. Try answering with a job description for more targeted feedback."
                    }
                  </p>
                </div>
              </div>
            )}

            <div style={{
              background: "#0F1729", border: "0.5px solid #1E3A6E",
              borderRadius: "12px", padding: "20px",
              display: "flex", alignItems: "center", justifyContent: "space-between"
            }}>
              <div>
                <div style={{ color: "#E2E8F0", fontSize: "15px", fontWeight: "500", marginBottom: "4px" }}>
                  {dashboardStats ? "Keep improving your score" : "Ready to start?"}
                </div>
                <div style={{ color: "#4A5568", fontSize: "13px" }}>
                  {dashboardStats
                    ? `You've completed ${dashboardStats.sessions} session${dashboardStats.sessions > 1 ? "s" : ""}. Consistency is key.`
                    : "Start a mock interview session to build your confidence."
                  }
                </div>
              </div>
              <button
                onClick={() => setCurrentPage("interview")}
                style={{
                  padding: "10px 20px", background: "#3B82F6",
                  color: "white", border: "none", borderRadius: "8px",
                  fontSize: "13px", fontWeight: "500", whiteSpace: "nowrap"
                }}
              >
                {dashboardStats ? "Practice Again" : "Start Interview"}
              </button>
            </div>
          </div>
        )}

      </div>
    </Layout>
  )
}