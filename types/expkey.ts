export const ExpKeys = [
  "KonsumsiRumahTangga", "KonsumsiLNPRT", "KonsumsiPemerintah", 
  "PMTB", "PerubahanInventori", 
  "Ekspor", "NetEkspor",
] as const;

export type ExpKey = typeof ExpKeys[number];