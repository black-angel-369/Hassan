/** Shared (client + server) contact form validation. No external deps. */

export type ContactInput = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export type ContactErrors = Partial<Record<keyof ContactInput, string>>;

export const LIMITS = {
  name: { min: 2, max: 80 },
  email: { max: 254 },
  subject: { min: 3, max: 120 },
  message: { min: 20, max: 4000 },
} as const;

// Pragmatic email check (RFC-complete validation is not useful for UX).
const EMAIL_RE = /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[A-Za-z]{2,}$/;
// Control chars except tab/newline/CR.
const CONTROL_RE = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;

export function sanitize(value: unknown, singleLine: boolean): string {
  if (typeof value !== "string") return "";
  let v = value.replace(CONTROL_RE, "").normalize("NFC");
  if (singleLine) v = v.replace(/[\r\n]+/g, " ");
  return v.trim();
}

export function normalizeContact(raw: Partial<Record<keyof ContactInput, unknown>>): ContactInput {
  return {
    name: sanitize(raw.name, true),
    email: sanitize(raw.email, true).toLowerCase(),
    subject: sanitize(raw.subject, true),
    message: sanitize(raw.message, false),
  };
}

export function validateField(field: keyof ContactInput, value: string): string | undefined {
  switch (field) {
    case "name":
      if (!value) return "Please enter your name.";
      if (value.length < LIMITS.name.min) return "Name looks too short.";
      if (value.length > LIMITS.name.max) return `Keep it under ${LIMITS.name.max} characters.`;
      return;
    case "email":
      if (!value) return "Please enter your email address.";
      if (value.length > LIMITS.email.max || !EMAIL_RE.test(value))
        return "Enter a valid email, e.g. name@example.com.";
      return;
    case "subject":
      if (!value) return "Please add a subject.";
      if (value.length < LIMITS.subject.min) return "Subject looks too short.";
      if (value.length > LIMITS.subject.max) return `Keep it under ${LIMITS.subject.max} characters.`;
      return;
    case "message":
      if (!value) return "Please write a message.";
      if (value.length < LIMITS.message.min)
        return `A little more detail, please (at least ${LIMITS.message.min} characters).`;
      if (value.length > LIMITS.message.max) return `Keep it under ${LIMITS.message.max} characters.`;
      return;
  }
}

export function validateContact(input: ContactInput): ContactErrors {
  const errors: ContactErrors = {};
  (Object.keys(input) as (keyof ContactInput)[]).forEach((k) => {
    const e = validateField(k, input[k]);
    if (e) errors[k] = e;
  });
  return errors;
}

export function buildMailto(to: string, input: ContactInput): string {
  const body = `${input.message}\n\n— ${input.name}${input.email ? ` <${input.email}>` : ""}`;
  return `mailto:${to}?subject=${encodeURIComponent(input.subject)}&body=${encodeURIComponent(body)}`;
}
