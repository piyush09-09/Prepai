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
            width: "32px", height: "32px", background: "#3B82F6",
            borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center"
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
            </svg>
          </div>
          <span style={{ color: "#E2E8F0", fontSize: "18px", fontWeight: "600" }}>PrepAI</span>
        </div>
        <div style={{ display: "flex", gap: "32px", alignItems: "center" }}>
          {["Features", "How it works", "Pricing"].map(item => (
            <span key={item} style={{ color: "#718096", fontSize: "14px", cursor: "pointer" }}
              onMouseEnter={e => e.currentTarget.style.color = "#E2E8F0"}
              onMouseLeave={e => e.currentTarget.style.color = "#718096"}
            >{item}</span>
          ))}
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
              padding: "8px 18px", background: "#3B82F6",
              color: "white", border: "none",
              borderRadius: "8px", fontSize: "14px", fontWeight: "500", cursor: "pointer"
            }}
          >
            Get started free
          </button>
        </div>
      </nav>

      {/* hero */}
      <section style={{ padding: "100px 60px 80px", textAlign: "center", maxWidth: "900px", margin: "0 auto" }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: "8px",
          background: "#0F1729", border: "0.5px solid #1E3A6E",
          borderRadius: "20px", padding: "6px 14px", marginBottom: "28px"
        }}>
          <div style={{ width: "6px", height: "6px", background: "#48BB78", borderRadius: "50%" }} />
          <span style={{ color: "#60A5FA", fontSize: "13px" }}>AI-powered interview coaching — free to start</span>
        </div>

        <h1 style={{
          color: "#E2E8F0", fontSize: "56px", fontWeight: "600",
          lineHeight: "1.15", marginBottom: "20px", letterSpacing: "-1px"
        }}>
          Land your{" "}
          <span style={{
            background: "linear-gradient(135deg, #3B82F6, #06B6D4)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
          }}>
            dream job
          </span>
          <br />with AI coaching
        </h1>

        <p style={{
          color: "#718096", fontSize: "18px", lineHeight: "1.7",
          marginBottom: "40px", maxWidth: "600px", margin: "0 auto 40px"
        }}>
          Practice interview questions with real-time AI feedback. Get scored on your answers, eye contact, speech clarity, and filler words — all in your browser.
        </p>

        <div style={{ display: "flex", gap: "14px", justifyContent: "center", marginBottom: "20px" }}>
          <button
            onClick={onGetStarted}
            style={{
              padding: "14px 32px", background: "#3B82F6",
              color: "white", border: "none", borderRadius: "10px",
              fontSize: "15px", fontWeight: "500", cursor: "pointer"
            }}
          >
            Start practicing for free →
          </button>
          <button
            style={{
              padding: "14px 32px", background: "#0F1729",
              color: "#A0AEC0", border: "0.5px solid #1E2D4A",
              borderRadius: "10px", fontSize: "15px", cursor: "pointer"
            }}
          >
            Watch demo
          </button>
        </div>
        <p style={{ color: "#4A5568", fontSize: "13px" }}>No credit card required · Free forever plan</p>
      </section>

      {/* mock dashboard preview */}
      <section style={{ padding: "0 60px 80px", maxWidth: "1000px", margin: "0 auto" }}>
        <div style={{
          background: "#0F1729", border: "0.5px solid #1E2D4A",
          borderRadius: "16px", padding: "24px", overflow: "hidden"
        }}>
          <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
            <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#FC8181" }} />
            <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#ECC94B" }} />
            <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#48BB78" }} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "12px", marginBottom: "16px" }}>
            {[
              { label: "Readiness Score", value: "83/100", color: "#3B82F6" },
              { label: "Eye Contact", value: "76%", color: "#06B6D4" },
              { label: "Filler Words", value: "3 used", color: "#48BB78" },
              { label: "Sessions Done", value: "12", color: "#9F7AEA" },
            ].map((m, i) => (
              <div key={i} style={{ background: "#0B1120", borderRadius: "10px", padding: "14px" }}>
                <div style={{ color: "#4A5568", fontSize: "11px", marginBottom: "6px" }}>{m.label}</div>
                <div style={{ color: m.color, fontSize: "20px", fontWeight: "500" }}>{m.value}</div>
              </div>
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div style={{ background: "#0B1120", borderRadius: "10px", padding: "14px" }}>
              <div style={{ color: "#4A5568", fontSize: "11px", marginBottom: "8px" }}>Current Question</div>
              <p style={{ color: "#E2E8F0", fontSize: "13px", lineHeight: "1.5" }}>Tell me about a time you faced a technical challenge and how you resolved it.</p>
            </div>
            <div style={{ background: "#0B1120", borderRadius: "10px", padding: "14px" }}>
              <div style={{ color: "#4A5568", fontSize: "11px", marginBottom: "8px" }}>AI Feedback</div>
              <p style={{ color: "#718096", fontSize: "13px", lineHeight: "1.5" }}>Good use of the STAR format. Try to quantify your impact — mention specific metrics or outcomes.</p>
            </div>
          </div>
        </div>
      </section>

      {/* social proof */}
      <section style={{ padding: "0 60px 80px", textAlign: "center" }}>
        <p style={{ color: "#4A5568", fontSize: "13px", marginBottom: "24px" }}>Trusted by job seekers preparing for top companies</p>
        <div style={{ display: "flex", justifyContent: "center", gap: "40px", flexWrap: "wrap" }}>
          {["Google", "Amazon", "Microsoft", "Flipkart", "Infosys", "TCS"].map(company => (
            <span key={company} style={{ color: "#2D3748", fontSize: "16px", fontWeight: "600", letterSpacing: "1px" }}>
              {company}
            </span>
          ))}
        </div>
      </section>

      {/* how it works */}
      <section style={{ padding: "60px", background: "#0F1729" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <p style={{ color: "#3B82F6", fontSize: "13px", fontWeight: "500", marginBottom: "12px", textAlign: "center" }}>HOW IT WORKS</p>
          <h2 style={{ color: "#E2E8F0", fontSize: "36px", fontWeight: "600", textAlign: "center", marginBottom: "60px", letterSpacing: "-0.5px" }}>
            Three steps to interview confidence
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "32px" }}>
            {[
              {
                step: "01",
                title: "Choose your role",
                desc: "Paste the job description you're applying for. PrepAI tailors every question and feedback to that specific role.",
                icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              },
              {
                step: "02",
                title: "Practice out loud",
                desc: "Answer questions using your mic and camera. Our AI tracks your eye contact, speech pace, and filler word usage in real time.",
                icon: "M15 10l4.553-2.069A1 1 0 0121 8.87V15.13a1 1 0 01-1.447.9L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z"
              },
              {
                step: "03",
                title: "Get instant feedback",
                desc: "Receive detailed AI coaching after every answer. Track your improvement across sessions and see your readiness score grow.",
                icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              }
            ].map((item, i) => (
              <div key={i} style={{ padding: "28px", background: "#0B1120", borderRadius: "12px", border: "0.5px solid #1E2D4A" }}>
                <div style={{ color: "#1E3A6E", fontSize: "28px", fontWeight: "700", marginBottom: "16px" }}>{item.step}</div>
                <div style={{
                  width: "36px", height: "36px", background: "#1E3A6E",
                  borderRadius: "8px", display: "flex", alignItems: "center",
                  justifyContent: "center", marginBottom: "14px"
                }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#60A5FA" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d={item.icon} />
                  </svg>
                </div>
                <h3 style={{ color: "#E2E8F0", fontSize: "16px", fontWeight: "500", marginBottom: "10px" }}>{item.title}</h3>
                <p style={{ color: "#718096", fontSize: "13px", lineHeight: "1.7" }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* features */}
      <section style={{ padding: "80px 60px", maxWidth: "1000px", margin: "0 auto" }}>
        <p style={{ color: "#3B82F6", fontSize: "13px", fontWeight: "500", marginBottom: "12px", textAlign: "center" }}>FEATURES</p>
        <h2 style={{ color: "#E2E8F0", fontSize: "36px", fontWeight: "600", textAlign: "center", marginBottom: "60px", letterSpacing: "-0.5px" }}>
          Everything you need to ace the interview
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          {[
            { title: "Real-time eye contact tracking", desc: "MediaPipe iris detection monitors whether you're maintaining camera eye contact throughout your answer.", color: "#3B82F6" },
            { title: "AI-powered transcription", desc: "Whisper AI transcribes your spoken answers instantly. No typing needed — just speak naturally.", color: "#06B6D4" },
            { title: "RAG-based feedback", desc: "Upload a job description and our RAG pipeline retrieves role-specific examples to personalize your coaching.", color: "#9F7AEA" },
            { title: "Filler word detection", desc: "Automatically detects 'um', 'uh', 'like', and 'basically' in your answers and tracks improvement over time.", color: "#48BB78" },
            { title: "Session history & progress", desc: "Every session is saved to your account. View detailed breakdowns and track your improvement graph.", color: "#ECC94B" },
            { title: "Score per answer", desc: "Each answer gets scored on word count, eye contact, filler words, and AI feedback quality.", color: "#FC8181" },
          ].map((f, i) => (
            <div key={i} style={{ background: "#0F1729", border: "0.5px solid #1E2D4A", borderRadius: "12px", padding: "24px", display: "flex", gap: "16px" }}>
              <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: f.color, flexShrink: 0, marginTop: "6px" }} />
              <div>
                <h3 style={{ color: "#E2E8F0", fontSize: "14px", fontWeight: "500", marginBottom: "8px" }}>{f.title}</h3>
                <p style={{ color: "#718096", fontSize: "13px", lineHeight: "1.6" }}>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "80px 60px", textAlign: "center" }}>
        <div style={{
          background: "#0F1729", border: "0.5px solid #1E3A6E",
          borderRadius: "16px", padding: "60px", maxWidth: "700px", margin: "0 auto"
        }}>
          <h2 style={{ color: "#E2E8F0", fontSize: "36px", fontWeight: "600", marginBottom: "16px", letterSpacing: "-0.5px" }}>
            Start your interview prep today
          </h2>
          <p style={{ color: "#718096", fontSize: "16px", lineHeight: "1.6", marginBottom: "32px" }}>
            Join thousands of job seekers who use PrepAI to practice smarter and interview with confidence.
          </p>
          <button
            onClick={onGetStarted}
            style={{
              padding: "14px 40px", background: "#3B82F6",
              color: "white", border: "none", borderRadius: "10px",
              fontSize: "15px", fontWeight: "500", cursor: "pointer"
            }}
          >
            Get started for free →
          </button>
          <p style={{ color: "#4A5568", fontSize: "13px", marginTop: "16px" }}>Free forever · No credit card needed</p>
        </div>
      </section>

      {/* footer */}
      <footer style={{ padding: "40px 60px", borderTop: "0.5px solid #1E2D4A", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ width: "24px", height: "24px", background: "#3B82F6", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
            </svg>
          </div>
          <span style={{ color: "#4A5568", fontSize: "13px" }}>© 2026 PrepAI. All rights reserved.</span>
        </div>
        <div style={{ display: "flex", gap: "24px" }}>
          {["Privacy", "Terms", "Contact"].map(item => (
            <span key={item} style={{ color: "#4A5568", fontSize: "13px", cursor: "pointer" }}
              onMouseEnter={e => e.currentTarget.style.color = "#718096"}
              onMouseLeave={e => e.currentTarget.style.color = "#4A5568"}
            >{item}</span>
          ))}
        </div>
      </footer>

    </div>
  )
}