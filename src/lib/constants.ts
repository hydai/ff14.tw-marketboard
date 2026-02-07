export const WORLDS = [
  { id: 4028, name: "伊弗利特", nameEn: "Ifrit" },
  { id: 4029, name: "迦樓羅", nameEn: "Garuda" },
  { id: 4030, name: "利維坦", nameEn: "Leviathan" },
  { id: 4031, name: "鳳凰", nameEn: "Phoenix" },
  { id: 4032, name: "奧汀", nameEn: "Odin" },
  { id: 4033, name: "巴哈姆特", nameEn: "Bahamut" },
  { id: 4034, name: "拉姆", nameEn: "Ramuh" },
  { id: 4035, name: "泰坦", nameEn: "Titan" },
] as const;

export const DATACENTER_NAME = "陸行鳥";

// City names in Traditional Chinese (matching tax_rates columns)
export const CITY_NAMES: Record<string, string> = {
  limsa: "利姆薩·羅敏薩",
  gridania: "格里達尼亞",
  uldah: "烏爾達哈",
  ishgard: "伊修加德",
  kugane: "黃金港",
  crystarium: "水晶都",
  sharlayan: "舊薩雷安",
  tuliyollal: "圖萊尤拉",
};

export const CITY_KEYS = [
  "limsa",
  "gridania",
  "uldah",
  "ishgard",
  "kugane",
  "crystarium",
  "sharlayan",
  "tuliyollal",
] as const;

export type CityKey = (typeof CITY_KEYS)[number];

// Trend period options
export const TREND_PERIODS = [
  { value: "1d", label: "1天" },
  { value: "3d", label: "3天" },
  { value: "7d", label: "7天" },
] as const;

// Trend direction options
export const TREND_DIRECTIONS = [
  { value: "up", label: "上漲" },
  { value: "down", label: "下跌" },
] as const;

// Price history period options
export const PRICE_PERIODS = [
  { value: "1d", label: "1天" },
  { value: "3d", label: "3天" },
  { value: "7d", label: "7天" },
  { value: "14d", label: "14天" },
  { value: "30d", label: "30天" },
  { value: "90d", label: "90天" },
] as const;

// Price history resolution options
export const PRICE_RESOLUTIONS = [
  { value: "raw", label: "原始" },
  { value: "hourly", label: "每小時" },
  { value: "daily", label: "每日" },
] as const;
