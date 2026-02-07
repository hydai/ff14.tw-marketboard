import type { ReactNode } from "react";

interface CardProps {
  title?: string;
  className?: string;
  children: ReactNode;
}

export function Card({ title, className = "", children }: CardProps) {
  return (
    <div
      className={`rounded-xl border border-zinc-800 bg-zinc-900 shadow ${className}`}
    >
      {title && (
        <div className="border-b border-zinc-800 px-5 py-3">
          <h3 className="text-sm font-semibold text-zinc-100">{title}</h3>
        </div>
      )}
      <div className="p-5">{children}</div>
    </div>
  );
}
