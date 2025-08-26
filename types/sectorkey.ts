export const sectorKeys = [
  "A", "B", "C", "D", "E", "F", "G", "H",
  "I", "J", "K", "L", "MN", "O", "P",
  "Q", "RSTU"
] as const;

export type SectorKey = typeof sectorKeys[number];