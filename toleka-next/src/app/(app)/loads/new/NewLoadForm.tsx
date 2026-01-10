"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { CITIES_BY_PROVINCE, PROVINCES } from "@/lib/locations";
import { type Province } from "@/lib/types";

const EQUIPMENT = ["Flatbed", "Dry Van", "Reefer", "Tanker", "Lowboy", "Container"] as const;

export function NewLoadForm() {
  const router = useRouter();
  const [status, setStatus] = useState<"POSTED" | "DRAFT">("POSTED");
  const [originProvince, setOriginProvince] = useState<Province>("Haut-Katanga");
  const [originCity, setOriginCity] = useState("Lubumbashi");
  const [destinationProvince, setDestinationProvince] = useState<Province>("Lualaba");
  const [destinationCity, setDestinationCity] = useState("Kolwezi");
  const [equipment, setEquipment] = useState<(typeof EQUIPMENT)[number]>("Flatbed");
  const [lengthFt, setLengthFt] = useState("48");
  const [weightKg, setWeightKg] = useState("24000");
  const [rateUsd, setRateUsd] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const originCityOptions = useMemo(
    () => CITIES_BY_PROVINCE[originProvince] ?? [],
    [originProvince],
  );
  const destinationCityOptions = useMemo(
    () => CITIES_BY_PROVINCE[destinationProvince] ?? [],
    [destinationProvince],
  );

  return (
    <form
      className="grid gap-4 md:grid-cols-12"
      onSubmit={async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
          const res = await fetch("/api/loads", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
              status,
              originProvince,
              originCity,
              destinationProvince,
              destinationCity,
              equipment,
              lengthFt,
              weightKg,
              rateUsd: rateUsd || undefined,
              companyName: companyName || undefined,
              contactName: contactName || undefined,
              contactPhone: contactPhone || undefined,
              notes: notes || undefined,
            }),
          });

          if (!res.ok) {
            const data = (await res.json().catch(() => null)) as
              | { error?: { message?: string } }
              | null;
            setError(data?.error?.message ?? "Impossible de publier");
            return;
          }

          router.push("/loadboard");
        } finally {
          setLoading(false);
        }
      }}
    >
      <div className="md:col-span-3">
        <label className="mb-1 block text-sm font-semibold text-slate-700">
          Statut
        </label>
        <select
          className="toleka-select"
          value={status}
          onChange={(e) => setStatus(e.target.value as "POSTED" | "DRAFT")}
        >
          <option value="POSTED">POSTED (public)</option>
          <option value="DRAFT">DRAFT (privé)</option>
        </select>
      </div>

      <div className="md:col-span-3">
        <label className="mb-1 block text-sm font-semibold text-slate-700">
          Equipment
        </label>
        <select
          className="toleka-select"
          value={equipment}
          onChange={(e) => setEquipment(e.target.value as (typeof EQUIPMENT)[number])}
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
            const p = e.target.value as Province;
            setOriginProvince(p);
            setOriginCity((CITIES_BY_PROVINCE[p] ?? [])[0] ?? "");
          }}
        >
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
        <select
          className="toleka-select"
          value={originCity}
          onChange={(e) => setOriginCity(e.target.value)}
        >
          {originCityOptions.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="md:col-span-3">
        <label className="mb-1 block text-sm font-semibold text-slate-700">
          Destination (province)
        </label>
        <select
          className="toleka-select"
          value={destinationProvince}
          onChange={(e) => {
            const p = e.target.value as Province;
            setDestinationProvince(p);
            setDestinationCity((CITIES_BY_PROVINCE[p] ?? [])[0] ?? "");
          }}
        >
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
        <select
          className="toleka-select"
          value={destinationCity}
          onChange={(e) => setDestinationCity(e.target.value)}
        >
          {destinationCityOptions.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="md:col-span-2">
        <label className="mb-1 block text-sm font-semibold text-slate-700">
          Longueur (ft)
        </label>
        <input
          className="toleka-input"
          value={lengthFt}
          onChange={(e) => setLengthFt(e.target.value)}
          inputMode="numeric"
          placeholder="48"
        />
      </div>

      <div className="md:col-span-2">
        <label className="mb-1 block text-sm font-semibold text-slate-700">
          Poids (kg)
        </label>
        <input
          className="toleka-input"
          value={weightKg}
          onChange={(e) => setWeightKg(e.target.value)}
          inputMode="numeric"
          placeholder="24000"
        />
      </div>

      <div className="md:col-span-2">
        <label className="mb-1 block text-sm font-semibold text-slate-700">
          Rate (USD)
        </label>
        <input
          className="toleka-input"
          value={rateUsd}
          onChange={(e) => setRateUsd(e.target.value)}
          inputMode="numeric"
          placeholder="optionnel"
        />
      </div>

      <div className="md:col-span-3">
        <label className="mb-1 block text-sm font-semibold text-slate-700">
          Société
        </label>
        <input
          className="toleka-input"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          placeholder="optionnel"
        />
      </div>

      <div className="md:col-span-3">
        <label className="mb-1 block text-sm font-semibold text-slate-700">
          Contact (nom)
        </label>
        <input
          className="toleka-input"
          value={contactName}
          onChange={(e) => setContactName(e.target.value)}
          placeholder="optionnel"
        />
      </div>

      <div className="md:col-span-3">
        <label className="mb-1 block text-sm font-semibold text-slate-700">
          Contact (téléphone)
        </label>
        <input
          className="toleka-input"
          value={contactPhone}
          onChange={(e) => setContactPhone(e.target.value)}
          placeholder="ex: +243..."
        />
      </div>

      <div className="md:col-span-12">
        <label className="mb-1 block text-sm font-semibold text-slate-700">
          Notes
        </label>
        <textarea
          className="toleka-input min-h-24"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Infos complémentaires (optionnel)"
        />
      </div>

      {error ? (
        <div className="md:col-span-12 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <div className="md:col-span-12 flex flex-wrap gap-2">
        <button className="toleka-btn" type="submit" disabled={loading}>
          {loading ? "Publication…" : "Publier"}
        </button>
        <button
          className="toleka-btn-secondary"
          type="button"
          onClick={() => router.push("/dashboard")}
        >
          Annuler
        </button>
      </div>
    </form>
  );
}

