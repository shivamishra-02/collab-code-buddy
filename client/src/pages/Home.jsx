import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

function Home() {
  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const createNewRoom = (e) => {
    e.preventDefault();
    const newRoomId = uuidv4();
    setRoomId(newRoomId);
  };

  const joinRoom = (e) => {
    e.preventDefault();

    if (!roomId || !username) {
      alert("Room ID aur Username dono required hain!");
      return;
    }

    navigate(`/room/${roomId}`, {
      state: { username },
    });
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Collab Code Buddy</h1>
        <p style={styles.subtitle}>Real-time collaborative code editor</p>

        <form onSubmit={joinRoom} style={styles.form}>
          <input
            type="text"
            placeholder="Room ID"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            style={styles.input}
          />
          <input
            type="text"
            placeholder="Your Name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={styles.input}
          />

          <button type="submit" style={styles.button}>
            Join Room
          </button>

          <button onClick={createNewRoom} style={styles.linkButton}>
            Create New Room
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #1e1e1e, #2d2d30)",
  },
  card: {
    background: "#252526",
    padding: "40px",
    borderRadius: "10px",
    width: "350px",
    textAlign: "center",
    boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
  },
  title: {
    marginBottom: "10px",
    color: "#4ec9b0",
  },
  subtitle: {
    color: "#9cdcfe",
    marginBottom: "25px",
    fontSize: "14px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  input: {
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #3c3c3c",
    background: "#1e1e1e",
    color: "#fff",
    fontSize: "14px",
  },
  button: {
    padding: "10px",
    borderRadius: "5px",
    border: "none",
    background: "#0e639c",
    color: "#fff",
    fontSize: "15px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  linkButton: {
    padding: "8px",
    borderRadius: "5px",
    border: "1px solid #4ec9b0",
    background: "transparent",
    color: "#4ec9b0",
    fontSize: "13px",
    cursor: "pointer",
  },
};

export default Home;