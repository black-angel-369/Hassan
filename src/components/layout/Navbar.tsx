"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Download, Menu, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { nav, site } from "@/content/portfolio";
import { LogoMark } from "@/components/ui/Logo";

function useActiveSection(ids: string[]) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      // A thin band across the upper-middle of the viewport decides the active section.
      { rootMargin: "-40% 0px -55% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [ids]);
  return active;
}

const ids = nav.map((n) => n.id);

export function Navbar() {
  const active = useActiveSection(ids);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
      // Hide on fast downward scroll past the hero, reveal on upward intent.
      if (Math.abs(y - last) > 6) {
        setHidden(y > last && y > window.innerHeight * 0.9);
        last = y;
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const close = useCallback((restoreFocus = true) => {
    setOpen(false);
    if (restoreFocus) toggleRef.current?.focus();
  }, []);

  // Mobile menu: lock scroll, close on Escape, trap focus.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "Tab" && menuRef.current) {
        const f = menuRef.current.querySelectorAll<HTMLElement>("a, button");
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    menuRef.current?.querySelector<HTMLElement>("a")?.focus();
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-transform duration-500 ease-[var(--ease-out-expo)] ${
        hidden && !open ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-[90] focus:rounded-md focus:bg-[var(--color-cyan)] focus:px-4 focus:py-2 focus:text-[var(--color-ink-950)]"
      >
        Skip to content
      </a>
      <div className="container-x pt-3 md:pt-4">
        <nav
          aria-label="Primary"
          className={`flex h-14 items-center justify-between rounded-full pr-2 pl-4 transition-[background-color,border-color,box-shadow] duration-500 md:h-[3.75rem] ${
            scrolled || open
              ? "border border-[var(--color-line)] bg-[rgb(8_12_20/0.92)] shadow-[0_10px_40px_-20px_rgb(0_0_0/0.8)] backdrop-blur-xl backdrop-saturate-150"
              : "border border-transparent bg-transparent"
          }`}
        >
          <a href="#home" className="flex min-h-11 items-center gap-2.5 rounded-full" aria-label={`${site.name} — home`}>
            <LogoMark className="size-7 text-[var(--color-fg)]" />
            <span className="font-display text-[0.95rem] font-semibold tracking-tight whitespace-nowrap">
              {site.shortName}
              <span className="text-[var(--color-cyan)]">.</span>
            </span>
          </a>

          <ul className="hidden items-center gap-1 lg:flex">
            {nav.map((item) => {
              const isActive = active === item.id;
              return (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    aria-current={isActive ? "location" : undefined}
                    className={`relative flex min-h-10 items-center rounded-full px-2.5 text-sm xl:px-3.5 transition-colors duration-300 ${
                      isActive ? "text-[var(--color-fg)]" : "text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]"
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-0 rounded-full border border-[var(--color-line-strong)] bg-white/[0.05]"
                        transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 380, damping: 32 }}
                      />
                    )}
                    <span className="relative">{item.label}</span>
                  </a>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-2">
            <a
              href={site.cv.href}
              download={site.cv.fileName}
              className="hidden min-h-10 shrink-0 items-center gap-2 whitespace-nowrap rounded-full border border-[var(--color-line-strong)] px-4 text-sm font-medium text-[var(--color-fg)] transition-colors duration-300 hover:border-[var(--color-cyan)] hover:text-[var(--color-cyan-soft)] sm:inline-flex"
            >
              <Download className="size-4" aria-hidden="true" />
              <span>
                <span className="lg:max-xl:sr-only">Download </span>CV
              </span>
            </a>
            <a
              href="#contact"
              className="hidden min-h-10 shrink-0 items-center whitespace-nowrap rounded-full bg-[var(--color-fg)] px-4 text-sm font-medium text-[var(--color-ink-950)] transition-colors duration-300 hover:bg-[var(--color-cyan-soft)] sm:inline-flex"
            >
              Let’s talk
            </a>
            <button
              ref={toggleRef}
              type="button"
              className="inline-flex size-11 cursor-pointer items-center justify-center rounded-full text-[var(--color-fg)] hover:bg-white/[0.06] lg:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((o) => !o)}
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </nav>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            ref={menuRef}
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            initial={reduce ? { opacity: 0 } : { opacity: 0, clipPath: "inset(0 0 100% 0)" }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, clipPath: "inset(0 0 0% 0)" }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-x-0 top-0 -z-10 flex h-[100dvh] flex-col bg-[var(--color-ink-950)]/[0.97] px-6 pt-24 pb-10 backdrop-blur-xl lg:hidden"
          >
            <ul className="flex flex-1 flex-col justify-center gap-1">
              {nav.map((item, i) => (
                <motion.li
                  key={item.id}
                  initial={reduce ? false : { opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: reduce ? 0 : 0.08 + i * 0.045, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                >
                  <a
                    href={`#${item.id}`}
                    onClick={() => close(false)}
                    aria-current={active === item.id ? "location" : undefined}
                    className="group flex min-h-14 items-baseline gap-4 border-b border-[var(--color-line)] py-2"
                  >
                    <span className="font-mono text-xs text-[var(--color-fg-subtle)]">0{i + 1}</span>
                    <span
                      className={`text-display text-4xl transition-colors ${
                        active === item.id ? "text-[var(--color-cyan-soft)]" : "text-[var(--color-fg)]"
                      }`}
                    >
                      {item.label}
                    </span>
                  </a>
                </motion.li>
              ))}
            </ul>
            <a
              href={site.cv.href}
              download={site.cv.fileName}
              onClick={() => close(false)}
              className="mb-6 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[var(--color-fg)] px-6 text-sm font-medium text-[var(--color-ink-950)] transition-colors hover:bg-[var(--color-cyan-soft)]"
            >
              <Download className="size-4" aria-hidden="true" />
              Download CV
            </a>
            <div className="space-y-1 font-mono text-sm text-[var(--color-fg-muted)]">
              <a className="block py-1.5 hover:text-[var(--color-fg)]" href={`mailto:${site.email}`}>
                {site.email}
              </a>
              <a className="block py-1.5 hover:text-[var(--color-fg)]" href={`tel:${site.phone}`}>
                {site.phoneDisplay}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
