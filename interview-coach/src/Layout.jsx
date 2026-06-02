import { useState } from "react"

const navItems = [
  { id: "dashboard", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6", label: "Dashboard" },
  { id: "interview", icon: "M15 10l4.553-2.069A1 1 0 0121 8.87V15.13a1 1 0 01-1.447.9L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z", label: "Mock Interview" },
  { id: "history", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z", label: "History" },
  { id: "profile", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z", label: "Profile" },
]

function NavIcon({ path }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d={path} />
    </svg>
  )
}

export default function Layout({ user, onLogout, currentPage, setCurrentPage,onPageChange, children }) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0B1120" }}>

      {/* sidebar */}
      <div style={{
        width: collapsed ? "60px" : "220px",
        background: "#0F1729",
        borderRight: "0.5px solid #1E2D4A",
        display: "flex",
        flexDirection: "column",
        padding: "16px 0",
        transition: "width 0.2s ease",
        flexShrink: 0,
        position: "sticky",
        top: 0,
        height: "100vh"
      }}>

        {/* logo */}
        <div style={{
          display: "flex", alignItems: "center",
          gap: "10px", padding: "0 16px 24px",
          overflow: "hidden"
        }}>
          <div style={{
            width: "28px", height: "28px", background: "#3B82F6",
            borderRadius: "8px", display: "flex", alignItems: "center",
            justifyContent: "center", flexShrink: 0
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
            </svg>
          </div>
          {!collapsed && <span style={{ color: "#E2E8F0", fontSize: "16px", fontWeight: "600", whiteSpace: "nowrap" }}>PrepAI</span>}
        </div>

        {/* nav items */}
        <div style={{ flex: 1, padding: "0 8px" }}>
          {navItems.map(item => (
            <div
              key={item.id}
              onClick={() => {
                if (onPageChange) onPageChange(item.id)
                else setCurrentPage(item.id)
              }}
              style={{
                display: "flex", alignItems: "center",
                gap: "10px", padding: "9px 10px",
                borderRadius: "8px", marginBottom: "2px",
                cursor: "pointer", overflow: "hidden",
                background: currentPage === item.id ? "#1E3A6E" : "transparent",
                color: currentPage === item.id ? "#60A5FA" : "#718096",
                transition: "all 0.15s"
              }}
              onMouseEnter={e => {
                if (currentPage !== item.id) {
                  e.currentTarget.style.background = "#1A2540"
                  e.currentTarget.style.color = "#A0AEC0"
                }
              }}
              onMouseLeave={e => {
                if (currentPage !== item.id) {
                  e.currentTarget.style.background = "transparent"
                  e.currentTarget.style.color = "#718096"
                }
              }}
            >
              <div style={{ flexShrink: 0 }}><NavIcon path={item.icon} /></div>
              {!collapsed && <span style={{ fontSize: "13px", fontWeight: "400", whiteSpace: "nowrap" }}>{item.label}</span>}
            </div>
          ))}
        </div>

        {/* collapse button */}
        <div style={{ padding: "0 8px", marginBottom: "8px" }}>
          <div
            onClick={() => setCollapsed(!collapsed)}
            style={{
              display: "flex", alignItems: "center", gap: "10px",
              padding: "9px 10px", borderRadius: "8px",
              cursor: "pointer", color: "#4A5568"
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "#1A2540"; e.currentTarget.style.color = "#718096" }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#4A5568" }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              {collapsed
                ? <path d="M9 18l6-6-6-6"/>
                : <path d="M15 18l-6-6 6-6"/>
              }
            </svg>
            {!collapsed && <span style={{ fontSize: "13px" }}>Collapse</span>}
          </div>
        </div>

        {/* user + logout */}
        <div style={{ padding: "8px 8px 0", borderTop: "0.5px solid #1E2D4A" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px", overflow: "hidden" }}>
            <div style={{
              width: "28px", height: "28px", borderRadius: "50%",
              background: "#1E3A6E", display: "flex", alignItems: "center",
              justifyContent: "center", color: "#60A5FA", fontSize: "12px",
              fontWeight: "500", flexShrink: 0
            }}>
              {user?.[0]?.toUpperCase()}
            </div>
            {!collapsed && (
              <div style={{ overflow: "hidden", flex: 1 }}>
                <div style={{ color: "#E2E8F0", fontSize: "12px", fontWeight: "500", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user}</div>
                <div
                  onClick={onLogout}
                  style={{ color: "#4A5568", fontSize: "11px", cursor: "pointer", marginTop: "1px" }}
                  onMouseEnter={e => e.currentTarget.style.color = "#FC8181"}
                  onMouseLeave={e => e.currentTarget.style.color = "#4A5568"}
                >
                  Sign out
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* main content */}
      <div style={{ flex: 1, overflow: "auto" }}>
        {children}
      </div>
    </div>
  )
}