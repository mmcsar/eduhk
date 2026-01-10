import { type Load } from "@/lib/types";

function moneyUsd(v?: number) {
  if (!v) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(v);
}

export function LoadCard({ load }: { load: Load }) {
  return (
    <div className="toleka-card p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="text-sm font-bold text-slate-900">
            {load.originCity}, {load.originProvince} → {load.destinationCity},{" "}
            {load.destinationProvince}
          </div>
          <div className="mt-1 text-xs text-slate-500">
            {load.equipment} • {load.lengthFt} ft • {load.weightKg.toLocaleString()}{" "}
            kg • Pickup: {load.pickupWindow}
          </div>
        </div>

        <div className="flex shrink-0 items-center justify-between gap-4 sm:flex-col sm:items-end">
          <div className="text-sm font-extrabold text-slate-900">
            {moneyUsd(load.rateUsd)}
          </div>
          <div className="text-xs text-slate-500">{load.postedHoursAgo}h ago</div>
        </div>
      </div>

      <div className="mt-3 flex flex-col gap-2 text-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="text-slate-700">
          <span className="font-semibold">Marchandise:</span> {load.commodity}
        </div>
        <div className="text-slate-500">{load.company}</div>
      </div>
    </div>
  );
}

