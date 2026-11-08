import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { Magnetic } from "./Magnetic";

type Variant = "primary" | "ghost";

const base =
  "group relative inline-flex min-h-12 items-center whitespace-nowrap justify-center gap-2.5 overflow-hidden rounded-full px-6 py-3 text-[0.95rem] font-medium tracking-tight transition-[color,background-color,border-color,box-shadow,transform] duration-300 ease-[var(--ease-out-expo)] cursor-pointer focus-visible:outline-offset-4 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-60";

const variants: Record<Variant, string> = {
  primary:
    "bg-[var(--color-cyan)] text-[var(--color-ink-950)] shadow-[0_0_0_1px_rgb(103_232_249/0.6),0_10px_40px_-10px_rgb(34_211_238/0.7)] hover:shadow-[0_0_0_1px_rgb(165_243_252/0.9),0_14px_50px_-8px_rgb(34_211_238/0.85)]",
  ghost:
    "glass text-[var(--color-fg)] hover:border-[var(--color-line-strong)] hover:bg-white/[0.06]",
};

function Shine({ variant }: { variant: Variant }) {
  return (
    <span
      aria-hidden
      className={`pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent ${
        variant === "primary" ? "via-white/45" : "via-white/10"
      } to-transparent transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:translate-x-full`}
    />
  );
}

type LinkProps = ComponentPropsWithoutRef<"a"> & { variant?: Variant; icon?: ReactNode; magnetic?: boolean };

export function ButtonLink({ variant = "primary", icon, magnetic = true, className, children, ...rest }: LinkProps) {
  const el = (
    <a className={`${base} ${variants[variant]} ${className ?? ""}`} {...rest}>
      <Shine variant={variant} />
      <span className="relative">{children}</span>
      {icon && <span className="relative transition-transform duration-300 group-hover:translate-x-0.5">{icon}</span>}
    </a>
  );
  return magnetic ? <Magnetic>{el}</Magnetic> : el;
}

type BtnProps = ComponentPropsWithoutRef<"button"> & { variant?: Variant; icon?: ReactNode; magnetic?: boolean };

export function Button({ variant = "primary", icon, magnetic = false, className, children, ...rest }: BtnProps) {
  const el = (
    <button className={`${base} ${variants[variant]} ${className ?? ""}`} {...rest}>
      <Shine variant={variant} />
      <span className="relative">{children}</span>
      {icon && <span className="relative">{icon}</span>}
    </button>
  );
  return magnetic ? <Magnetic>{el}</Magnetic> : el;
}
