import { type Province } from "@/lib/types";

export const PROVINCES: Province[] = [
  "Haut-Katanga",
  "Lualaba",
  "Kinshasa",
  "Kongo-Central",
  "Tanganyika",
  "Nord-Kivu",
  "Sud-Kivu",
  "Tshopo",
  "Ituri",
  "Kasaï",
  "Kasaï-Central",
  "Zambie",
  "Angola",
];

export const CITIES_BY_PROVINCE: Record<Province, string[]> = {
  "Haut-Katanga": ["Lubumbashi", "Likasi", "Kipushi", "Kasumbalesa", "Sakania"],
  Lualaba: ["Kolwezi", "Kambove", "Mutshatsha", "Dilolo"],
  Kinshasa: ["Kinshasa"],
  "Kongo-Central": ["Matadi", "Boma", "Muanda"],
  Tanganyika: ["Kalemie"],
  "Nord-Kivu": ["Goma", "Beni"],
  "Sud-Kivu": ["Bukavu", "Uvira"],
  Tshopo: ["Kisangani"],
  Ituri: ["Bunia"],
  "Kasaï": ["Tshikapa"],
  "Kasaï-Central": ["Kananga"],
  Zambie: ["Ndola", "Kitwe", "Lusaka"],
  Angola: ["Luanda", "Soyo"],
};

export function allCities(): string[] {
  const set = new Set<string>();
  for (const p of PROVINCES) {
    for (const city of CITIES_BY_PROVINCE[p] ?? []) set.add(city);
  }
  return [...set].sort((a, b) => a.localeCompare(b));
}

