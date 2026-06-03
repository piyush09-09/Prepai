import { useState, useEffect } from "react"

export function HistoryView({ token }) {
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedSession, setSelectedSession] = useState(null)

  useEffect(() => {
    fetch("https://prepai-production-8ab9.up.railway.app/history", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(data => {
        setSessions(data.sessions)
        setLoading(false)
      })
  }, [])

  const chartData = sessions
    .slice()
    .reverse()
    .map((s, i) => ({
      session: `S${i + 1}`,
      score: Math.round(s.overall_score),
      date: new Date(s.created_at).toLocaleDateString()
    }))

  if (loading) return <p style={{ color: "#718096" }}>Loading history...</p>

  if (selectedSession) {
    return (
      <div>
        <button
          onClick={() => setSelectedSession(null)}
          style={{
            marginBottom: "20px", padding: "8px 16px",
            background: "#0F1729", color: "#718096",
            border: "0.5px solid #1E2D4A", borderRadius: "8px",
            fontSize: "13px", cursor: "pointer"
          }}
        >
          ← Back to History
        </button>
        <div style={{ background: "#0F1729", border: "0.5px solid #1E2D4A", borderRadius: "12px", padding: "24px", marginBottom: "16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <div>
              <h2 style={{ color: "#E2E8F0", fontSize: "18px", fontWeight: "500" }}>Session Details</h2>
              <p style={{ color: "#4A5568", fontSize: "12px", marginTop: "4px" }}>
                {new Date(selectedSession.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
              </p>
            </div>
            <div style={{
              fontSize: "28px", fontWeight: "500",
              color: selectedSession.overall_score >= 70 ? "#48BB78" : selectedSession.overall_score >= 40 ? "#ECC94B" : "#FC8181"
            }}>
              {Math.round(selectedSession.overall_score)}/100
            </div>
          </div>
        </div>

        {selectedSession.answers.map((answer, i) => (
          <div key={i} style={{
            background: "#0F1729", border: "0.5px solid #1E2D4A",
            borderRadius: "12px", padding: "20px", marginBottom: "12px"
          }}>
            <h3 style={{ color: "#E2E8F0", fontSize: "14px", fontWeight: "500", marginBottom: "12px" }}>
              Q{i + 1}: {answer.question}
            </h3>
            <p style={{ color: "#718096", fontSize: "13px", marginBottom: "8px", lineHeight: "1.6" }}>
              <span style={{ color: "#A0AEC0" }}>Answer: </span>{answer.transcript}
            </p>
            <div style={{ display: "flex", gap: "20px", marginBottom: "8px" }}>
              <span style={{ color: "#4A5568", fontSize: "12px" }}>
                Words: <span style={{ color: "#A0AEC0" }}>{answer.wordCount}</span>
              </span>
              <span style={{ color: "#4A5568", fontSize: "12px" }}>
                Eye Contact: <span style={{ color: answer.eyeContactPct >= 70 ? "#48BB78" : answer.eyeContactPct >= 40 ? "#ECC94B" : "#FC8181" }}>{answer.eyeContactPct}%</span>
              </span>
            </div>
            <p style={{ color: "#718096", fontSize: "13px", lineHeight: "1.6" }}>
              <span style={{ color: "#A0AEC0" }}>Feedback: </span>{answer.feedback}
            </p>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div>
      <div style={{ marginBottom: "24px" }}>
        <h2 style={{ color: "#E2E8F0", fontSize: "20px", fontWeight: "500", marginBottom: "4px" }}>Interview History</h2>
        <p style={{ color: "#4A5568", fontSize: "13px" }}>{sessions.length} sessions completed</p>
      </div>

      {/* improvement graph */}
      {chartData.length > 1 && (
        <div style={{ background: "#0F1729", border: "0.5px solid #1E2D4A", borderRadius: "12px", padding: "24px", marginBottom: "20px" }}>
          <div style={{ color: "#A0AEC0", fontSize: "13px", fontWeight: "500", marginBottom: "16px" }}>Score Improvement</div>
          <div style={{ backgroundColor: "white", borderRadius: "8px", padding: "16px" }}>
            {(() => {
              const w = 550, h = 220
              const padL = 50, padR = 20, padT = 20, padB = 40
              const innerW = w - padL - padR
              const innerH = h - padT - padB
              const n = chartData.length
              const xPos = (i) => padL + (i / (n - 1)) * innerW
              const yPos = (score) => padT + innerH - (score / 100) * innerH
              const points = chartData.map((d, i) => `${xPos(i)},${yPos(d.score)}`).join(" ")
              return (
                <div style={{ position: "relative", display: "inline-block" }}>
                  <svg width={w} height={h}>
                    <line x1={padL} y1={padT} x2={padL} y2={padT + innerH} stroke="#333" strokeWidth={1} />
                    <line x1={padL} y1={padT + innerH} x2={padL + innerW} y2={padT + innerH} stroke="#333" strokeWidth={1} />
                    {[0, 25, 50, 75, 100].map(v => (
                      <g key={v}>
                        <line x1={padL - 5} y1={yPos(v)} x2={padL} y2={yPos(v)} stroke="#333" strokeWidth={1} />
                        <text x={padL - 8} y={yPos(v) + 4} textAnchor="end" fontSize={11} fill="#333">{v}</text>
                      </g>
                    ))}
                    {chartData.map((d, i) => (
                      <g key={i}>
                        <line x1={xPos(i)} y1={padT + innerH} x2={xPos(i)} y2={padT + innerH + 5} stroke="#333" strokeWidth={1} />
                        <text x={xPos(i)} y={padT + innerH + 18} textAnchor="middle" fontSize={11} fill="#333">{d.session}</text>
                      </g>
                    ))}
                    {[25, 50, 75].map(v => (
                      <line key={v} x1={padL} y1={yPos(v)} x2={padL + innerW} y2={yPos(v)} stroke="#eee" strokeWidth={1} strokeDasharray="4 4" />
                    ))}
                    <polyline points={points} fill="none" stroke="#3B82F6" strokeWidth={2.5} />
                    {chartData.map((d, i) => (
                      <circle
                        key={i} cx={xPos(i)} cy={yPos(d.score)} r={6} fill="#3B82F6"
                        style={{ cursor: "pointer" }}
                        onMouseEnter={(e) => {
                          const tooltip = document.getElementById("chart-tooltip")
                          tooltip.style.display = "block"
                          tooltip.style.left = `${xPos(i) + 10}px`
                          tooltip.style.top = `${yPos(d.score) - 30}px`
                          tooltip.innerText = `${d.session}: ${d.score}/100`
                        }}
                        onMouseLeave={() => {
                          document.getElementById("chart-tooltip").style.display = "none"
                        }}
                      />
                    ))}
                    <text x={padL + innerW / 2} y={h - 2} textAnchor="middle" fontSize={12} fill="#666">Session</text>
                    <text x={12} y={padT + innerH / 2} textAnchor="middle" fontSize={12} fill="#666" transform={`rotate(-90, 12, ${padT + innerH / 2})`}>Score</text>
                  </svg>
                  <div id="chart-tooltip" style={{
                    display: "none", position: "absolute",
                    backgroundColor: "#1e1e1e", color: "white",
                    padding: "6px 10px", borderRadius: "4px",
                    fontSize: "13px", pointerEvents: "none", whiteSpace: "nowrap", zIndex: 10
                  }} />
                </div>
              )
            })()}
          </div>
        </div>
      )}

      {/* sessions list */}
      <div style={{ background: "#0F1729", border: "0.5px solid #1E2D4A", borderRadius: "12px", padding: "20px" }}>
        <div style={{ color: "#A0AEC0", fontSize: "13px", fontWeight: "500", marginBottom: "14px" }}>Past Sessions</div>
        {sessions.length === 0 && (
          <p style={{ color: "#4A5568", fontSize: "13px" }}>No sessions yet. Complete your first interview to see history here.</p>
        )}
        {sessions.map((session, i) => (
          <div
            key={session.id}
            onClick={() => setSelectedSession(session)}
            style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "14px", background: "#0B1120", borderRadius: "8px",
              marginBottom: "8px", cursor: "pointer"
            }}
            onMouseEnter={e => e.currentTarget.style.background = "#1A2540"}
            onMouseLeave={e => e.currentTarget.style.background = "#0B1120"}
          >
            <div>
              <div style={{ color: "#E2E8F0", fontSize: "13px", fontWeight: "500" }}>Session {sessions.length - i}</div>
              <div style={{ color: "#4A5568", fontSize: "11px", marginTop: "2px" }}>
                {new Date(session.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })} · {session.answers.length} questions
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{
                fontSize: "16px", fontWeight: "500",
                color: session.overall_score >= 70 ? "#48BB78" : session.overall_score >= 40 ? "#ECC94B" : "#FC8181"
              }}>
                {Math.round(session.overall_score)}/100
              </div>
              <div style={{ color: "#4A5568", fontSize: "11px", marginTop: "2px" }}>View details →</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Profile({ token, user }) {
  const [profilePhoto, setProfilePhoto] = useState(localStorage.getItem("profilePhoto") || null)
  const [editingUsername, setEditingUsername] = useState(false)
  const [newUsername, setNewUsername] = useState(user)
  const [changingPassword, setChangingPassword] = useState(false)
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordMsg, setPasswordMsg] = useState("")
  const [sessions, setSessions] = useState([])

  useEffect(() => {
    fetch("https://prepai-production-8ab9.up.railway.app/history", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(data => setSessions(data.sessions))
  }, [])

  function handlePhotoUpload(e) {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      localStorage.setItem("profilePhoto", reader.result)
      setProfilePhoto(reader.result)
    }
    reader.readAsDataURL(file)
  }

  const bestScore = sessions.length > 0
    ? Math.round(Math.max(...sessions.map(s => s.overall_score)))
    : null

  const avgEyeContact = sessions.length > 0
    ? Math.round(
        sessions.flatMap(s => s.answers).reduce((sum, a) => sum + (a.eyeContactPct || 0), 0) /
        Math.max(sessions.flatMap(s => s.answers).length, 1)
      )
    : null

  return (
    <div>
      <div style={{ marginBottom: "24px" }}>
        <h2 style={{ color: "#E2E8F0", fontSize: "20px", fontWeight: "500", marginBottom: "4px" }}>Profile</h2>
        <p style={{ color: "#4A5568", fontSize: "13px" }}>Manage your account and personal details</p>
      </div>

      {/* profile card */}
      <div style={{ background: "#0F1729", border: "0.5px solid #1E2D4A", borderRadius: "12px", padding: "24px", marginBottom: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "24px" }}>
          <div style={{ position: "relative" }}>
            {profilePhoto ? (
              <img src={profilePhoto} style={{ width: "72px", height: "72px", borderRadius: "50%", objectFit: "cover" }} />
            ) : (
              <div style={{
                width: "72px", height: "72px", borderRadius: "50%",
                background: "#1E3A6E", display: "flex", alignItems: "center",
                justifyContent: "center", color: "#60A5FA", fontSize: "24px", fontWeight: "500"
              }}>
                {user?.[0]?.toUpperCase()}
              </div>
            )}
            <label style={{
              position: "absolute", bottom: 0, right: 0,
              background: "#3B82F6", borderRadius: "50%",
              width: "22px", height: "22px", display: "flex",
              alignItems: "center", justifyContent: "center", cursor: "pointer"
            }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
              <input type="file" accept="image/*" onChange={handlePhotoUpload} style={{ display: "none" }} />
            </label>
          </div>
          <div style={{ flex: 1 }}>
            {editingUsername ? (
              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <input
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  style={{
                    padding: "7px 12px", background: "#0B1120",
                    border: "0.5px solid #1E2D4A", borderRadius: "8px",
                    color: "#E2E8F0", fontSize: "14px", outline: "none"
                  }}
                />
                <button
                  onClick={() => {
                    localStorage.setItem("username", newUsername)
                    setEditingUsername(false)
                  }}
                  style={{ padding: "7px 14px", background: "#3B82F6", color: "white", border: "none", borderRadius: "8px", fontSize: "13px", cursor: "pointer" }}
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingUsername(false)}
                  style={{ padding: "7px 14px", background: "#1A2540", color: "#718096", border: "0.5px solid #1E2D4A", borderRadius: "8px", fontSize: "13px", cursor: "pointer" }}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ color: "#E2E8F0", fontSize: "18px", fontWeight: "500" }}>{newUsername}</span>
                <button
                  onClick={() => setEditingUsername(true)}
                  style={{ background: "none", border: "none", color: "#4A5568", cursor: "pointer", padding: "2px" }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                </button>
              </div>
            )}
            <p style={{ color: "#4A5568", fontSize: "13px", marginTop: "4px" }}>{sessions.length} sessions completed</p>
          </div>
        </div>

        {/* stats row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
          <div style={{ background: "#0B1120", borderRadius: "10px", padding: "14px" }}>
            <div style={{ color: "#4A5568", fontSize: "11px", marginBottom: "6px" }}>Best Score</div>
            <div style={{ color: bestScore >= 70 ? "#48BB78" : bestScore >= 40 ? "#ECC94B" : "#E2E8F0", fontSize: "22px", fontWeight: "500" }}>
              {bestScore !== null ? `${bestScore}/100` : "—"}
            </div>
          </div>
          <div style={{ background: "#0B1120", borderRadius: "10px", padding: "14px" }}>
            <div style={{ color: "#4A5568", fontSize: "11px", marginBottom: "6px" }}>Avg Eye Contact</div>
            <div style={{ color: "#06B6D4", fontSize: "22px", fontWeight: "500" }}>
              {avgEyeContact !== null ? `${avgEyeContact}%` : "—"}
            </div>
          </div>
          <div style={{ background: "#0B1120", borderRadius: "10px", padding: "14px" }}>
            <div style={{ color: "#4A5568", fontSize: "11px", marginBottom: "6px" }}>Sessions Done</div>
            <div style={{ color: "#9F7AEA", fontSize: "22px", fontWeight: "500" }}>{sessions.length}</div>
          </div>
        </div>
      </div>

      {/* change password */}
      <div style={{ background: "#0F1729", border: "0.5px solid #1E2D4A", borderRadius: "12px", padding: "24px", marginBottom: "16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: changingPassword ? "20px" : "0" }}>
          <div>
            <div style={{ color: "#E2E8F0", fontSize: "14px", fontWeight: "500" }}>Password</div>
            <div style={{ color: "#4A5568", fontSize: "12px", marginTop: "2px" }}>Update your account password</div>
          </div>
          <button
            onClick={() => { setChangingPassword(!changingPassword); setPasswordMsg("") }}
            style={{
              padding: "7px 14px", background: "#1A2540",
              color: "#718096", border: "0.5px solid #1E2D4A",
              borderRadius: "8px", fontSize: "13px", cursor: "pointer"
            }}
          >
            {changingPassword ? "Cancel" : "Change Password"}
          </button>
        </div>

        {changingPassword && (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {[
              { label: "New Password", value: newPassword, setter: setNewPassword },
              { label: "Confirm Password", value: confirmPassword, setter: setConfirmPassword },
            ].map((field, i) => (
              <div key={i}>
                <label style={{ display: "block", color: "#718096", fontSize: "12px", marginBottom: "6px" }}>{field.label}</label>
                <input
                  type="password"
                  value={field.value}
                  onChange={(e) => field.setter(e.target.value)}
                  style={{
                    width: "100%", padding: "10px 14px",
                    background: "#0B1120", border: "0.5px solid #1E2D4A",
                    borderRadius: "8px", color: "#E2E8F0", fontSize: "13px",
                    outline: "none", boxSizing: "border-box"
                  }}
                />
              </div>
            ))}

            {passwordMsg && (
              <p style={{ color: passwordMsg.includes("success") ? "#48BB78" : "#FC8181", fontSize: "13px" }}>
                {passwordMsg}
              </p>
            )}

            <button
              onClick={() => {
                if (newPassword !== confirmPassword) {
                  setPasswordMsg("Passwords don't match")
                  return
                }
                if (newPassword.length < 6) {
                  setPasswordMsg("Password must be at least 6 characters")
                  return
                }
                setPasswordMsg("Password changed successfully!")
                setNewPassword("")
                setConfirmPassword("")
                setTimeout(() => setChangingPassword(false), 1500)
              }}
              style={{
                padding: "9px 20px", background: "#3B82F6",
                color: "white", border: "none", borderRadius: "8px",
                fontSize: "13px", cursor: "pointer", alignSelf: "flex-start"
              }}
            >
              Update Password
            </button>
          </div>
        )}
      </div>

      {/* account info */}
      <div style={{ background: "#0F1729", border: "0.5px solid #1E2D4A", borderRadius: "12px", padding: "24px" }}>
        <div style={{ color: "#A0AEC0", fontSize: "13px", fontWeight: "500", marginBottom: "16px" }}>Account Info</div>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "0.5px solid #1E2D4A" }}>
            <span style={{ color: "#4A5568", fontSize: "13px" }}>Username</span>
            <span style={{ color: "#A0AEC0", fontSize: "13px" }}>{newUsername}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "0.5px solid #1E2D4A" }}>
            <span style={{ color: "#4A5568", fontSize: "13px" }}>Member since</span>
            <span style={{ color: "#A0AEC0", fontSize: "13px" }}>
              {new Date().toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
            </span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0" }}>
            <span style={{ color: "#4A5568", fontSize: "13px" }}>Plan</span>
            <span style={{ color: "#48BB78", fontSize: "13px" }}>Free</span>
          </div>
        </div>
      </div>
    </div>
  )
}