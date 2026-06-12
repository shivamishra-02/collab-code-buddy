function Output({ output }) {
  return (
    <div style={styles.container}>
      <div style={styles.header}>Output</div>
      <pre style={styles.output}>{output || "Run code to see output here..."}</pre>
    </div>
  );
}

const styles = {
  container: {
    height: "150px",
    background: "#1e1e1e",
    borderTop: "1px solid #3c3c3c",
    display: "flex",
    flexDirection: "column",
  },
  header: {
    padding: "8px 15px",
    background: "#252526",
    color: "#9cdcfe",
    fontSize: "13px",
    fontWeight: "bold",
    borderBottom: "1px solid #3c3c3c",
  },
  output: {
    flex: 1,
    padding: "10px 15px",
    margin: 0,
    color: "#d4d4d4",
    fontSize: "13px",
    overflowY: "auto",
    whiteSpace: "pre-wrap",
  },
};

export default Output;