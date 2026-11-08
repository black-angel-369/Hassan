import { ArrowUp, Mail, MapPin, Phone } from "lucide-react";
import { nav, site } from "@/content/portfolio";
import { LogoMark } from "@/components/ui/Logo";
import { CurrentYear } from "./CurrentYear";

export function Footer() {
  return (
    <footer className="relative border-t border-[var(--color-line)] bg-[var(--color-ink-950)]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--color-cyan)]/50 to-transparent"
      />
      <div className="container-x grid gap-12 py-16 md:grid-cols-12 md:py-20">
        <div className="md:col-span-5">
          <div className="flex items-center gap-3">
            <LogoMark className="size-9 text-[var(--color-fg)]" />
            <p className="font-display text-xl font-semibold tracking-tight">{site.name}</p>
          </div>
          <p className="mt-3 text-[var(--color-fg-muted)]">{site.title}</p>
          <p className="mt-6 max-w-sm text-sm text-[var(--color-fg-subtle)]">
            Building sophisticated software — and understanding how to secure it.
          </p>
        </div>

        <nav aria-label="Footer" className="md:col-span-3">
          <p className="kicker mb-4">Navigate</p>
          <ul className="grid grid-cols-2 gap-x-6 gap-y-1 md:grid-cols-1">
            {nav.map((n) => (
              <li key={n.id}>
                <a
                  href={`#${n.id}`}
                  className="inline-flex min-h-9 items-center text-sm text-[var(--color-fg-muted)] transition-colors hover:text-[var(--color-fg)]"
                >
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="md:col-span-4">
          <p className="kicker mb-4">Contact</p>
          <ul className="space-y-1 text-sm">
            <li>
              <a
                href={`mailto:${site.email}`}
                className="inline-flex min-h-9 items-center gap-3 break-all text-[var(--color-fg-muted)] transition-colors hover:text-[var(--color-fg)]"
              >
                <Mail className="size-4 shrink-0 text-[var(--color-cyan)]" aria-hidden />
                {site.email}
              </a>
            </li>
            <li>
              <a
                href={`tel:${site.phone}`}
                className="inline-flex min-h-9 items-center gap-3 text-[var(--color-fg-muted)] transition-colors hover:text-[var(--color-fg)]"
              >
                <Phone className="size-4 shrink-0 text-[var(--color-cyan)]" aria-hidden />
                {site.phoneDisplay}
              </a>
            </li>
            <li className="inline-flex min-h-9 items-center gap-3 text-[var(--color-fg-muted)]">
              <MapPin className="size-4 shrink-0 text-[var(--color-cyan)]" aria-hidden />
              {site.location}
            </li>
          </ul>
          {site.socials.length > 0 && (
            <ul className="mt-4 flex flex-wrap gap-3">
              {site.socials.map((s) => (
                <li key={s.href}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-[var(--color-fg-muted)] underline-offset-4 hover:text-[var(--color-fg)] hover:underline"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="container-x flex flex-col items-start justify-between gap-4 border-t border-[var(--color-line)] py-6 text-xs text-[var(--color-fg-subtle)] sm:flex-row sm:items-center">
        <p>
          © <CurrentYear /> {site.name}. All rights reserved.
        </p>
        <a
          href="#home"
          className="group inline-flex min-h-10 items-center gap-2 rounded-full border border-[var(--color-line)] px-4 text-[var(--color-fg-muted)] transition-colors hover:border-[var(--color-line-strong)] hover:text-[var(--color-fg)]"
        >
          Back to top
          <ArrowUp className="size-3.5 transition-transform duration-300 group-hover:-translate-y-0.5" aria-hidden />
        </a>
      </div>
    </footer>
  );
}
