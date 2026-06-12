function UserList({ users }) {
  return (
    <div>
      <div style={styles.header}>Users ({users.length})</div>
      <ul style={styles.list}>
        {users.map((user, index) => (
          <li key={index} style={styles.item}>
            🟢 {user}
          </li>
        ))}
      </ul>
    </div>
  );
}

const styles = {
  header: {
    color: "#9cdcfe",
    fontSize: "13px",
    fontWeight: "bold",
    marginBottom: "10px",
    textTransform: "uppercase",
  },
  list: {
    listStyle: "none",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  item: {
    color: "#d4d4d4",
    fontSize: "13px",
  },
};

export default UserList;