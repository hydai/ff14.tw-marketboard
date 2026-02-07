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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-100">{title}</h1>
        {description && (
          <p className="mt-1 text-sm text-zinc-400">{description}</p>
        )}
      </div>
      {children}
    </div>
  );
}
