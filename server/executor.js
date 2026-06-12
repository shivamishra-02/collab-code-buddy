import { exec } from "child_process";
import { writeFile, unlink, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { v4 as uuidv4 } from "uuid";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TEMP_DIR = path.join(__dirname, "temp");

// Ensure temp directory exists
if (!existsSync(TEMP_DIR)) {
  await mkdir(TEMP_DIR);
}

const TIMEOUT_MS = 7000; // 7 seconds max execution time

const LANGUAGE_CONFIG = {
  javascript: {
    extension: "js",
    command: (filePath) => `node "${filePath}"`,
  },
  python: {
    extension: "py",
    command: (filePath) => `python3 "${filePath}"`,
  },
};

export const executeCode = (language, code) => {
  return new Promise(async (resolve) => {
    const config = LANGUAGE_CONFIG[language];

    if (!config) {
      resolve({ output: `Language "${language}" not supported.` });
      return;
    }

    const fileId = uuidv4();
    const fileName = `${fileId}.${config.extension}`;
    const filePath = path.join(TEMP_DIR, fileName);

    try {
      // Write code to a temp file
      await writeFile(filePath, code);

      const command = config.command(filePath);

      exec(
        command,
        { timeout: TIMEOUT_MS, maxBuffer: 1024 * 1024 }, // 1MB max output
        async (error, stdout, stderr) => {
          // Clean up temp file
          try {
            await unlink(filePath);
          } catch (e) {
            // ignore cleanup errors
          }

          if (error) {
            if (error.killed) {
              resolve({ output: "Error: Execution timed out (limit 7s)." });
            } else {
              resolve({ output: stderr || error.message });
            }
            return;
          }

          resolve({ output: stdout || "(No output)" });
        }
      );
    } catch (err) {
      resolve({ output: `Server error: ${err.message}` });
    }
  });
};