import { useState, useEffect } from "react";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchInput({
  value,
  onChange,
  placeholder = "搜尋...",
}: SearchInputProps) {
  const [local, setLocal] = useState(value);

  useEffect(() => {
    setLocal(value);
  }, [value]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (local !== value) {
        onChange(local);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [local, value, onChange]);

  return (
    <input
      type="text"
      value={local}
      onChange={(e) => setLocal(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-lg border border-obsidian-800 bg-obsidian-900 px-4 py-2 text-sm text-obsidian-100 placeholder-obsidian-500 outline-none transition-shadow focus:border-gold-500 focus:ring-1 focus:ring-gold-500 focus:shadow-[0_0_12px_rgba(251,191,36,0.06)]"
    />
  );
}
