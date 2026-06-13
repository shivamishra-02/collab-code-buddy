import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Buddy from "../components/Buddy.jsx";

// Generates a short, friendly room code: 6 chars, uppercase letters + numbers
const generateRoomCode = () => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no O/0/I/1 to avoid confusion
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
};

const BUDDY_COLORS = ["#f78166", "#58a6ff", "#3fb950", "#bc8cff"];

function Home() {
  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const createNewRoom = (e) => {
    e.preventDefault();
    setRoomId(generateRoomCode());
  };

  const joinRoom = (e) => {
    e.preventDefault();

    if (!roomId.trim() || !username.trim()) {
      alert("Room code aur naam dono zaroori hain!");
      return;
    }

    navigate(`/room/${roomId.trim().toUpperCase()}`, {
      state: { username: username.trim() },
    });
  };

  return (
    <div style={styles.container}>
      <div style={styles.glow} />

      <div style={styles.buddyRow}>
        {BUDDY_COLORS.map((color, i) => (
          <Buddy key={i} name="" color={color} delay={i * 0.2} />
        ))}
      </div>

      <div style={styles.card}>
        <p style={styles.eyebrow}>// real-time code together</p>
        <h1 style={styles.title}>Collab Code Buddy</h1>
        <p style={styles.subtitle}>
          Ek room banao, code share karo, aur saath mil ke likho — live.
        </p>

        <form onSubmit={joinRoom} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Your name</label>
            <input
              type="text"
              placeholder="e.g. Shivam"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={styles.input}
              maxLength={20}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Room code</label>
            <input
              type="text"
              placeholder="e.g. K7P2QX"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value.toUpperCase())}
              style={{ ...styles.input, ...styles.code }}
              maxLength={6}
            />
          </div>

          <button type="submit" style={styles.primaryButton}>
            Join Room
          </button>

          <button onClick={createNewRoom} style={styles.secondaryButton} type="button">
            Generate New Room Code
          </button>
        </form>
      </div>

      <footer style={styles.footer}>
        <span style={styles.footerLabel}>built by</span>{" "}
        <span style={styles.footerName}>Shivam</span>
        <span style={styles.footerDivider}>·</span>
        <a href="https://github.com/shivamishra-02" target="_blank" rel="noreferrer" style={styles.footerLink}>
          GitHub
        </a>
        <span style={styles.footerDivider}>·</span>
        <a href="https://www.linkedin.com/in/shivam-mishra-3a741b253/" target="_blank" rel="noreferrer" style={styles.footerLink}>
          LinkedIn
        </a>
      </footer>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    background: "var(--bg-deep)",
    position: "relative",
    overflow: "hidden",
    padding: "40px 20px",
  },
  glow: {
    position: "absolute",
    top: "-200px",
    left: "50%",
    transform: "translateX(-50%)",
    width: "600px",
    height: "600px",
    background: "radial-gradient(circle, rgba(88,166,255,0.12) 0%, transparent 70%)",
    pointerEvents: "none",
  },
  buddyRow: {
    display: "flex",
    gap: "28px",
    marginBottom: "28px",
    zIndex: 1,
  },
  card: {
    background: "var(--bg-panel)",
    border: "1px solid var(--border)",
    padding: "36px",
    borderRadius: "14px",
    width: "100%",
    maxWidth: "380px",
    boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
    zIndex: 1,
  },
  eyebrow: {
    color: "var(--accent-green)",
    fontSize: "12px",
    marginBottom: "8px",
    letterSpacing: "0.5px",
  },
  title: {
    fontFamily: "var(--font-display)",
    fontSize: "28px",
    fontWeight: 700,
    color: "#fff",
    marginBottom: "10px",
  },
  subtitle: {
    color: "var(--text-dim)",
    marginBottom: "28px",
    fontSize: "13px",
    lineHeight: 1.6,
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  label: {
    fontSize: "11px",
    color: "var(--text-dim)",
    textTransform: "uppercase",
    letterSpacing: "1px",
  },
  input: {
    padding: "12px 14px",
    borderRadius: "8px",
    border: "1px solid var(--border)",
    background: "var(--bg-deep)",
    color: "#fff",
    fontSize: "14px",
    fontFamily: "var(--font-mono)",
    outline: "none",
  },
  code: {
    letterSpacing: "4px",
    fontWeight: 700,
    color: "var(--accent-blue)",
  },
  primaryButton: {
    padding: "13px",
    borderRadius: "8px",
    border: "none",
    background: "var(--accent-blue)",
    color: "#0d1117",
    fontSize: "14px",
    cursor: "pointer",
    fontWeight: 700,
    marginTop: "6px",
    fontFamily: "var(--font-display)",
  },
  secondaryButton: {
    padding: "11px",
    borderRadius: "8px",
    border: "1px solid var(--border)",
    background: "transparent",
    color: "var(--text-dim)",
    fontSize: "12px",
    cursor: "pointer",
  },
  footer: {
    marginTop: "32px",
    fontSize: "12px",
    color: "var(--text-dim)",
    zIndex: 1,
  },
  footerLabel: {
    color: "var(--text-dim)",
  },
  footerName: {
    color: "var(--accent-warm)",
    fontWeight: 600,
  },
  footerDivider: {
    margin: "0 8px",
    color: "var(--border)",
  },
  footerLink: {
    color: "var(--accent-blue)",
    textDecoration: "none",
  },
};

export default Home;