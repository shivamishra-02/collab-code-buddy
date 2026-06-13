function Output({ output }) {
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <span style={styles.dot} />
        Output
      </div>
      <pre style={styles.output}>{output || "Run code to see output here..."}</pre>
    </div>
  );
}

const styles = {
  container: {
    height: "160px",
    background: "var(--bg-deep)",
    borderTop: "1px solid var(--border)",
    display: "flex",
    flexDirection: "column",
  },
  header: {
    padding: "8px 16px",
    background: "var(--bg-panel)",
    color: "var(--text-dim)",
    fontSize: "11px",
    fontWeight: 600,
    letterSpacing: "1px",
    textTransform: "uppercase",
    borderBottom: "1px solid var(--border)",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  dot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    background: "var(--accent-green)",
    display: "inline-block",
  },
  output: {
    flex: 1,
    padding: "12px 16px",
    margin: 0,
    color: "var(--text)",
    fontSize: "13px",
    overflowY: "auto",
    whiteSpace: "pre-wrap",
    fontFamily: "var(--font-mono)",
  },
};

export default Output;