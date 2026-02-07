#!/usr/bin/env node

/**
 * Merges Traditional Chinese item names from tw-items.json into src/data/items.json.
 * For each item, looks up item_id in tw-items.json and sets name_zh to the `tw` value.
 * Items without a translation keep their English name as fallback.
 *
 * Usage: node scripts/merge-tw-names.mjs
 */

import { readFileSync, writeFileSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";

const ITEMS_PATH = fileURLToPath(new URL("../src/data/items.json", import.meta.url));
const TW_PATH = fileURLToPath(new URL("../tw-items.json", import.meta.url));

const items = JSON.parse(readFileSync(ITEMS_PATH, "utf-8"));
const twNames = JSON.parse(readFileSync(TW_PATH, "utf-8"));

let updated = 0;
let missing = 0;

for (const item of items) {
  const tw = twNames[String(item.item_id)];
  if (tw && tw.tw) {
    item.name_zh = tw.tw;
    updated++;
  } else {
    missing++;
  }
}

writeFileSync(ITEMS_PATH, JSON.stringify(items));

const size = statSync(ITEMS_PATH).size;
console.log(`Done! Updated ${updated} items, ${missing} missing translations.`);
console.log(`Wrote ${items.length} items to src/data/items.json (${(size / 1024).toFixed(1)} KB)`);
