interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  className?: string;
}

export function Select({ value, onChange, options, className = "" }: SelectProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`rounded-lg border border-obsidian-800 bg-obsidian-900 px-3 py-2 text-sm text-obsidian-100 outline-none transition-shadow focus:border-gold-500 focus:ring-1 focus:ring-gold-500 focus:shadow-[0_0_12px_rgba(251,191,36,0.06)] ${className}`}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
