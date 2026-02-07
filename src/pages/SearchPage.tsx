import { useState } from "react";
import { Link } from "react-router";
import { PageShell } from "@/components/layout/PageShell";
import { SearchInput } from "@/components/ui/SearchInput";
import { Pagination } from "@/components/ui/Pagination";
import { useItems } from "@/hooks/useItems";

export function SearchPage() {
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [page, setPage] = useState(1);

  const category = categoryId ? Number(categoryId) : undefined;
  const { data, isLoading } = useItems({
    search: search || undefined,
    category,
    page,
    limit: 20,
  });

  const totalPages = data ? Math.ceil(data.total / data.limit) : 1;

  return (
    <PageShell title="物品搜尋">
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="flex-1">
          <SearchInput
            value={search}
            onChange={(v) => {
              setSearch(v);
              setPage(1);
            }}
            placeholder="搜尋物品名稱..."
          />
        </div>
        <input
          type="text"
          value={categoryId}
          onChange={(e) => {
            setCategoryId(e.target.value);
            setPage(1);
          }}
          placeholder="分類 ID（選填）"
          className="w-40 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500"
        />
      </div>

      <div className="overflow-x-auto rounded-lg border border-zinc-800">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-zinc-800 bg-zinc-900/50 text-xs uppercase text-zinc-400">
            <tr>
              <th className="px-4 py-3">物品名稱</th>
              <th className="px-4 py-3">英文名</th>
              <th className="px-4 py-3">分類</th>
              <th className="px-4 py-3">HQ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {isLoading ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-zinc-500">
                  載入中...
                </td>
              </tr>
            ) : !data?.data.length ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-zinc-500">
                  無搜尋結果
                </td>
              </tr>
            ) : (
              data.data.map((item) => (
                <tr
                  key={item.item_id}
                  className="bg-zinc-900 transition-colors hover:bg-zinc-800"
                >
                  <td className="px-4 py-3">
                    <Link
                      to={`/items/${item.item_id}`}
                      className="text-gold-400 hover:underline"
                    >
                      {item.name_zh}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-zinc-300">{item.name_en}</td>
                  <td className="px-4 py-3 text-zinc-400">
                    {item.category_name ?? "-"}
                  </td>
                  <td className="px-4 py-3">
                    {item.is_hq_available === 1 && (
                      <span className="rounded bg-cyan-900/50 px-2 py-0.5 text-xs text-cyan-400">
                        HQ
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      )}
    </PageShell>
  );
}
