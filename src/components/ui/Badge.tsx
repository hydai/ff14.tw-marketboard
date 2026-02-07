import type { ReactNode } from "react";

type BadgeVariant = "default" | "hq" | "profit" | "loss";

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: "bg-zinc-800 text-zinc-300",
  hq: "bg-cyan-900/50 text-cyan-400",
  profit: "bg-emerald-900/50 text-emerald-400",
  loss: "bg-red-900/50 text-red-400",
};

export function Badge({ children, variant = "default" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${variantClasses[variant]}`}
    >
      {children}
    </span>
  );
}
