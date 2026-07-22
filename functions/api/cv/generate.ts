/**
 * Cloudflare Pages Function — POST /api/cv/generate
 *
 * Preview env vars (Cloudflare Pages → Settings → Environment variables):
 * - OPENAI_API_KEY
 * - OPENAI_BASE_URL (optional, e.g. https://api.groq.com/openai/v1)
 * - OPENAI_MODEL (optional, e.g. llama-3.3-70b-versatile)
 */

import {
  generateCvWithAi,
  type CvAiEnv,
} from "../../../src/lib/cv/ai-generate-server";

type PagesContext = {
  request: Request;
  env: CvAiEnv;
};

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
  });
}

export async function onRequestPost(context: PagesContext): Promise<Response> {
  const body = (await context.request.json()) as Parameters<typeof generateCvWithAi>[0];
  const result = await generateCvWithAi(body, context.env);

  if (!result.ok) {
    return jsonResponse({ error: result.error }, result.status);
  }

  return jsonResponse({ cv: result.cv });
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
