import axios from "axios";

const PISTON_API = "https://emkc.org/api/v2/piston/execute";

// Map common language names to Piston's expected version format
const LANGUAGE_VERSIONS = {
  javascript: "18.15.0",
  python: "3.10.0",
  java: "15.0.2",
  cpp: "10.2.0",
  c: "10.2.0",
  csharp: "6.12.0",
  go: "1.16.2",
  ruby: "3.0.1",
  rust: "1.68.2",
  php: "8.2.3",
};

export const executeCode = async (language, code) => {
  try {
    const response = await axios.post(PISTON_API, {
      language: language,
      version: LANGUAGE_VERSIONS[language] || "*",
      files: [
        {
          content: code,
        },
      ],
    });

    return response.data;
  } catch (error) {
    console.error("Piston API error:", error.message);
    throw new Error("Code execution failed");
  }
};