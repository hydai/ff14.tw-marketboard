interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  return (
    <div className="flex items-center justify-center gap-4">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className="rounded-lg border border-obsidian-800 bg-obsidian-900 px-4 py-2 text-sm text-obsidian-300 transition-colors hover:border-gold-500/30 hover:text-gold-400 disabled:cursor-not-allowed disabled:opacity-40"
      >
        上一頁
      </button>
      <span className="font-mono text-sm text-obsidian-400">
        {page} / {totalPages}
      </span>
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        className="rounded-lg border border-obsidian-800 bg-obsidian-900 px-4 py-2 text-sm text-obsidian-300 transition-colors hover:border-gold-500/30 hover:text-gold-400 disabled:cursor-not-allowed disabled:opacity-40"
      >
        下一頁
      </button>
    </div>
  );
}
