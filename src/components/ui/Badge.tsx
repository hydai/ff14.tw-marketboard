import type { ReactNode } from "react";

type BadgeVariant = "default" | "hq" | "profit" | "loss";

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: "bg-obsidian-800 text-obsidian-300 ring-1 ring-obsidian-700",
  hq: "bg-crystal-900/50 text-crystal-400 ring-1 ring-crystal-400/20",
  profit: "bg-aether-900/50 text-aether-400 ring-1 ring-aether-400/20",
  loss: "bg-ember-900/50 text-ember-400 ring-1 ring-ember-400/20",
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
