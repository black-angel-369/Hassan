"use client";

import { AlertCircle, CheckCircle2, Loader2, Mail, Send } from "lucide-react";
import { type FormEvent, useId, useRef, useState } from "react";
import { site } from "@/content/portfolio";
import {
  buildMailto,
  type ContactErrors,
  type ContactInput,
  LIMITS,
  normalizeContact,
  validateContact,
  validateField,
} from "@/lib/contact";

type Status =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "sent" }
  | { kind: "mailto"; href: string }
  | { kind: "error"; message: string; mailto?: string };

const empty: ContactInput = { name: "", email: "", subject: "", message: "" };

const fields: {
  key: keyof ContactInput;
  label: string;
  type?: string;
  autoComplete?: string;
  multiline?: boolean;
  half?: boolean;
}[] = [
  { key: "name", label: "Your name", autoComplete: "name", half: true },
  { key: "email", label: "Email address", type: "email", autoComplete: "email", half: true },
  { key: "subject", label: "Subject", autoComplete: "off" },
  { key: "message", label: "Message", multiline: true },
];

export function ContactForm({ backendEnabled }: { backendEnabled: boolean }) {
  const uid = useId();
  const [values, setValues] = useState<ContactInput>(empty);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof ContactInput, boolean>>>({});
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const formRef = useRef<HTMLFormElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);

  const update = (key: keyof ContactInput, value: string) => {
    setValues((v) => ({ ...v, [key]: value }));
    // Validate live only after the field has been visited (no premature errors).
    if (touched[key]) setErrors((e) => ({ ...e, [key]: validateField(key, value.trim()) }));
  };

  const blur = (key: keyof ContactInput) => {
    setTouched((t) => ({ ...t, [key]: true }));
    setErrors((e) => ({ ...e, [key]: validateField(key, values[key].trim()) }));
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const input = normalizeContact(values);
    const errs = validateContact(input);
    setErrors(errs);
    setTouched({ name: true, email: true, subject: true, message: true });
    const firstInvalid = (Object.keys(errs) as (keyof ContactInput)[])[0];
    if (firstInvalid) {
      formRef.current?.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus();
      return;
    }

    const mailto = buildMailto(site.email, input);

    // No backend configured → be honest: hand off to the visitor's email app.
    if (!backendEnabled) {
      setStatus({ kind: "mailto", href: mailto });
      window.location.href = mailto;
      requestAnimationFrame(() => statusRef.current?.focus());
      return;
    }

    setStatus({ kind: "sending" });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...input, company: String(data.get("company") ?? "") }),
      });
      const json = (await res.json().catch(() => ({}))) as { ok?: boolean; code?: string; errors?: ContactErrors };
      if (res.ok && json.ok) {
        setStatus({ kind: "sent" });
        setValues(empty);
        setTouched({});
        setErrors({});
      } else if (json.code === "invalid" && json.errors) {
        setErrors(json.errors);
        setStatus({ kind: "error", message: "Please fix the highlighted fields." });
      } else if (json.code === "rate_limited") {
        setStatus({ kind: "error", message: "Too many messages in a short time. Please try again later, or email directly.", mailto });
      } else if (json.code === "not_configured") {
        setStatus({ kind: "mailto", href: mailto });
        window.location.href = mailto;
      } else {
        setStatus({ kind: "error", message: "Your message couldn’t be delivered right now.", mailto });
      }
    } catch {
      setStatus({ kind: "error", message: "Network error — your message wasn’t sent.", mailto });
    }
    requestAnimationFrame(() => statusRef.current?.focus());
  };

  const sending = status.kind === "sending";

  return (
    <form
      ref={formRef}
      noValidate
      onSubmit={onSubmit}
      aria-describedby={`${uid}-note`}
      className="glass hairline-glow relative rounded-[32px] p-6 sm:p-8 md:p-10"
    >
      <div className="grid gap-6 sm:grid-cols-2">
        {fields.map((f) => {
          const id = `${uid}-${f.key}`;
          const err = touched[f.key] ? errors[f.key] : undefined;
          const max = LIMITS[f.key].max;
          const common = {
            id,
            name: f.key,
            value: values[f.key],
            maxLength: max,
            required: true,
            "aria-invalid": err ? true : undefined,
            "aria-describedby": err ? `${id}-err` : f.multiline ? `${id}-count` : undefined,
            onBlur: () => blur(f.key),
            className: `peer w-full rounded-2xl border bg-[var(--color-ink-950)]/60 px-4 text-base text-[var(--color-fg)] transition-[border-color,box-shadow] duration-300 outline-none placeholder:text-[var(--color-fg-subtle)] focus:border-[var(--color-cyan)] focus:shadow-[0_0_0_4px_rgb(34_211_238/0.12)] ${
              err ? "border-[var(--color-danger)]/70" : "border-[var(--color-line-strong)]"
            }`,
          };
          return (
            <div key={f.key} className={f.half ? "" : "sm:col-span-2"}>
              <label htmlFor={id} className="mb-2 block text-sm font-medium text-[var(--color-fg)]">
                {f.label}
              </label>
              {f.multiline ? (
                <textarea
                  {...common}
                  rows={6}
                  onChange={(e) => update(f.key, e.target.value)}
                  className={`${common.className} min-h-40 resize-y py-3.5 leading-relaxed`}
                  placeholder="Tell me about your project, timeline, and what you need."
                />
              ) : (
                <input
                  {...common}
                  type={f.type ?? "text"}
                  autoComplete={f.autoComplete}
                  inputMode={f.type === "email" ? "email" : undefined}
                  onChange={(e) => update(f.key, e.target.value)}
                  className={`${common.className} min-h-13 py-3`}
                />
              )}
              <div className="mt-2 flex min-h-5 items-start justify-between gap-4 text-sm">
                {err ? (
                  <p id={`${id}-err`} className="flex items-center gap-1.5 text-[var(--color-danger)]">
                    <AlertCircle className="size-3.5 shrink-0" aria-hidden />
                    {err}
                  </p>
                ) : (
                  <span />
                )}
                {f.multiline && (
                  <span id={`${id}-count`} className="shrink-0 font-mono text-xs text-[var(--color-fg-subtle)] tabular-nums">
                    {values.message.length}/{max}
                  </span>
                )}
              </div>
            </div>
          );
        })}

        {/* Honeypot — hidden from people and assistive tech, catches bots. */}
        <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
          <label htmlFor={`${uid}-company`}>Company</label>
          <input id={`${uid}-company`} name="company" type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
        </div>
      </div>

      <div className="mt-4 flex flex-col-reverse gap-5 sm:flex-row sm:items-center sm:justify-between">
        <p id={`${uid}-note`} className="max-w-sm text-sm text-[var(--color-fg-subtle)]">
          {backendEnabled
            ? "Messages are sent securely. Your details are only used to reply to you."
            : "Submitting opens your email app with this message pre-filled, ready to send."}
        </p>
        <button
          type="submit"
          disabled={sending}
          className="group relative inline-flex min-h-13 shrink-0 cursor-pointer items-center justify-center gap-2.5 overflow-hidden rounded-full whitespace-nowrap bg-[var(--color-cyan)] px-7 font-medium text-[var(--color-ink-950)] shadow-[0_10px_40px_-10px_rgb(34_211_238/0.7)] transition-[box-shadow,transform] duration-300 hover:shadow-[0_14px_50px_-8px_rgb(34_211_238/0.85)] active:scale-[0.97] disabled:cursor-wait disabled:opacity-70"
        >
          {sending ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden /> Sending…
            </>
          ) : backendEnabled ? (
            <>
              Send message <Send className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden />
            </>
          ) : (
            <>
              Compose email <Mail className="size-4" aria-hidden />
            </>
          )}
        </button>
      </div>

      <div ref={statusRef} tabIndex={-1} role="status" aria-live="polite" className="outline-none">
        {status.kind === "sent" && (
          <p className="mt-6 flex items-start gap-3 rounded-2xl border border-[var(--color-emerald)]/30 bg-[var(--color-emerald)]/[0.08] p-4 text-sm text-[var(--color-fg)]">
            <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-[var(--color-emerald)]" aria-hidden />
            Thanks — your message was delivered. I’ll reply to the email address you provided.
          </p>
        )}
        {status.kind === "mailto" && (
          <p className="mt-6 flex items-start gap-3 rounded-2xl border border-[var(--color-cyan)]/30 bg-[var(--color-cyan)]/[0.06] p-4 text-sm text-[var(--color-fg)]">
            <Mail className="mt-0.5 size-4 shrink-0 text-[var(--color-cyan-soft)]" aria-hidden />
            <span>
              Your email app should have opened with the message ready — it isn’t sent until you press send there.{" "}
              <a href={status.href} className="underline underline-offset-4 hover:text-[var(--color-cyan-soft)]">
                Open it again
              </a>{" "}
              or write to{" "}
              <a href={`mailto:${site.email}`} className="underline underline-offset-4 hover:text-[var(--color-cyan-soft)]">
                {site.email}
              </a>
              .
            </span>
          </p>
        )}
        {status.kind === "error" && (
          <p className="mt-6 flex items-start gap-3 rounded-2xl border border-[var(--color-danger)]/30 bg-[var(--color-danger)]/[0.08] p-4 text-sm text-[var(--color-fg)]">
            <AlertCircle className="mt-0.5 size-4 shrink-0 text-[var(--color-danger)]" aria-hidden />
            <span>
              {status.message}{" "}
              {status.mailto && (
                <a href={status.mailto} className="underline underline-offset-4 hover:text-[var(--color-cyan-soft)]">
                  Send it via your email app instead
                </a>
              )}
            </span>
          </p>
        )}
      </div>
    </form>
  );
}
