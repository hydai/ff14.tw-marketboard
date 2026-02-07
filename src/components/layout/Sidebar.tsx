import { NavLink } from "react-router";

const navItems = [
  { to: "/", label: "市場總覽", icon: "📊" },
  { to: "/search", label: "物品搜尋", icon: "🔍" },
  { to: "/arbitrage", label: "跨服套利", icon: "💰" },
  { to: "/deals", label: "撿漏排行", icon: "🏷️" },
  { to: "/trending", label: "趨勢分析", icon: "📈" },
  { to: "/tax-rates", label: "稅率資訊", icon: "🏛️" },
];

export function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-56 flex-col border-r border-zinc-800 bg-zinc-950">
      <div className="flex items-center gap-2 border-b border-zinc-800 px-4 py-4">
        <span className="text-2xl">🐥</span>
        <div>
          <h1 className="text-sm font-bold text-gold-400">陸行鳥</h1>
          <p className="text-xs text-zinc-500">市場板</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-3">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                    isActive
                      ? "bg-zinc-800 text-gold-400"
                      : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200"
                  }`
                }
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="border-t border-zinc-800 px-4 py-3">
        <p className="text-xs text-zinc-600">資料來源：Universalis</p>
      </div>
    </aside>
  );
}
