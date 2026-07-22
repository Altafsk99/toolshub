import type { CvAiRequest, CvData } from "@/types/cv";
import { emptyCv, ensureCvIds, newId } from "@/lib/cv/defaults";

export type CvAiEnv = {
  OPENAI_API_KEY?: string;
  OPENAI_BASE_URL?: string;
  OPENAI_MODEL?: string;
};

const CV_JSON_SCHEMA = `{
  "fullName": "string",
  "title": "string",
  "email": "string",
  "phone": "string",
  "location": "string",
  "linkedin": "string",
  "website": "string",
  "summary": "string",
  "skills": ["string"],
  "experience": [{
    "id": "uuid-string",
    "company": "string",
    "role": "string",
    "start": "string",
    "end": "string",
    "bullets": ["string"]
  }],
  "education": [{
    "id": "uuid-string",
    "school": "string",
    "degree": "string",
    "year": "string"
  }]
}`;

function normalizeCv(raw: Partial<CvData> | null | undefined, base?: CvData): CvData {
  const seed = base ?? emptyCv();
  const experienceSource = Array.isArray(raw?.experience) ? raw.experience : seed.experience;
  const educationSource = Array.isArray(raw?.education) ? raw.education : seed.education;

  return {
    fullName: String(raw?.fullName ?? seed.fullName ?? ""),
    title: String(raw?.title ?? seed.title ?? ""),
    email: String(raw?.email ?? seed.email ?? ""),
    phone: String(raw?.phone ?? seed.phone ?? ""),
    location: String(raw?.location ?? seed.location ?? ""),
    linkedin: String(raw?.linkedin ?? seed.linkedin ?? ""),
    website: String(raw?.website ?? seed.website ?? ""),
    summary: String(raw?.summary ?? seed.summary ?? ""),
    skills: Array.isArray(raw?.skills)
      ? raw.skills.map((skill) => String(skill).trim()).filter(Boolean)
      : seed.skills,
    experience: experienceSource.map((item, index) => {
      const existing = seed.experience[index];
      const bullets = Array.isArray(item?.bullets)
        ? item.bullets.map((bullet) => String(bullet).trim()).filter(Boolean)
        : (existing?.bullets ?? [""]);
      return {
        id: String(item?.id ?? existing?.id ?? newId()),
        company: String(item?.company ?? existing?.company ?? ""),
        role: String(item?.role ?? existing?.role ?? ""),
        start: String(item?.start ?? existing?.start ?? ""),
        end: String(item?.end ?? existing?.end ?? ""),
        bullets: bullets.length > 0 ? bullets : [""],
      };
    }),
    education: educationSource.map((item, index) => {
      const existing = seed.education[index];
      return {
        id: String(item?.id ?? existing?.id ?? newId()),
        school: String(item?.school ?? existing?.school ?? ""),
        degree: String(item?.degree ?? existing?.degree ?? ""),
        year: String(item?.year ?? existing?.year ?? ""),
      };
    }),
  };
}

function extractJson(text: string): Partial<CvData> {
  const trimmed = text.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fenced?.[1]?.trim() ?? trimmed;
  return JSON.parse(candidate) as Partial<CvData>;
}

function buildPrompt(
  action: CvAiRequest["action"],
  notes: string | undefined,
  cv: Partial<CvData> | undefined,
  experienceId: string | undefined,
): string {
  if (action === "from_notes") {
    return [
      "Turn these rough career notes into a professional CV JSON object.",
      "Use concise, achievement-focused language. Invent reasonable structure but do not fabricate employers or degrees not implied by the notes.",
      "Return ONLY valid JSON matching this schema:",
      CV_JSON_SCHEMA,
      "",
      "Notes:",
      notes ?? "",
    ].join("\n");
  }

  if (action === "summary") {
    return [
      "Write a strong 2–3 sentence professional summary for this CV.",
      "Return ONLY valid JSON with the full CV object, keeping all existing fields except an improved summary.",
      CV_JSON_SCHEMA,
      "",
      "Current CV:",
      JSON.stringify(cv ?? {}, null, 2),
    ].join("\n");
  }

  const target = (cv?.experience ?? []).find((item) => item.id === experienceId);
  return [
    "Improve the bullet points for the selected experience entry.",
    "Use action verbs, quantify where reasonable, and keep 3–5 bullets.",
    "Return ONLY valid JSON with the full CV object, preserving ids and other sections.",
    CV_JSON_SCHEMA,
    "",
    "Experience to improve:",
    JSON.stringify(target ?? {}, null, 2),
    "",
    "Full CV:",
    JSON.stringify(cv ?? {}, null, 2),
  ].join("\n");
}

async function callOpenAi(env: CvAiEnv, prompt: string): Promise<Partial<CvData>> {
  const apiKey = env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not configured. Add it to .env.local or .dev.vars.");
  }

  const baseUrl = (env.OPENAI_BASE_URL ?? "https://api.openai.com/v1").replace(/\/$/, "");
  const model = env.OPENAI_MODEL ?? "llama-3.3-70b-versatile";

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      temperature: 0.4,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "You are an expert CV writer. Always respond with a single JSON object for a CV. No markdown.",
        },
        { role: "user", content: prompt },
      ],
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`AI provider error (${response.status}): ${detail.slice(0, 240)}`);
  }

  const payload = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const content = payload.choices?.[0]?.message?.content;
  if (!content) throw new Error("AI provider returned an empty response.");
  return extractJson(content);
}

export type CvGenerateResult =
  | { ok: true; cv: CvData }
  | { ok: false; error: string; status: number };

export async function generateCvWithAi(
  body: CvAiRequest,
  env: CvAiEnv,
): Promise<CvGenerateResult> {
  const action = body.action;
  if (!action || !["from_notes", "summary", "bullets"].includes(action)) {
    return { ok: false, error: "Invalid action.", status: 400 };
  }

  if (action === "from_notes" && !body.notes?.trim()) {
    return { ok: false, error: "Notes are required.", status: 400 };
  }

  try {
    const prompt = buildPrompt(action, body.notes, body.cv, body.experienceId);
    const raw = await callOpenAi(env, prompt);
    const base = body.cv ? normalizeCv(body.cv) : undefined;
    const cv = ensureCvIds(normalizeCv(raw, base));
    return { ok: true, cv };
  } catch (err) {
    const message = err instanceof Error ? err.message : "AI request failed.";
    const status = message.includes("not configured") ? 503 : 500;
    return { ok: false, error: message, status };
  }
}

export function cvAiEnvFromProcess(): CvAiEnv {
  return {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    OPENAI_BASE_URL: process.env.OPENAI_BASE_URL,
    OPENAI_MODEL: process.env.OPENAI_MODEL,
  };
}
