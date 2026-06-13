import { useEffect, useState, useRef } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { socket } from "../socket.js";
import Editor from "../components/Editor.jsx";
import Output from "../components/Output.jsx";
import BuddyBar from "../components/BuddyBar.jsx";

function Room() {
  const { roomId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const username = location.state?.username;

  const [code, setCode] = useState("// Start coding here...");
  const [language, setLanguage] = useState("javascript");
  const [output, setOutput] = useState("");
  const [users, setUsers] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [copied, setCopied] = useState(false);

  const isRemoteUpdate = useRef(false);

  useEffect(() => {
    if (!username) {
      navigate("/");
      return;
    }

    socket.connect();
    socket.emit("join-room", { roomId, username });

    socket.on("code-update", (newCode) => {
      isRemoteUpdate.current = true;
      setCode(newCode);
    });

    socket.on("language-update", (newLanguage) => {
      setLanguage(newLanguage);
    });

    socket.on("user-list", (userList) => {
      setUsers(userList);
    });

    socket.on("code-output", (result) => {
      setOutput(result);
      setIsRunning(false);
    });

    return () => {
      socket.off("code-update");
      socket.off("language-update");
      socket.off("user-list");
      socket.off("code-output");
      socket.disconnect();
    };
  }, [roomId, username, navigate]);

  const handleCodeChange = (newCode) => {
    setCode(newCode);

    if (isRemoteUpdate.current) {
      isRemoteUpdate.current = false;
      return;
    }

    socket.emit("code-change", { roomId, code: newCode });
  };

  const handleLanguageChange = (e) => {
    const newLanguage = e.target.value;
    setLanguage(newLanguage);
    socket.emit("language-change", { roomId, language: newLanguage });
  };

  const handleRunCode = () => {
    setIsRunning(true);
    setOutput("Running...");
    socket.emit("run-code", { roomId, language, code });
  };

  const copyRoomId = () => {
    navigator.clipboard.writeText(roomId);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div style={styles.container}>
      <div style={styles.topBar}>
        <div style={styles.roomInfo}>
          <span style={styles.roomLabel}>ROOM</span>
          <button onClick={copyRoomId} style={styles.roomCode} title="Click to copy">
            {roomId}
          </button>
          {copied && <span style={styles.copiedTag}>copied!</span>}
        </div>

        <div style={styles.controls}>
          <select
            value={language}
            onChange={handleLanguageChange}
            style={styles.select}
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
          </select>

          <button onClick={handleRunCode} style={styles.runButton} disabled={isRunning}>
            {isRunning ? "Running…" : "▶ Run"}
          </button>
        </div>
      </div>

      <BuddyBar users={users} />

      <div style={styles.mainArea}>
        <Editor code={code} language={language} onChange={handleCodeChange} />
      </div>

      <Output output={output} />
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    background: "var(--bg-deep)",
  },
  topBar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px 20px",
    background: "var(--bg-panel)",
    borderBottom: "1px solid var(--border)",
    flexWrap: "wrap",
    gap: "10px",
  },
  roomInfo: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  roomLabel: {
    fontSize: "11px",
    color: "var(--text-dim)",
    letterSpacing: "1.5px",
    fontWeight: 600,
  },
  roomCode: {
    padding: "5px 12px",
    fontSize: "14px",
    fontWeight: 700,
    letterSpacing: "3px",
    background: "var(--bg-deep)",
    color: "var(--accent-blue)",
    border: "1px solid var(--border)",
    borderRadius: "6px",
    cursor: "pointer",
    fontFamily: "var(--font-mono)",
  },
  copiedTag: {
    fontSize: "11px",
    color: "var(--accent-green)",
  },
  controls: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  select: {
    padding: "8px 12px",
    background: "var(--bg-deep)",
    color: "#fff",
    border: "1px solid var(--border)",
    borderRadius: "6px",
    fontFamily: "var(--font-mono)",
    fontSize: "13px",
  },
  runButton: {
    padding: "9px 22px",
    background: "var(--accent-green)",
    color: "#0d1117",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: 700,
    fontFamily: "var(--font-display)",
    fontSize: "13px",
  },
  mainArea: {
    flex: 1,
    overflow: "hidden",
  },
};

export default Room;