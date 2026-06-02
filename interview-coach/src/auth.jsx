import { useState } from "react"

export default function Auth({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit() {
    setLoading(true)
    setError("")

    const url = isLogin
      ? "http://127.0.0.1:8000/login"
      : "http://127.0.0.1:8000/signup"

    const body = isLogin
      ? new URLSearchParams({ username: email, password })
      : JSON.stringify({ email, username, password })

    const headers = isLogin
      ? { "Content-Type": "application/x-www-form-urlencoded" }
      : { "Content-Type": "application/json" }

    try {
      const response = await fetch(url, { method: "POST", headers, body })
      const data = await response.json()

      if (!response.ok) {
        setError(data.detail || "Something went wrong")
        setLoading(false)
        return
      }

      localStorage.setItem("token", data.access_token)
      localStorage.setItem("username", data.username)
      localStorage.setItem("user_id", data.user_id)
      onLogin(data.username)
    } catch (e) {
      setError("Could not connect to server")
    }

    setLoading(false)
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0B1120",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px"
    }}>
      <div style={{ width: "100%", maxWidth: "420px" }}>

        {/* logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "40px", justifyContent: "center" }}>
          <div style={{
            width: "36px", height: "36px", background: "#3B82F6",
            borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center"
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
            </svg>
          </div>
          <span style={{ color: "#E2E8F0", fontSize: "20px", fontWeight: "600" }}>PrepAI</span>
        </div>

        {/* card */}
        <div style={{
          background: "#0F1729",
          border: "0.5px solid #1E2D4A",
          borderRadius: "16px",
          padding: "32px"
        }}>
          <h2 style={{ color: "#E2E8F0", fontSize: "20px", fontWeight: "500", marginBottom: "6px" }}>
            {isLogin ? "Welcome back" : "Create account"}
          </h2>
          <p style={{ color: "#4A5568", fontSize: "13px", marginBottom: "28px" }}>
            {isLogin ? "Sign in to continue your interview prep" : "Start your interview preparation journey"}
          </p>

          {!isLogin && (
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", color: "#718096", fontSize: "12px", marginBottom: "6px" }}>Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="piyush_kumar"
                style={{
                  width: "100%", padding: "10px 14px",
                  background: "#0B1120", border: "0.5px solid #1E2D4A",
                  borderRadius: "8px", color: "#E2E8F0", fontSize: "14px", outline: "none"
                }}
              />
            </div>
          )}

          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", color: "#718096", fontSize: "12px", marginBottom: "6px" }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              style={{
                width: "100%", padding: "10px 14px",
                background: "#0B1120", border: "0.5px solid #1E2D4A",
                borderRadius: "8px", color: "#E2E8F0", fontSize: "14px", outline: "none"
              }}
            />
          </div>

          <div style={{ marginBottom: "24px" }}>
            <label style={{ display: "block", color: "#718096", fontSize: "12px", marginBottom: "6px" }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{
                width: "100%", padding: "10px 14px",
                background: "#0B1120", border: "0.5px solid #1E2D4A",
                borderRadius: "8px", color: "#E2E8F0", fontSize: "14px", outline: "none"
              }}
            />
          </div>

          {error && (
            <div style={{
              background: "#2D1B1B", border: "0.5px solid #742A2A",
              borderRadius: "8px", padding: "10px 14px",
              color: "#FC8181", fontSize: "13px", marginBottom: "16px"
            }}>
              {error}
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              width: "100%", padding: "11px",
              background: loading ? "#1E3A6E" : "#3B82F6",
              color: "white", border: "none", borderRadius: "8px",
              fontSize: "14px", fontWeight: "500",
              cursor: loading ? "not-allowed" : "pointer"
            }}
          >
            {loading ? "Please wait..." : isLogin ? "Sign in" : "Create account"}
          </button>

          <p style={{ textAlign: "center", marginTop: "20px", color: "#4A5568", fontSize: "13px" }}>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <span
              onClick={() => { setIsLogin(!isLogin); setError("") }}
              style={{ color: "#3B82F6", cursor: "pointer" }}
            >
              {isLogin ? "Sign up" : "Sign in"}
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}