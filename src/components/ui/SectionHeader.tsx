import { Reveal, SplitHeading } from "./Reveal";

type Props = {
  index: string;
  kicker: string;
  title: string;
  id: string;
  intro?: string;
  align?: "left" | "split";
};

/** Consistent editorial section header: index · kicker, big split heading, optional intro. */
export function SectionHeader({ index, kicker, title, id, intro, align = "left" }: Props) {
  return (
    <div className={align === "split" ? "grid gap-8 md:grid-cols-12 md:items-end" : ""}>
      <div className={align === "split" ? "md:col-span-7" : "max-w-4xl"}>
        <Reveal>
          <p className="kicker flex items-center gap-3">
            <span className="text-[var(--color-fg-subtle)]">{index}</span>
            <span aria-hidden className="h-px w-8 bg-[var(--color-line-strong)]" />
            {kicker}
          </p>
        </Reveal>
        <SplitHeading
          as="h2"
          text={title}
          id={id}
          className="text-display mt-5 text-[clamp(2.2rem,5.4vw,4.6rem)]"
        />
      </div>
      {intro && (
        <Reveal className={align === "split" ? "md:col-span-5 md:pb-2" : "mt-6 max-w-2xl"} delay={0.1}>
          <p className="text-base leading-relaxed text-[var(--color-fg-muted)] md:text-lg">{intro}</p>
        </Reveal>
      )}
    </div>
  );
}
