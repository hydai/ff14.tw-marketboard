import type { ReactNode } from "react";

interface CardProps {
  title?: string;
  className?: string;
  children: ReactNode;
}

export function Card({ title, className = "", children }: CardProps) {
  return (
    <div
      className={`animate-reveal hover-lift rounded-xl border border-obsidian-800 bg-obsidian-900/80 shadow-lg shadow-black/20 backdrop-blur-sm ${className}`}
    >
      {title && (
        <div className="flex items-center gap-2 border-b border-obsidian-800 px-5 py-3">
          <div className="h-4 w-0.5 rounded-full bg-gold-500" />
          <h3 className="font-heading text-sm font-semibold text-obsidian-100">{title}</h3>
        </div>
      )}
      <div className="p-5">{children}</div>
    </div>
  );
}
