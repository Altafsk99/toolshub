import type { CvAiRequest, CvAiResponse } from "@/types/cv";

export class CvAiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CvAiError";
  }
}

export async function requestCvAi(payload: CvAiRequest): Promise<CvAiResponse> {
  const res = await fetch("/api/cv/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = (await res.json().catch(() => null)) as
    | CvAiResponse
    | { error?: string }
    | null;

  if (!res.ok) {
    if (res.status === 404) {
      throw new CvAiError(
        "AI API not found. Run npm run dev (starts local API on port 8789). On preview, deploy functions/ and set Groq env vars.",
      );
    }
    throw new CvAiError(
      data && "error" in data && data.error
        ? data.error
        : `AI request failed (${res.status}). Check API keys in .dev.vars or Cloudflare preview env.`,
    );
  }

  if (!data || !("cv" in data)) {
    throw new CvAiError("AI returned an invalid response.");
  }

  return data;
}
