import MonacoEditor from "@monaco-editor/react";

function Editor({ code, language, onChange }) {
  const handleEditorChange = (value) => {
    onChange(value);
  };

  return (
    <MonacoEditor
      height="100%"
      language={language}
      theme="vs-dark"
      value={code}
      onChange={handleEditorChange}
      options={{
        fontSize: 16,
        minimap: { enabled: false },
        wordWrap: "on",
        automaticLayout: true,
        fontFamily: "JetBrains Mono, monospace",
      }}
    />
  );
}

export default Editor;