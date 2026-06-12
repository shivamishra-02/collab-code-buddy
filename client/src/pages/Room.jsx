import { useEffect, useState, useRef } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { socket } from "../socket.js";
import Editor from "../components/Editor.jsx";
import Output from "../components/Output.jsx";
import UserList from "../components/UserList.jsx";

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

  // Flag to avoid emitting code-change when we receive an update from server
  const isRemoteUpdate = useRef(false);

  useEffect(() => {
    // If user directly opened room URL without joining from Home, send back
    if (!username) {
      navigate("/");
      return;
    }

    // Connect socket and join room
    socket.connect();
    socket.emit("join-room", { roomId, username });

    // Listen for code updates from other users
    socket.on("code-update", (newCode) => {
      isRemoteUpdate.current = true;
      setCode(newCode);
    });

    // Listen for language changes from other users
    socket.on("language-update", (newLanguage) => {
      setLanguage(newLanguage);
    });

    // Listen for updated user list
    socket.on("user-list", (userList) => {
      setUsers(userList);
    });

    // Listen for code execution output
    socket.on("code-output", (result) => {
      setOutput(result);
      setIsRunning(false);
    });

    // Cleanup on unmount
    return () => {
      socket.off("code-update");
      socket.off("language-update");
      socket.off("user-list");
      socket.off("code-output");
      socket.disconnect();
    };
  }, [roomId, username, navigate]);

  // Handle local code changes
  const handleCodeChange = (newCode) => {
    setCode(newCode);

    // If this change came from a remote update, don't re-broadcast it
    if (isRemoteUpdate.current) {
      isRemoteUpdate.current = false;
      return;
    }

    socket.emit("code-change", { roomId, code: newCode });
  };

  // Handle language change
  const handleLanguageChange = (e) => {
    const newLanguage = e.target.value;
    setLanguage(newLanguage);
    socket.emit("language-change", { roomId, language: newLanguage });
  };

  // Run code
  const handleRunCode = () => {
    setIsRunning(true);
    setOutput("Running...");
    socket.emit("run-code", { roomId, language, code });
  };

  const copyRoomId = () => {
    navigator.clipboard.writeText(roomId);
    alert("Room ID copied!");
  };

  return (
    <div style={styles.container}>
      <div style={styles.topBar}>
        <div style={styles.roomInfo}>
          <span>Room ID: {roomId}</span>
          <button onClick={copyRoomId} style={styles.copyButton}>
            Copy
          </button>
        </div>

        <select
          value={language}
          onChange={handleLanguageChange}
          style={styles.select}
        >
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="java">Java</option>
          <option value="cpp">C++</option>
          <option value="c">C</option>
          <option value="go">Go</option>
          <option value="rust">Rust</option>
          <option value="ruby">Ruby</option>
          <option value="php">PHP</option>
        </select>

        <button onClick={handleRunCode} style={styles.runButton} disabled={isRunning}>
          {isRunning ? "Running..." : "Run Code"}
        </button>
      </div>

      <div style={styles.mainArea}>
        <div style={styles.sidebar}>
          <UserList users={users} />
        </div>

        <div style={styles.editorArea}>
          <Editor code={code} language={language} onChange={handleCodeChange} />
        </div>
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
    background: "#1e1e1e",
  },
  topBar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "10px 20px",
    background: "#252526",
    borderBottom: "1px solid #3c3c3c",
  },
  roomInfo: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    color: "#9cdcfe",
    fontSize: "14px",
  },
  copyButton: {
    padding: "4px 10px",
    fontSize: "12px",
    cursor: "pointer",
    background: "#3c3c3c",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
  },
  select: {
    padding: "5px 10px",
    background: "#1e1e1e",
    color: "#fff",
    border: "1px solid #3c3c3c",
    borderRadius: "4px",
  },
  runButton: {
    padding: "8px 20px",
    background: "#0e639c",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  mainArea: {
    flex: 1,
    display: "flex",
    overflow: "hidden",
  },
  sidebar: {
    width: "180px",
    background: "#252526",
    borderRight: "1px solid #3c3c3c",
    padding: "10px",
  },
  editorArea: {
    flex: 1,
  },
};

export default Room;