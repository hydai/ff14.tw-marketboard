import { useEffect, type ReactNode } from "react";

interface PageShellProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export function PageShell({ title, description, children }: PageShellProps) {
  useEffect(() => {
    document.title = `${title} - 陸行鳥市場板`;
  }, [title]);

  return (
    <div className="animate-reveal space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-obsidian-100">{title}</h1>
        {description && (
          <p className="mt-1 text-sm text-obsidian-400">{description}</p>
        )}
        <div className="mt-3 h-px bg-gradient-to-r from-gold-500/40 via-gold-500/10 to-transparent" />
      </div>
      {children}
    </div>
  );
}
