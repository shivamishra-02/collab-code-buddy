import axios from "axios";

const PISTON_API = "https://emkc.org/api/v2/piston/execute";
const RUNTIMES_API = "https://emkc.org/api/v2/piston/runtimes";

let cachedRuntimes = null;

const getRuntimes = async () => {
  if (cachedRuntimes) return cachedRuntimes;
  const res = await axios.get(RUNTIMES_API);
  cachedRuntimes = res.data;
  return cachedRuntimes;
};

export const executeCode = async (language, code) => {
  try {
    const runtimes = await getRuntimes();
    const runtime = runtimes.find((r) => r.language === language);

    if (!runtime) {
      throw new Error(`Language "${language}" not supported by Piston`);
    }

    const response = await axios.post(PISTON_API, {
      language: runtime.language,
      version: runtime.version,
      files: [{ content: code }],
    });

    return response.data;
  } catch (error) {
    console.error("FULL ERROR:", error.toString());
    console.error("URL CALLED:", error.config?.url);
    console.error("RESPONSE DATA:", JSON.stringify(error.response?.data));
    throw new Error("Code execution failed");
  }
};