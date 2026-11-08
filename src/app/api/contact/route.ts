import { normalizeContact, validateContact } from "@/lib/contact";
import { isContactBackendConfigured } from "@/lib/site";

/**
 * POST /api/contact
 * Delivers the message through Resend's REST API when configured.
 * Secrets stay server-side; the browser never sees them.
 *
 * Responses:
 *  200 { ok: true }
 *  400 { ok: false, code: "invalid", errors }
 *  413 / 415 malformed requests
 *  429 { ok: false, code: "rate_limited" }
 *  503 { ok: false, code: "not_configured" }   → client falls back to mailto
 *  502 { ok: false, code: "delivery_failed" }
 */

const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
// Best-effort per-instance limiter. For strict limits across serverless
// instances, back this with a shared store (e.g. Upstash Redis).
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > MAX_PER_WINDOW;
}

const json = (body: unknown, status: number) =>
  Response.json(body, { status, headers: { "Cache-Control": "no-store" } });

export async function POST(request: Request) {
  if (!request.headers.get("content-type")?.includes("application/json")) {
    return json({ ok: false, code: "unsupported" }, 415);
  }
  const length = Number(request.headers.get("content-length") ?? 0);
  if (length > 16_000) return json({ ok: false, code: "too_large" }, 413);

  // Same-origin check: reject cross-site form posts.
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (origin && host && new URL(origin).host !== host) {
    return json({ ok: false, code: "forbidden" }, 403);
  }

  let raw: Record<string, unknown>;
  try {
    raw = await request.json();
  } catch {
    return json({ ok: false, code: "invalid" }, 400);
  }

  // Honeypot: real users never fill this hidden field. Pretend success.
  if (typeof raw.company === "string" && raw.company.trim() !== "") {
    return json({ ok: true }, 200);
  }

  const input = normalizeContact(raw);
  const errors = validateContact(input);
  if (Object.keys(errors).length) return json({ ok: false, code: "invalid", errors }, 400);

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (rateLimited(ip)) return json({ ok: false, code: "rate_limited" }, 429);

  if (!isContactBackendConfigured()) {
    return json({ ok: false, code: "not_configured" }, 503);
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM_EMAIL,
        to: [process.env.CONTACT_TO_EMAIL],
        reply_to: input.email,
        subject: `[Portfolio] ${input.subject}`,
        // Plain text only — no HTML rendering of user input.
        text: `Name: ${input.name}\nEmail: ${input.email}\nSubject: ${input.subject}\n\n${input.message}`,
      }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) {
      console.error("[contact] Resend error", res.status);
      return json({ ok: false, code: "delivery_failed" }, 502);
    }
    return json({ ok: true }, 200);
  } catch (err) {
    console.error("[contact] delivery exception", err instanceof Error ? err.message : err);
    return json({ ok: false, code: "delivery_failed" }, 502);
  }
}
