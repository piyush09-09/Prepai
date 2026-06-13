export default function Landing({ onGetStarted }) {
  return (
    <div style={{ background: "#0B1120", minHeight: "100vh", fontFamily: "'Inter', sans-serif" }}>

      {/* navbar */}
      <nav style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "16px 60px", borderBottom: "0.5px solid #1E2D4A",
        position: "sticky", top: 0, background: "#0B1120", zIndex: 100
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{
            width: "32px", height: "32px", background: "#2563eb",
            borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center"
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
            </svg>
          </div>
          <span style={{ color: "#E2E8F0", fontSize: "18px", fontWeight: "600" }}>PrepAI</span>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <button
            onClick={onGetStarted}
            style={{
              padding: "8px 18px", background: "transparent",
              color: "#A0AEC0", border: "0.5px solid #1E2D4A",
              borderRadius: "8px", fontSize: "14px", cursor: "pointer"
            }}
          >
            Sign in
          </button>
          <button
            onClick={onGetStarted}
            style={{
              padding: "8px 18px", background: "#2563eb",
              color: "white", border: "none",
              borderRadius: "8px", fontSize: "14px", fontWeight: "500", cursor: "pointer"
            }}
          >
            Get started free
          </button>
        </div>
      </nav>

      {/* hero */}
      <section style={{ padding: "100px 60px 80px", textAlign: "center", maxWidth: "800px", margin: "0 auto" }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: "8px",
          background: "#0F1729", border: "0.5px solid #1E3A6E",
          borderRadius: "20px", padding: "6px 14px", marginBottom: "28px"
        }}>
          <div style={{ width: "6px", height: "6px", background: "#48BB78", borderRadius: "50%" }} />
          <span style={{ color: "#60A5FA", fontSize: "13px" }}>Free to use — no credit card needed</span>
        </div>

        <h1 style={{
          color: "#E2E8F0", fontSize: "44px", fontWeight: "600",
          lineHeight: "1.2", marginBottom: "20px", letterSpacing: "-0.5px"
        }}>
          Practice interviews with your camera, mic, and an AI coach that actually watches
        </h1>

        <p style={{
          color: "#718096", fontSize: "17px", lineHeight: "1.7",
          marginBottom: "40px", maxWidth: "580px", margin: "0 auto 40px"
        }}>
          PrepAI transcribes your answers with Whisper, tracks eye contact with MediaPipe, counts your filler words, and gives you feedback from LLaMA — all in the browser. Upload a job description and every critique is tailored to the role.
        </p>

        <button
          onClick={onGetStarted}
          style={{
            padding: "14px 32px", background: "#2563eb",
            color: "white", border: "none", borderRadius: "8px",
            fontSize: "15px", fontWeight: "500", cursor: "pointer"
          }}
        >
          Start a mock interview
        </button>
      </section>

      {/* how it works — 4 steps, not 3 */}
      <section style={{ padding: "60px", background: "#0F1729" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <p style={{ color: "#718096", fontSize: "13px", fontWeight: "500", marginBottom: "12px", textAlign: "center", textTransform: "uppercase", letterSpacing: "1px" }}>How it works</p>
          <h2 style={{ color: "#E2E8F0", fontSize: "28px", fontWeight: "600", textAlign: "center", marginBottom: "48px" }}>
            Four steps from nervous to prepared
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            {[
              {
                step: "1",
                title: "Paste the job description",
                desc: "Drop in the JD you're applying for. Our RAG pipeline chunks it, embeds it, and uses it to tailor every piece of feedback to that role.",
                icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              },
              {
                step: "2",
                title: "Answer questions out loud",
                desc: "Your camera and mic activate. Speak naturally — MediaPipe tracks your iris position to measure eye contact at 30fps.",
                icon: "M15 10l4.553-2.069A1 1 0 0121 8.87V15.13a1 1 0 01-1.447.9L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z"
              },
              {
                step: "3",
                title: "Get transcribed and scored",
                desc: "Whisper transcribes your speech. The system counts filler words, measures word count, and calculates your eye contact percentage.",
                icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              },
              {
                step: "4",
                title: "Read AI coaching feedback",
                desc: "LLaMA 3.3 compares your answer against strong examples from the vector database and your JD context, then gives specific suggestions.",
                icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              }
            ].map((item, i) => (
              <div key={i} style={{
                padding: "24px", background: "#0B1120",
                borderRadius: "10px", border: "0.5px solid #1E2D4A"
              }}>
                <div style={{
                  display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px"
                }}>
                  <div style={{
                    width: "28px", height: "28px", background: "#1E3A6E",
                    borderRadius: "6px", display: "flex", alignItems: "center",
                    justifyContent: "center", color: "#60A5FA", fontSize: "13px", fontWeight: "600"
                  }}>
                    {item.step}
                  </div>
                  <h3 style={{ color: "#E2E8F0", fontSize: "15px", fontWeight: "500" }}>{item.title}</h3>
                </div>
                <p style={{ color: "#718096", fontSize: "13px", lineHeight: "1.7" }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* what gets measured — specific, not generic */}
      <section style={{ padding: "80px 60px", maxWidth: "900px", margin: "0 auto" }}>
        <p style={{ color: "#718096", fontSize: "13px", fontWeight: "500", marginBottom: "12px", textAlign: "center", textTransform: "uppercase", letterSpacing: "1px" }}>What gets measured</p>
        <h2 style={{ color: "#E2E8F0", fontSize: "28px", fontWeight: "600", textAlign: "center", marginBottom: "48px" }}>
          Every answer is scored on five dimensions
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          {[
            { title: "Eye contact via iris tracking", desc: "MediaPipe FaceLandmarker detects landmarks 468 and 473 (iris centers) and calculates a centered ratio against the eye corners. Runs at 30fps entirely in-browser.", color: "#2563eb" },
            { title: "Speech-to-text with Whisper", desc: "Your recorded audio is sent to Groq's Whisper large-v3 model. The full transcript appears after each answer — no manual typing needed.", color: "#06B6D4" },
            { title: "Filler word frequency", desc: "The system flags 'um', 'uh', 'like', 'basically', and 'you know' in your transcript. Each one costs points. The goal is pausing instead of filling.", color: "#48BB78" },
            { title: "Answer depth (word count)", desc: "Short answers under 20 words score low. Strong answers hit 50+ words with specific examples. The score reflects interview-ready detail level.", color: "#9F7AEA" },
            { title: "Role-specific AI coaching", desc: "ChromaDB stores example answers and your uploaded JD. LLaMA 3.3 retrieves relevant context and compares your answer against strong examples for that role.", color: "#ECC94B" },
            { title: "Improvement over sessions", desc: "Every session is saved with per-question breakdowns. Your profile shows a score trend graph so you can see whether you're actually getting better.", color: "#FC8181" },
          ].map((f, i) => (
            <div key={i} style={{
              background: "#0F1729", border: "0.5px solid #1E2D4A",
              borderRadius: "10px", padding: "20px"
            }}>
              <div style={{
                width: "8px", height: "8px", borderRadius: "50%",
                background: f.color, marginBottom: "12px"
              }} />
              <h3 style={{ color: "#E2E8F0", fontSize: "14px", fontWeight: "500", marginBottom: "8px" }}>{f.title}</h3>
              <p style={{ color: "#4A5568", fontSize: "13px", lineHeight: "1.6" }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* tech stack — shows this isn't generic */}
      <section style={{ padding: "60px", background: "#0F1729" }}>
        <div style={{ maxWidth: "700px", margin: "0 auto", textAlign: "center" }}>
          <p style={{ color: "#718096", fontSize: "13px", fontWeight: "500", marginBottom: "12px", textTransform: "uppercase", letterSpacing: "1px" }}>Built with</p>
          <div style={{ display: "flex", justifyContent: "center", gap: "24px", flexWrap: "wrap", marginTop: "20px" }}>
            {["React", "FastAPI", "Whisper", "LLaMA 3.3", "MediaPipe", "ChromaDB", "SQLite", "Vercel", "Railway"].map(tech => (
              <span key={tech} style={{
                color: "#4A5568", fontSize: "13px",
                padding: "6px 14px", background: "#0B1120",
                borderRadius: "6px", border: "0.5px solid #1E2D4A"
              }}>
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "80px 60px", textAlign: "center" }}>
        <div style={{
          background: "#0F1729", border: "0.5px solid #1E2D4A",
          borderRadius: "12px", padding: "48px", maxWidth: "600px", margin: "0 auto"
        }}>
          <h2 style={{ color: "#E2E8F0", fontSize: "24px", fontWeight: "600", marginBottom: "12px" }}>
            Your next interview is coming up
          </h2>
          <p style={{ color: "#718096", fontSize: "15px", lineHeight: "1.6", marginBottom: "28px" }}>
            The difference between "I should practice" and actually practicing is about 30 seconds. That's how long signup takes.
          </p>
          <button
            onClick={onGetStarted}
            style={{
              padding: "12px 28px", background: "#2563eb",
              color: "white", border: "none", borderRadius: "8px",
              fontSize: "14px", fontWeight: "500", cursor: "pointer"
            }}
          >
            Start practicing
          </button>
        </div>
      </section>

      {/* footer — no dead links */}
      <footer style={{
        padding: "32px 60px", borderTop: "0.5px solid #1E2D4A",
        display: "flex", justifyContent: "space-between", alignItems: "center"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{
            width: "20px", height: "20px", background: "#2563eb",
            borderRadius: "4px", display: "flex", alignItems: "center", justifyContent: "center"
          }}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
            </svg>
          </div>
          <span style={{ color: "#4A5568", fontSize: "13px" }}>PrepAI</span>
        </div>
        <span style={{ color: "#2D3748", fontSize: "12px" }}>
          Built by Piyush Kumar · IIIT Vadodara
        </span>
      </footer>

    </div>
  )
}