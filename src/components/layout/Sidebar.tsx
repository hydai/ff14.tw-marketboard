import { NavLink } from "react-router";

const navItems = [
  { to: "/", label: "市場總覽", icon: "✦" },
  { to: "/search", label: "物品搜尋", icon: "⌘" },
  { to: "/arbitrage", label: "跨服套利", icon: "⚔" },
  { to: "/deals", label: "撿漏排行", icon: "⬦" },
  { to: "/trending", label: "趨勢分析", icon: "↗" },
  { to: "/tax-rates", label: "稅率資訊", icon: "⚖" },
];

export function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-56 flex-col border-r border-obsidian-800 bg-gradient-to-b from-obsidian-950 via-obsidian-900 to-obsidian-950">
      <div className="flex items-center gap-3 border-b border-obsidian-800 px-4 py-4">
        <span className="text-shimmer text-2xl font-display">&#x2726;</span>
        <div>
          <h1 className="font-heading text-sm font-bold text-gold-400">陸行鳥</h1>
          <p className="font-mono text-[10px] uppercase tracking-widest text-obsidian-500">Market Board</p>
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
                      ? "border-l-2 border-gold-500 bg-gold-500/5 text-gold-400"
                      : "border-l-2 border-transparent text-obsidian-400 hover:bg-obsidian-800/50 hover:text-obsidian-200"
                  }`
                }
              >
                <span className="text-xs">{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="border-t border-obsidian-800 px-4 py-3">
        <p className="font-mono text-[10px] uppercase tracking-wider text-obsidian-600">資料來源：Universalis</p>
      </div>
    </aside>
  );
}
