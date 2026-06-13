import Buddy from "./Buddy.jsx";

function BuddyBar({ users }) {
  return (
    <div style={styles.bar}>
      <span style={styles.label}>
        {users.length} {users.length === 1 ? "buddy" : "buddies"} online
      </span>
      <div style={styles.row}>
        {users.map((user, index) => (
          <Buddy
            key={index}
            name={user.username || user}
            color={user.color || "#58a6ff"}
            delay={index * 0.25}
          />
        ))}
      </div>
    </div>
  );
}

const styles = {
  bar: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
    padding: "10px 20px",
    background: "var(--bg-panel-light)",
    borderBottom: "1px solid var(--border)",
    overflowX: "auto",
  },
  label: {
    fontSize: "11px",
    color: "var(--text-dim)",
    whiteSpace: "nowrap",
    letterSpacing: "0.5px",
  },
  row: {
    display: "flex",
    gap: "18px",
  },
};

export default BuddyBar;