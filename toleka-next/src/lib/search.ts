import { type Load, type LoadSearchCriteria } from "@/lib/types";

function normalize(s: string) {
  return s.trim().toLowerCase();
}

export function filterLoads(loads: Load[], criteria: LoadSearchCriteria): Load[] {
  const originCity = criteria.originCity ? normalize(criteria.originCity) : "";
  const destinationCity = criteria.destinationCity
    ? normalize(criteria.destinationCity)
    : "";

  return loads
    .filter((l) => {
      if (criteria.equipment && criteria.equipment !== "Any") {
        if (l.equipment !== criteria.equipment) return false;
      }
      if (criteria.originProvince && criteria.originProvince !== "Any") {
        if (l.originProvince !== criteria.originProvince) return false;
      }
      if (criteria.destinationProvince && criteria.destinationProvince !== "Any") {
        if (l.destinationProvince !== criteria.destinationProvince) return false;
      }
      if (originCity) {
        if (!normalize(l.originCity).includes(originCity)) return false;
      }
      if (destinationCity) {
        if (!normalize(l.destinationCity).includes(destinationCity)) return false;
      }
      if (typeof criteria.minLengthFt === "number") {
        if (l.lengthFt < criteria.minLengthFt) return false;
      }
      if (typeof criteria.maxLengthFt === "number") {
        if (l.lengthFt > criteria.maxLengthFt) return false;
      }
      return true;
    })
    .sort((a, b) => a.postedHoursAgo - b.postedHoursAgo);
}

