#!/usr/bin/env node

/**
 * Fetches all items from the marketboard API and writes a trimmed JSON file
 * for client-side search. Run manually when FF14 releases a new game version.
 *
 * Usage: node scripts/fetch-items.mjs
 */

const API_BASE = "https://marketboard-api.ff14.tw/api/v1";
const PAGE_SIZE = 200;
const OUTPUT_PATH = new URL("../src/data/items.json", import.meta.url);

async function fetchPage(page) {
  const url = `${API_BASE}/items?page=${page}&limit=${PAGE_SIZE}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} fetching ${url}`);
  }
  return res.json();
}

async function main() {
  console.log("Fetching items from API...");

  const allItems = [];
  let page = 1;
  let total = Infinity;

  while ((page - 1) * PAGE_SIZE < total) {
    const result = await fetchPage(page);
    total = result.total;

    for (const item of result.data) {
      allItems.push({
        item_id: item.item_id,
        name_en: item.name_en,
        name_zh: item.name_zh,
        category_id: item.category_id,
        category_name: item.category_name,
        is_hq_available: item.is_hq_available,
      });
    }

    console.log(`  Page ${page}: fetched ${result.data.length} items (${allItems.length}/${total})`);
    page++;
  }

  const { writeFileSync } = await import("node:fs");
  const { fileURLToPath } = await import("node:url");
  const outPath = fileURLToPath(OUTPUT_PATH);

  writeFileSync(outPath, JSON.stringify(allItems));

  const { statSync } = await import("node:fs");
  const size = statSync(outPath).size;
  console.log(`\nDone! Wrote ${allItems.length} items to src/data/items.json (${(size / 1024).toFixed(1)} KB)`);
}

main().catch((err) => {
  console.error("Failed:", err.message);
  process.exit(1);
});
