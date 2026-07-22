/**
 * Cloudflare Pages Function — POST /api/cv/generate
 * Self-contained (no src/ imports) so Wrangler binds dashboard env vars reliably.
 *
 * Required Cloudflare Variables (Preview + Production), then Redeploy:
 * - OPENAI_API_KEY
 * - OPENAI_BASE_URL=https://api.groq.com/openai/v1
 * - OPENAI_MODEL=llama-3.3-70b-versatile
 */

type CvAiAction = "from_notes" | "summary" | "bullets";

type CvExperience = {
  id: string;
  company: string;
  role: string;
  start: string;
  end: string;
  bullets: string[];
};

type CvEducation = {
  id: string;
  school: string;
  degree: string;
  year: string;
};

type CvData = {
  fullName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  website: string;
  summary: string;
  skills: string[];
  experience: CvExperience[];
  education: CvEducation[];
};

type Env = {
  OPENAI_API_KEY?: string;
  OPENAI_BASE_URL?: string;
  OPENAI_MODEL?: string;
};

type PagesContext = {
  request: Request;
  env: Env;
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
  "experience": [{ "id": "string", "company": "string", "role": "string", "start": "string", "end": "string", "bullets": ["string"] }],
  "education": [{ "id": "string", "school": "string", "degree": "string", "year": "string" }]
}`;

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
      "Access-Control-Allow-Origin": "*",
    },
  });
}

function newId(): string {
  return crypto.randomUUID();
}

function emptyCv(): CvData {
  return {
    fullName: "",
    title: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    website: "",
    summary: "",
    skills: [],
    experience: [{ id: newId(), company: "", role: "", start: "", end: "", bullets: [""] }],
    education: [{ id: newId(), school: "", degree: "", year: "" }],
  };
}

function uniqueIds<T extends { id: string }>(items: T[]): T[] {
  const seen = new Set<string>();
  return items.map((item) => {
    if (item.id && !seen.has(item.id)) {
      seen.add(item.id);
      return item;
    }
    const id = newId();
    seen.add(id);
    return { ...item, id };
  });
}

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
    experience: uniqueIds(
      experienceSource.map((item, index) => {
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
    ),
    education: uniqueIds(
      educationSource.map((item, index) => {
        const existing = seed.education[index];
        return {
          id: String(item?.id ?? existing?.id ?? newId()),
          school: String(item?.school ?? existing?.school ?? ""),
          degree: String(item?.degree ?? existing?.degree ?? ""),
          year: String(item?.year ?? existing?.year ?? ""),
        };
      }),
    ),
  };
}

function extractJson(text: string): Partial<CvData> {
  const trimmed = text.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fenced?.[1]?.trim() ?? trimmed;
  return JSON.parse(candidate) as Partial<CvData>;
}

function buildPrompt(
  action: CvAiAction,
  notes: string | undefined,
  cv: Partial<CvData> | undefined,
  experienceId: string | undefined,
): string {
  if (action === "from_notes") {
    return [
      "Turn these rough career notes into a professional CV JSON object.",
      "Use concise, achievement-focused language. Do not fabricate employers or degrees not implied by the notes.",
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

function readEnv(env: Env): Required<Env> {
  return {
    OPENAI_API_KEY: String(env.OPENAI_API_KEY ?? "").trim(),
    OPENAI_BASE_URL: String(env.OPENAI_BASE_URL ?? "https://api.groq.com/openai/v1").trim(),
    OPENAI_MODEL: String(env.OPENAI_MODEL ?? "llama-3.3-70b-versatile").trim(),
  };
}

async function callAi(env: Required<Env>, prompt: string): Promise<Partial<CvData>> {
  if (!env.OPENAI_API_KEY) {
    throw new Error(
      "OPENAI_API_KEY missing at Cloudflare runtime. Set Variables for Preview AND Production, then Deployments → Retry deployment. Use a Pages (*.pages.dev) project, not Workers-only.",
    );
  }

  const baseUrl = env.OPENAI_BASE_URL.replace(/\/$/, "");
  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: env.OPENAI_MODEL,
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

export async function onRequestPost(context: PagesContext): Promise<Response> {
  try {
    const body = (await context.request.json()) as {
      action?: CvAiAction;
      notes?: string;
      cv?: Partial<CvData>;
      experienceId?: string;
    };

    const action = body.action;
    if (!action || !["from_notes", "summary", "bullets"].includes(action)) {
      return jsonResponse({ error: "Invalid action." }, 400);
    }
    if (action === "from_notes" && !body.notes?.trim()) {
      return jsonResponse({ error: "Notes are required." }, 400);
    }

    const env = readEnv(context.env ?? {});
    const prompt = buildPrompt(action, body.notes, body.cv, body.experienceId);
    const raw = await callAi(env, prompt);
    const base = body.cv ? normalizeCv(body.cv) : undefined;
    const cv = normalizeCv(raw, base);

    return jsonResponse({ cv });
  } catch (err) {
    const message = err instanceof Error ? err.message : "AI request failed.";
    const status = message.includes("OPENAI_API_KEY") ? 503 : 500;
    return jsonResponse({ error: message }, status);
  }
}

export async function onRequestOptions(): Promise<Response> {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
