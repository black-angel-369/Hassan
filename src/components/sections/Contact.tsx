import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import { contact, site } from "@/content/portfolio";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Magnetic } from "@/components/ui/Magnetic";
import { ContactForm } from "./ContactForm";

const channels = [
  { icon: Mail, label: "Email", value: site.email, href: `mailto:${site.email}`, action: "Send an email" },
  { icon: Phone, label: "Phone", value: site.phoneDisplay, href: `tel:${site.phone}`, action: "Call now" },
];

export function Contact({ backendEnabled }: { backendEnabled: boolean }) {
  return (
    <section id="contact" aria-labelledby="contact-title" className="relative overflow-hidden py-28 md:py-40">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 bottom-0 size-[640px] rounded-full bg-[radial-gradient(circle,rgb(34_211_238/0.10),transparent_65%)] blur-2xl"
      />
      <div className="container-x relative">
        <SectionHeader index="06" kicker={contact.kicker} title={contact.heading} id="contact-title" intro={contact.body} />

        <div className="mt-16 grid grid-cols-[minmax(0,1fr)] gap-10 md:mt-24 lg:grid-cols-12 lg:gap-14">
          <Reveal stagger={0.1} className="flex min-w-0 flex-col gap-4 lg:col-span-5">
            {channels.map(({ icon: Icon, label, value, href, action }) => (
              <Magnetic key={label} strength={0.08} className="w-full">
                <a
                  href={href}
                  className="glass group flex min-h-24 w-full items-center gap-5 rounded-3xl p-5 transition-[border-color,background-color] duration-300 hover:border-[var(--color-cyan)]/50 hover:bg-white/[0.04] md:p-6"
                >
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-[var(--color-cyan)]/25 bg-[var(--color-cyan)]/[0.08] text-[var(--color-cyan-soft)]">
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-mono text-xs tracking-[0.18em] text-[var(--color-fg-subtle)] uppercase">
                      {label}
                    </span>
                    <span className="mt-1 block text-[var(--color-fg)] [overflow-wrap:anywhere] sm:text-lg">{value}</span>
                    <span className="sr-only"> — {action}</span>
                  </span>
                  <ArrowUpRight
                    className="size-5 shrink-0 text-[var(--color-fg-subtle)] transition-[transform,color] duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[var(--color-cyan-soft)]"
                    aria-hidden
                  />
                </a>
              </Magnetic>
            ))}
            <div className="flex items-center gap-5 rounded-3xl border border-[var(--color-line)] p-5 md:p-6">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-[var(--color-line)] text-[var(--color-fg-muted)]">
                <MapPin className="size-5" aria-hidden />
              </span>
              <span>
                <span className="block font-mono text-xs tracking-[0.18em] text-[var(--color-fg-subtle)] uppercase">Location</span>
                <span className="mt-1 block text-[var(--color-fg)] sm:text-lg">{site.location}</span>
              </span>
            </div>
          </Reveal>

          <Reveal className="min-w-0 lg:col-span-7" delay={0.1}>
            <ContactForm backendEnabled={backendEnabled} />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
