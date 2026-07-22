import { createServer, type IncomingMessage } from "node:http";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { generateCvWithAi, cvAiEnvFromProcess } from "@/lib/cv/ai-generate-server";
import type { CvAiRequest } from "@/types/cv";

const PORT = 8789;

/** Load env files; `.dev.vars` overrides API keys for local Groq/OpenAI setup. */
function loadEnvFiles(): void {
  const load = (name: string, override = false) => {
    const path = resolve(process.cwd(), name);
    if (!existsSync(path)) return;
    for (const line of readFileSync(path, "utf8").split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      const value = trimmed.slice(eq + 1).trim();
      if (!key) continue;
      if (override || process.env[key] === undefined) process.env[key] = value;
    }
  };

  load(".env");
  load(".env.local");
  load(".dev.vars", true);
}

loadEnvFiles();

function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

const server = createServer(async (req, res) => {
  if (req.method === "OPTIONS" && req.url === "/api/cv/generate") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    });
    res.end();
    return;
  }

  if (req.method !== "POST" || req.url !== "/api/cv/generate") {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Not found" }));
    return;
  }

  try {
    const raw = await readBody(req);
    const body = JSON.parse(raw) as CvAiRequest;
    const result = await generateCvWithAi(body, cvAiEnvFromProcess());

    if (!result.ok) {
      res.writeHead(result.status, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: result.error }));
      return;
    }

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ cv: result.cv }));
  } catch {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Invalid request body." }));
  }
});

server.listen(PORT, () => {
  console.log(`CV AI dev API → http://127.0.0.1:${PORT}/api/cv/generate`);
});
