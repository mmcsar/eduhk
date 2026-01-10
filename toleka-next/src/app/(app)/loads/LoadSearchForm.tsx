"use client";

import { CITIES_BY_PROVINCE, PROVINCES } from "@/lib/locations";
import { type Equipment, type LoadSearchCriteria, type Province } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

const EQUIPMENT: (Equipment | "Any")[] = [
  "Any",
  "Flatbed",
  "Dry Van",
  "Reefer",
  "Tanker",
  "Lowboy",
  "Container",
];

function buildQuery(c: LoadSearchCriteria): string {
  const sp = new URLSearchParams();
  if (c.equipment && c.equipment !== "Any") sp.set("equipment", c.equipment);
  if (c.originProvince && c.originProvince !== "Any")
    sp.set("originProvince", c.originProvince);
  if (c.originCity) sp.set("originCity", c.originCity);
  if (c.destinationProvince && c.destinationProvince !== "Any")
    sp.set("destinationProvince", c.destinationProvince);
  if (c.destinationCity) sp.set("destinationCity", c.destinationCity);
  if (typeof c.minLengthFt === "number") sp.set("minLengthFt", String(c.minLengthFt));
  if (typeof c.maxLengthFt === "number") sp.set("maxLengthFt", String(c.maxLengthFt));
  const qs = sp.toString();
  return qs ? `?${qs}` : "";
}

export function LoadSearchForm({
  initial,
}: {
  initial?: Partial<Record<string, string>>;
}) {
  const router = useRouter();
  const [equipment, setEquipment] = useState<Equipment | "Any">(
    (initial?.equipment as Equipment) ?? "Any",
  );
  const [originProvince, setOriginProvince] = useState<Province | "Any">(
    (initial?.originProvince as Province) ?? "Any",
  );
  const [originCity, setOriginCity] = useState(initial?.originCity ?? "");
  const [destinationProvince, setDestinationProvince] = useState<Province | "Any">(
    (initial?.destinationProvince as Province) ?? "Any",
  );
  const [destinationCity, setDestinationCity] = useState(
    initial?.destinationCity ?? "",
  );
  const [minLengthFt, setMinLengthFt] = useState(initial?.minLengthFt ?? "");
  const [maxLengthFt, setMaxLengthFt] = useState(initial?.maxLengthFt ?? "");

  const originCityOptions = useMemo(() => {
    if (originProvince === "Any") return [];
    return CITIES_BY_PROVINCE[originProvince] ?? [];
  }, [originProvince]);

  const destinationCityOptions = useMemo(() => {
    if (destinationProvince === "Any") return [];
    return CITIES_BY_PROVINCE[destinationProvince] ?? [];
  }, [destinationProvince]);

  return (
    <form
      className="grid gap-4 md:grid-cols-12"
      onSubmit={(e) => {
        e.preventDefault();

        const criteria: LoadSearchCriteria = {
          equipment,
          originProvince,
          originCity: originCity || undefined,
          destinationProvince,
          destinationCity: destinationCity || undefined,
        };

        const min = Number(minLengthFt);
        const max = Number(maxLengthFt);
        if (Number.isFinite(min) && min > 0) criteria.minLengthFt = min;
        if (Number.isFinite(max) && max > 0) criteria.maxLengthFt = max;

        router.push(`/loads/results${buildQuery(criteria)}`);
      }}
    >
      <div className="md:col-span-3">
        <label className="mb-1 block text-sm font-semibold text-slate-700">
          Equipment
        </label>
        <select
          className="toleka-select"
          value={equipment}
          onChange={(e) => setEquipment(e.target.value as Equipment | "Any")}
        >
          {EQUIPMENT.map((e) => (
            <option key={e} value={e}>
              {e}
            </option>
          ))}
        </select>
      </div>

      <div className="md:col-span-3">
        <label className="mb-1 block text-sm font-semibold text-slate-700">
          Origine (province)
        </label>
        <select
          className="toleka-select"
          value={originProvince}
          onChange={(e) => {
            setOriginProvince(e.target.value as Province | "Any");
            setOriginCity("");
          }}
        >
          <option value="Any">Any</option>
          {PROVINCES.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>

      <div className="md:col-span-3">
        <label className="mb-1 block text-sm font-semibold text-slate-700">
          Origine (ville)
        </label>
        <input
          className="toleka-input"
          value={originCity}
          onChange={(e) => setOriginCity(e.target.value)}
          placeholder="ex: Lubumbashi"
          list="origin-cities"
        />
        {originCityOptions.length > 0 ? (
          <datalist id="origin-cities">
            {originCityOptions.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
        ) : null}
      </div>

      <div className="md:col-span-3">
        <label className="mb-1 block text-sm font-semibold text-slate-700">
          Destination (province)
        </label>
        <select
          className="toleka-select"
          value={destinationProvince}
          onChange={(e) => {
            setDestinationProvince(e.target.value as Province | "Any");
            setDestinationCity("");
          }}
        >
          <option value="Any">Any</option>
          {PROVINCES.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>

      <div className="md:col-span-3">
        <label className="mb-1 block text-sm font-semibold text-slate-700">
          Destination (ville)
        </label>
        <input
          className="toleka-input"
          value={destinationCity}
          onChange={(e) => setDestinationCity(e.target.value)}
          placeholder="ex: Kolwezi"
          list="dest-cities"
        />
        {destinationCityOptions.length > 0 ? (
          <datalist id="dest-cities">
            {destinationCityOptions.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
        ) : null}
      </div>

      <div className="md:col-span-2">
        <label className="mb-1 block text-sm font-semibold text-slate-700">
          Longueur min (ft)
        </label>
        <input
          className="toleka-input"
          inputMode="numeric"
          value={minLengthFt}
          onChange={(e) => setMinLengthFt(e.target.value)}
          placeholder="ex: 40"
        />
      </div>

      <div className="md:col-span-2">
        <label className="mb-1 block text-sm font-semibold text-slate-700">
          Longueur max (ft)
        </label>
        <input
          className="toleka-input"
          inputMode="numeric"
          value={maxLengthFt}
          onChange={(e) => setMaxLengthFt(e.target.value)}
          placeholder="ex: 53"
        />
      </div>

      <div className="flex items-end gap-2 md:col-span-2">
        <button className="toleka-btn w-full" type="submit">
          Find Loads
        </button>
      </div>

      <div className="flex items-end gap-2 md:col-span-2">
        <button
          className="toleka-btn-secondary w-full"
          type="button"
          onClick={() => router.push("/loads")}
        >
          Effacer
        </button>
      </div>
    </form>
  );
}

