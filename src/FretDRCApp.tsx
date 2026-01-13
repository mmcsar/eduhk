import React, { useMemo, useState, useEffect, useRef } from "react";
import {
  QueryClient,
  QueryClientProvider,
  useInfiniteQuery,
  useQuery,
  useMutation
} from "@tanstack/react-query";
import { z } from "zod";

// FretDRC — Web RDC — Load Board v7.3 (TypeScript-friendly, React Query, Zod, Drawer)
// Fixes: fully closed functions/blocks (saveView, etc.), onLoadMore uses fetchNextPage(), export intact.
// Extras: runtime headers (window.__FRETDRC_HEADERS__), auto-logout on 401, self-tests.

/* ----------------------
   UI primitives
---------------------- */
const themeVars = (dark: boolean) => ({
  bg: dark ? "#0b1021" : "#ffffff",
  text: dark ? "#e6edf3" : "#111827",
  sub: dark ? "#9fb1c1" : "#6b7280",
  card: dark ? "#0f162f" : "#f3f4f6",
  panel: dark ? "#111a39" : "#ffffff",
  border: dark ? "#1f2a52" : "#e5e7eb",
  brand: "#2563eb",
  brandAlt: "#10b981"
});

const Container: React.FC<{ children: React.ReactNode; dark: boolean }> = ({
  children,
  dark
}) => {
  const v = themeVars(dark);
  return (
    <div style={{ minHeight: "100vh", background: v.bg, color: v.text }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: 16 }}>
        {children}
      </div>
    </div>
  );
};

const Panel: React.FC<{
  children: React.ReactNode;
  dark?: boolean;
  style?: React.CSSProperties;
}> = ({ children, dark, style }) => {
  const v = themeVars(!!dark);
  return (
    <div
      style={{
        background: v.panel,
        border: `1px solid ${v.border}`,
        borderRadius: 12,
        padding: 12,
        ...style
      }}
    >
      {children}
    </div>
  );
};

const Row: React.FC<{
  children: React.ReactNode;
  gap?: number;
  wrap?: boolean;
  style?: React.CSSProperties;
}> = ({ children, gap = 8, wrap, style }) => (
  <div
    style={{
      display: "flex",
      gap,
      flexWrap: wrap ? "wrap" : "nowrap",
      alignItems: "center",
      ...style
    }}
  >
    {children}
  </div>
);

const Input: React.FC<{
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  style?: React.CSSProperties;
  inputRef?: React.RefObject<HTMLInputElement>;
}> = ({ value, onChange, placeholder, type = "text", style, inputRef }) => (
  <input
    ref={inputRef}
    value={value}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    type={type}
    style={{
      padding: "8px 10px",
      border: "1px solid #e5e7eb",
      borderRadius: 10,
      outline: "none",
      flex: 1,
      minWidth: 120,
      ...style
    }}
  />
);

const Select: React.FC<{
  value: string;
  onChange: (v: string) => void;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ value, onChange, children, style }) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    style={{
      padding: "8px 10px",
      border: "1px solid #e5e7eb",
      borderRadius: 10,
      minWidth: 120,
      ...style
    }}
  >
    {children}
  </select>
);

const Button: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  kind?: "primary" | "success" | "ghost";
  disabled?: boolean;
  style?: React.CSSProperties;
}> = ({ children, onClick, kind = "primary", disabled, style }) => {
  const styles: Record<string, React.CSSProperties> = {
    primary: { background: "#2563eb", color: "white" },
    success: { background: "#10b981", color: "white" },
    ghost: {
      background: "transparent",
      color: "inherit",
      border: "1px solid #e5e7eb"
    }
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: "8px 12px",
        borderRadius: 10,
        border: kind === "ghost" ? "1px solid #e5e7eb" : "none",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.6 : 1,
        ...styles[kind],
        ...style
      }}
    >
      {children}
    </button>
  );
};

const Chip: React.FC<{ children: React.ReactNode; onClear?: () => void }> = ({
  children,
  onClear
}) => (
  <span
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      padding: "4px 10px",
      borderRadius: 999,
      border: "1px solid #e5e7eb",
      background: "#f9fafb",
      fontSize: 12
    }}
  >
    {children}
    {onClear && (
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          onClear();
        }}
        style={{ textDecoration: "none", color: "#6b7280" }}
      >
        ✕
      </a>
    )}
  </span>
);

const Badge: React.FC<{
  children: React.ReactNode;
  kind?: "info" | "ok" | "warn" | "danger";
}> = ({ children, kind = "info" }) => {
  const colors = {
    info: "#eef2ff",
    ok: "#ecfdf5",
    warn: "#fff7ed",
    danger: "#fef2f2"
  } as const;
  const text = {
    info: "#3730a3",
    ok: "#065f46",
    warn: "#9a3412",
    danger: "#991b1b"
  } as const;
  return (
    <span
      style={{
        background: colors[kind],
        color: text[kind],
        padding: "2px 8px",
        borderRadius: 999,
        fontSize: 11
      }}
    >
      {children}
    </span>
  );
};

const Modal: React.FC<{
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}> = ({ open, onClose, title, children }) => {
  if (!open) return null;
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 40
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: 560,
          maxWidth: "95%",
          background: "#fff",
          borderRadius: 12,
          padding: 16
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <Row style={{ marginBottom: 8 }}>
          <strong>{title}</strong>
          <div style={{ flex: 1 }} />
          <Button kind="ghost" onClick={onClose}>
            ✕
          </Button>
        </Row>
        {children}
      </div>
    </div>
  );
};

/* ----------------------
   i18n minimal (FR)
---------------------- */
const t = {
  app: "FretDRC",
  greeting: "Salut coach",
  top: { title: "TABLEAU DES LOADS – RDC" },
  newSearch: "NOUVELLE RECHERCHE",
  filters: {
    origin: "Origine (ville, province)",
    destination: "Destination (ville, province)",
    length: "Longueur",
    weight: "Poids",
    searchBack: "Recherche (heures)",
    corridor: "Couloir",
    minRate: "Tarif min (USD)",
    maxRate: "Tarif max (USD)"
  },
  any: "TOUT",
  search: "RECHERCHER",
  results: "RÉSULTATS",
  table: {
    age: "Âge",
    avail: "Date",
    origin: "Origine",
    destination: "Destination",
    dho: "DH-O",
    company: "Société",
    contact: "Contact",
    length: "Longueur",
    weight: "Poids",
    rate: "Tarif",
    home: "Province",
    fav: "Fav",
    dist: "Km",
    ratekm: "$/km"
  },
  currency: { label: "Devise", usd: "USD", cdf: "CDF", rate: "Taux" },
  actions: {
    call: "Appeler",
    wa: "WhatsApp",
    export: "Exporter CSV",
    dense: "Densité",
    saveView: "Sauver vue",
    loadView: "Charger vue",
    cols: "Colonnes",
    bid: "Soumettre une offre"
  },
  login: {
    title: "Bienvenue sur FretDRC",
    email: "Email",
    pwd: "Mot de passe",
    remember: "Se souvenir de moi",
    signin: "Se connecter",
    forgot: "Mot de passe oublié?",
    help: "Aide & Support"
  },
  tabs: { all: "ALL", pref: "PREFERRED", block: "BLOCKED" },
  summary: { avg: "Moy $/km", dist: "Km total", loads: "Loads" }
};

/* ----------------------
   RDC data & coords (fallback mocks)
---------------------- */
const EQUIPMENTS: [string, string][] = [
  ["ANY", "Tous équipements"],
  ["VR", "Fourgon (Van)"],
  ["R", "Frigorifique (Reefer)"],
  ["F", "Plateau (Flatbed)"],
  ["C", "Conteneur"],
  ["T", "Citerne (Tanker)"]
];
const RDC_CITIES = [
  "Kinshasa",
  "Lubumbashi",
  "Goma",
  "Bukavu",
  "Kisangani",
  "Matadi",
  "Mbuji-Mayi",
  "Kolwezi",
  "Kikwit",
  "Beni"
];
const PROVINCES = [
  "Kinshasa",
  "Haut-Katanga",
  "Nord-Kivu",
  "Sud-Kivu",
  "Tshopo",
  "Kongo-Central",
  "Kasaï-Oriental",
  "Lualaba",
  "Kwilu",
  "Nord-Kivu"
];
const CORRIDORS = [
  "Matadi ↔ Kinshasa",
  "Kasumbalesa ↔ Lubumbashi",
  "Goma ↔ Bukavu",
  "Beni ↔ Goma",
  "Ilebo ↔ Kananga"
];
const COORDS: Record<string, [number, number]> = {
  Kinshasa: [-4.325, 15.322],
  Lubumbashi: [-11.66, 27.479],
  Goma: [-1.674, 29.228],
  Bukavu: [-2.515, 28.858],
  Kisangani: [0.515, 25.19],
  Matadi: [-5.816, 13.45],
  "Mbuji-Mayi": [-6.121, 23.593],
  Kolwezi: [-10.716, 25.472],
  Kikwit: [-5.04, 18.82],
  Beni: [0.492, 29.472]
};
const COMPANIES = [
  "TransKivu SARL",
  "Katanga Logistics",
  "Matadi Express",
  "Grand Congo Freight",
  "Virunga Lines",
  "Esprit Cargo",
  "Okapi Movers",
  "Congo Fleet"
];
const PHONES = [
  "+243812345678",
  "+243972223344",
  "+243990001111",
  "+243858585858",
  "+243700112233",
  "+243818181181"
];
const MOCK = Array.from({ length: 120 }).map((_, i) => ({
  id: String(i + 1).padStart(4, "0"),
  age: `${String(i % 60).padStart(2, "0")}:${String((i * 3) % 60).padStart(
    2,
    "0"
  )}`,
  avail: new Date(Date.now() + (i % 3) * 86400000)
    .toISOString()
    .slice(0, 10),
  origin: RDC_CITIES[i % RDC_CITIES.length],
  destination: RDC_CITIES[(i * 3) % RDC_CITIES.length],
  dho: (i * 5) % 180,
  company: COMPANIES[i % COMPANIES.length],
  contact: PHONES[i % PHONES.length],
  length: 40 + (i % 2 ? 13 : 0),
  weight: 20000 + (i % 1000),
  rateUSD: 900 + (i % 50) * 10,
  province: PROVINCES[i % PROVINCES.length],
  equip: EQUIPMENTS[(i % (EQUIPMENTS.length - 1)) + 1][0],
  preferred: i % 7 === 0,
  blocked: i % 29 === 0
}));

/* ----------------------
   Helpers
---------------------- */
const useLocalStorage = <T,>(
  key: string,
  initial: T
): [T, React.Dispatch<React.SetStateAction<T>>] => {
  const [v, setV] = useState<T>(() => {
    try {
      const s = localStorage.getItem(key);
      return s ? (JSON.parse(s) as T) : initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(v));
    } catch {
      // ignore
    }
  }, [key, v]);
  return [v, setV];
};
const telLink = (raw: string) => `tel:${raw.replace(/\s|-/g, "")}`;
const waLink = (raw: string) => `https://wa.me/${raw.replace(/\D/g, "")}`;
function downloadCSV(filename: string, rows: any[]) {
  const escape = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const header = Object.keys(rows[0] || {}).map(escape).join(",");
  const body = rows
    .map((r) => Object.values(r).map(escape).join(","))
    .join("\n");
  const csv = header + "\n" + body;
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
const toRad = (d: number) => (d * Math.PI) / 180;
function haversineKm(a?: [number, number], b?: [number, number]) {
  if (!a || !b) return undefined;
  const [lat1, lon1] = a;
  const [lat2, lon2] = b;
  const R = 6371;
  const dLat = toRad(lat2 - lat1),
    dLon = toRad(lon2 - lon1);
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) ** 2;
  return Math.round(2 * R * Math.asin(Math.sqrt(s)));
}
function encodeQP(obj: Record<string, unknown>) {
  const p = new URLSearchParams();
  Object.entries(obj).forEach(([k, v]) => {
    if (v != null && v !== "") p.set(k, String(v));
  });
  return p.toString();
}
function parseQP() {
  const p = new URLSearchParams(window.location.search);
  const o: Record<string, string> = {};
  p.forEach((v, k) => (o[k] = v));
  return o;
}

/* ----------------------
   API schemas (Zod)
---------------------- */
const LoadItemSchema = z
  .object({
    id: z.string(),
    pickupDate: z.string().optional(),
    avail: z.string().optional(),
    origin: z.any(),
    destination: z.any(),
    company: z.string().optional(),
    contact: z.string().optional(),
    equipment: z.string().optional(),
    length: z.number().optional(),
    weight: z.number().optional(),
    linehaul: z.number().optional(),
    province: z.string().optional(),
    dho: z.number().optional(),
    distance_km: z.number().optional(),
    rate_per_km: z.number().optional(),
    preferred: z.boolean().optional(),
    blocked: z.boolean().optional()
  })
  .passthrough();

const LoadsResponseSchema = z
  .object({
    items: z.array(LoadItemSchema),
    nextCursor: z.string().optional()
  })
  .or(z.array(LoadItemSchema));

const LoadDetailSchema = z
  .object({
    id: z.string(),
    pickupDate: z.string().optional(),
    deliveryDate: z.string().optional(),
    origin: z.any(),
    destination: z.any(),
    equipment: z.string().optional(),
    length: z.number().optional(),
    weight: z.number().optional(),
    linehaul: z.number().optional(),
    company: z.string().optional(),
    contact: z.string().optional(),
    notes: z.string().optional(),
    distance_km: z.number().optional(),
    rate_per_km: z.number().optional()
  })
  .passthrough();

/* ----------------------
   API client
---------------------- */
function extraHeaders() {
  try {
    return (window as any).__FRETDRC_HEADERS__ || {};
  } catch {
    return {};
  }
}

function handle401(status: number) {
  if (status === 401) {
    try {
      sessionStorage.removeItem("fretdrc.token");
      localStorage.removeItem("fretdrc.token");
    } catch {
      // ignore
    }
    try {
      window.dispatchEvent(new CustomEvent("fretdrc:unauthorized"));
    } catch {
      // ignore
    }
  }
}

async function httpGetJSON(
  url: string,
  headers: Record<string, string> = {},
  signal?: AbortSignal,
  retries = 2
) {
  try {
    const res = await fetch(url, {
      headers: { Accept: "application/json", ...headers, ...extraHeaders() },
      signal
    });
    if (!res.ok) {
      handle401(res.status);
      const text = await res.text().catch(() => "");
      throw new Error(
        `${res.status} ${res.statusText} — ${text?.slice(0, 200)}`
      );
    }
    return res.json();
  } catch (e: any) {
    if (retries > 0 && e?.name !== "AbortError") {
      await new Promise((r) => setTimeout(r, (3 - retries) * 400));
      return httpGetJSON(url, headers, signal, retries - 1);
    }
    throw e;
  }
}

async function httpPostJSON(
  url: string,
  body: any,
  headers: Record<string, string> = {},
  signal?: AbortSignal
) {
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...headers,
      ...extraHeaders()
    },
    body: JSON.stringify(body),
    signal
  });
  if (!res.ok) {
    handle401(res.status);
    const text = await res.text().catch(() => "");
    throw new Error(`${res.status} ${res.statusText} — ${text?.slice(0, 200)}`);
  }
  return res.json();
}

function buildQuery(state: any, cursor?: string) {
  const p = new URLSearchParams();
  if (state.origin) p.set("origin", state.origin);
  if (state.destination) p.set("destination", state.destination);
  if (state.equipment && state.equipment !== "ANY") p.set("equipment", state.equipment);
  if (state.length) p.set("lengthMin", state.length);
  if (state.weight) p.set("weightMin", state.weight);
  if (state.searchBack) p.set("searchBack", state.searchBack);
  if (state.minRate) p.set("minRate", state.minRate);
  if (state.maxRate) p.set("maxRate", state.maxRate);
  if (state.tab === "PREF") p.set("preferred", "true");
  if (state.tab === "BLOCK") p.set("blocked", "true");
  if (cursor) p.set("cursor", cursor);
  p.set("limit", "50");
  return p.toString();
}

function adaptServerItem(x: any) {
  const safeId = String(x.id ?? x.loadId ?? (globalThis.crypto?.randomUUID?.() ?? `${Date.now()}`));
  return {
    id: safeId,
    age: x.age ?? "--",
    avail:
      x.avail ?? x.pickupDate?.slice(0, 10) ?? new Date().toISOString().slice(0, 10),
    origin:
      typeof x.origin === "object"
        ? x.origin?.city || ""
        : x.origin ?? x.o?.city ?? x.from,
    destination:
      typeof x.destination === "object"
        ? x.destination?.city || ""
        : x.destination ?? x.d?.city ?? x.to,
    dho: x.dho ?? 0,
    company: x.company ?? x.carrier ?? "—",
    contact: x.contact ?? x.phone ?? "—",
    length: x.length ?? x.trailer_length ?? 53,
    weight: x.weight ?? x.weight_lbs ?? 0,
    rateUSD: x.rateUSD ?? x.linehaul ?? x.price ?? 0,
    province: x.province ?? "—",
    equip: x.equipment ?? x.eqp ?? "VR",
    preferred: !!x.preferred,
    blocked: !!x.blocked,
    distKm: x.distance_km,
    rateKm: x.rate_per_km
  };
}

/* ----------------------
   Components
---------------------- */
function TopBar({ dark, setDark, dense, setDense, onLogout, token }: {
  dark: boolean;
  setDark: (v: boolean) => void;
  dense: boolean;
  setDense: (v: boolean) => void;
  onLogout: () => void;
  token: string;
}) {
  return (
    <Row gap={10} wrap style={{ marginBottom: 12 }}>
      <strong>{t.app}</strong>
      <span style={{ opacity: 0.85 }}>{t.greeting}</span>
      <span style={{ opacity: 0.7 }}>{t.top.title}</span>
      <div style={{ flex: 1 }} />
      <Button kind="ghost" onClick={() => setDense(!dense)}>
        {dense ? "↕︎ " : "↕︎ "} {t.actions.dense}: {dense ? "ON" : "OFF"}
      </Button>
      <Button kind="ghost" onClick={() => setDark(!dark)}>
        {dark ? "☾" : "☀"} {dark ? "Dark" : "Light"}
      </Button>
      {token && (
        <Button kind="ghost" onClick={onLogout}>
          Déconnexion
        </Button>
      )}
      <span style={{ opacity: 0.7 }}>RDC · +243</span>
    </Row>
  );
}

function ColumnPicker({
  visible,
  setVisible,
  onClose
}: {
  visible: Record<string, boolean>;
  setVisible: (u: any) => void;
  onClose: () => void;
}) {
  const keys = Object.keys(visible);
  return (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
      {keys.map((k) => (
        <label key={k} style={{ fontSize: 13 }}>
          <input
            type="checkbox"
            checked={!!visible[k]}
            onChange={(e) =>
              setVisible((v: any) => ({
                ...v,
                [k]: (e.target as HTMLInputElement).checked
              }))
            }
          />{" "}
          {k}
        </label>
      ))}
      <Button kind="ghost" onClick={onClose}>
        OK
      </Button>
    </div>
  );
}

function ApiBar({
  baseUrl,
  setBaseUrl,
  useServerMetrics,
  setUseServerMetrics,
  onPing,
  apiOk,
  token,
  setToken
}: {
  baseUrl: string;
  setBaseUrl: (v: string) => void;
  useServerMetrics: boolean;
  setUseServerMetrics: (v: boolean) => void;
  onPing: () => void;
  apiOk: boolean;
  token: string;
  setToken: (v: string) => void;
}) {
  return (
    <Row gap={8} wrap>
      <Input
        value={baseUrl}
        onChange={setBaseUrl}
        placeholder="API base URL (ex: https://api.fretdrc.com)"
        style={{ minWidth: 360 }}
      />
      <label style={{ fontSize: 13 }}>
        <input
          type="checkbox"
          checked={useServerMetrics}
          onChange={(e) =>
            setUseServerMetrics((e.target as HTMLInputElement).checked)
          }
        />{" "}
        calcul dist/prix serveur
      </label>
      <Input
        value={token}
        onChange={setToken}
        placeholder="Bearer token (optionnel)"
        style={{ minWidth: 240 }}
      />
      <Button kind="ghost" onClick={onPing}>
        {apiOk ? "✅ API" : "🔌 Tester API"}
      </Button>
    </Row>
  );
}

function LoginScreen({
  baseUrl,
  onSuccess
}: {
  baseUrl: string;
  onSuccess: ({ token, remember }: { token: string; remember: boolean }) => void;
}) {
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const login = async () => {
    try {
      setLoading(true);
      setError("");
      if (!baseUrl) {
        onSuccess({ token: "demo-token", remember });
        return;
      }
      const res = await httpPostJSON(`${baseUrl.replace(/\/$/, "")}/auth/login`, {
        email,
        password: pwd
      });
      const tok = res.token || res.access_token || res.jwt || "token";
      onSuccess({ token: tok, remember });
    } catch (e: any) {
      setError(e.message || String(e));
    } finally {
      setLoading(false);
    }
  };
  return (
    <Panel style={{ maxWidth: 420, margin: "40px auto" }}>
      <h3 style={{ marginTop: 0 }}>{t.login.title}</h3>
      <div style={{ display: "grid", gap: 8 }}>
        <Input value={email} onChange={setEmail} placeholder={t.login.email} />
        <Input
          value={pwd}
          onChange={setPwd}
          placeholder={t.login.pwd}
          type="password"
        />
        <label style={{ fontSize: 13 }}>
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) =>
              setRemember((e.target as HTMLInputElement).checked)
            }
          />{" "}
          {t.login.remember}
        </label>
        <Button onClick={login} disabled={loading}>
          {loading ? "..." : t.login.signin}
        </Button>
        {error && (
          <div
            style={{
              background: "#fee2e2",
              color: "#7f1d1d",
              padding: 8,
              borderRadius: 8
            }}
          >
            {error}
          </div>
        )}
        <Row gap={8}>
          <a href="#">{t.login.forgot}</a>
          <div style={{ flex: 1 }} />
          <a href="#">{t.login.help}</a>
        </Row>
      </div>
    </Panel>
  );
}

function Tabs({ tab, setTab }: { tab: string; setTab: (v: string) => void }) {
  const is = (k: string) => tab === k;
  const Btn: React.FC<{ k: string; label: string }> = ({ k, label }) => (
    <Button kind="ghost" onClick={() => setTab(k)}>
      {is(k) ? `● ${label}` : label}
    </Button>
  );
  return (
    <Row gap={6} wrap>
      <Btn k="ALL" label={t.tabs.all} />
      <Btn k="PREF" label={t.tabs.pref} />
      <Btn k="BLOCK" label={t.tabs.block} />
    </Row>
  );
}

function SummaryBar({ items }: { items: any[] }) {
  const totalKm = useMemo(
    () => items.reduce((s, x) => s + (Number(x.distKm) || 0), 0),
    [items]
  );
  const avgRpk = useMemo(() => {
    const pairs = items.filter((x) => x.distKm > 0 && x.rateUSD > 0);
    if (!pairs.length) return 0;
    const r =
      pairs.reduce((s: number, x: any) => s + x.rateUSD / x.distKm, 0) /
      pairs.length;
    return Math.round(r * 100) / 100;
  }, [items]);
  return (
    <Row gap={8}>
      <Badge kind="ok">
        {t.summary.loads}: {items.length}
      </Badge>
      <Badge kind="info">
        {t.summary.dist}: {totalKm}
      </Badge>
      <Badge kind="warn">
        {t.summary.avg}: {avgRpk}
      </Badge>
    </Row>
  );
}

function FiltersBar({
  onSearch,
  state,
  setState,
  dark,
  currency,
  setCurrency,
  rate,
  setRate,
  views,
  saveView,
  loadView,
  visibleCols,
  setVisibleCols,
  baseUrl,
  setBaseUrl,
  useServerMetrics,
  setUseServerMetrics,
  onPing,
  apiOk,
  token,
  setToken
}: {
  onSearch: () => void;
  state: any;
  setState: (u: any) => void;
  dark: boolean;
  currency: string;
  setCurrency: (v: string) => void;
  rate: string;
  setRate: (v: string) => void;
  views: any[];
  saveView: () => void;
  loadView: (id: string) => void;
  visibleCols: Record<string, boolean>;
  setVisibleCols: (u: any) => void;
  baseUrl: string;
  setBaseUrl: (v: string) => void;
  useServerMetrics: boolean;
  setUseServerMetrics: (v: boolean) => void;
  onPing: () => void;
  apiOk: boolean;
  token: string;
  setToken: (v: string) => void;
}) {
  const originRef = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "/") {
        e.preventDefault?.();
        originRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey as any);
    return () => window.removeEventListener("keydown", onKey as any);
  }, []);

  return (
    <Panel dark={dark}>
      <Row gap={8} wrap>
        <Button kind="ghost">{t.newSearch}</Button>
        <Tabs tab={state.tab} setTab={(k) => setState((s: any) => ({ ...s, tab: k }))} />
        <div style={{ flex: 1 }} />
        <Row gap={6} wrap>
          <label style={{ fontSize: 12, opacity: 0.7 }}>{t.currency.label}</label>
          <Select value={currency} onChange={setCurrency}>
            <option value="USD">{t.currency.usd}</option>
            <option value="CDF">{t.currency.cdf}</option>
          </Select>
          <label style={{ fontSize: 12, opacity: 0.7 }}>{t.currency.rate}</label>
          <Input value={rate} onChange={setRate} style={{ width: 90 }} />
          <Button kind="ghost" onClick={saveView}>
            💾 {t.actions.saveView}
          </Button>
          <Select value="" onChange={(v) => loadView(v)}>
            <option value="">— {t.actions.loadView} —</option>
            {views.map((v, i) => (
              <option key={i} value={v.id}>
                {v.name}
              </option>
            ))}
          </Select>
          <details style={{ marginLeft: 8 }}>
            <summary>{t.actions.cols}</summary>
            <ColumnPicker visible={visibleCols} setVisible={setVisibleCols} onClose={() => {}} />
          </details>
        </Row>
      </Row>

      <ApiBar
        baseUrl={baseUrl}
        setBaseUrl={setBaseUrl}
        useServerMetrics={useServerMetrics}
        setUseServerMetrics={setUseServerMetrics}
        onPing={onPing}
        apiOk={apiOk}
        token={token}
        setToken={setToken}
      />

      <Row gap={8} wrap style={{ marginTop: 10 }}>
        <Select
          value={state.equipment}
          onChange={(v) => setState((s: any) => ({ ...s, equipment: v }))}
        >
          {EQUIPMENTS.map(([code, label]) => (
            <option key={code} value={code}>
              {label}
            </option>
          ))}
        </Select>
        <Input
          inputRef={originRef as any}
          placeholder={t.filters.origin + "  (raccourci: /)"}
          value={state.origin}
          onChange={(v) => setState((s: any) => ({ ...s, origin: v }))}
          style={{ minWidth: 230 }}
        />
        <Input
          placeholder={t.filters.destination}
          value={state.destination}
          onChange={(v) => setState((s: any) => ({ ...s, destination: v }))}
          style={{ minWidth: 230 }}
        />
        <Select
          value={state.corridor}
          onChange={(v) => setState((s: any) => ({ ...s, corridor: v }))}
        >
          <option value="">— {t.filters.corridor} —</option>
          {CORRIDORS.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </Select>
        <Input
          placeholder={`${t.filters.length} (ft)`}
          value={state.length}
          onChange={(v) => setState((s: any) => ({ ...s, length: v }))}
          style={{ width: 100 }}
        />
        <Input
          placeholder={`${t.filters.weight} (kg)`}
          value={state.weight}
          onChange={(v) => setState((s: any) => ({ ...s, weight: v }))}
          style={{ width: 110 }}
        />
        <Input
          placeholder={t.filters.minRate}
          value={state.minRate || ""}
          onChange={(v) => setState((s: any) => ({ ...s, minRate: v }))}
          style={{ width: 140 }}
        />
        <Input
          placeholder={t.filters.maxRate}
          value={state.maxRate || ""}
          onChange={(v) => setState((s: any) => ({ ...s, maxRate: v }))}
          style={{ width: 140 }}
        />
        <Input
          placeholder={`${t.filters.searchBack}`}
          value={state.searchBack}
          onChange={(v) => setState((s: any) => ({ ...s, searchBack: v }))}
          style={{ width: 130 }}
        />
        <div style={{ flex: 1 }} />
        <Button onClick={onSearch}>🔎 {t.search}</Button>
        <Button
          kind="ghost"
          onClick={() =>
            setState({
              ...state,
              equipment: "ANY",
              origin: "",
              destination: "",
              corridor: "",
              length: "",
              weight: "",
              minRate: "",
              maxRate: "",
              searchBack: ""
            })
          }
        >
          Réinitialiser
        </Button>
      </Row>
      <FiltersSummary
        state={state}
        onClear={(k) => setState((s: any) => ({ ...s, [k]: "" }))}
      />
    </Panel>
  );
}

function FiltersSummary({
  state,
  onClear
}: {
  state: any;
  onClear: (k: string) => void;
}) {
  const chips: [string, string | undefined][] = [];
  if (state.equipment && state.equipment !== "ANY")
    chips.push([
      "equipment",
      EQUIPMENTS.find(([c]) => c === state.equipment)?.[1]
    ]);
  if (state.origin) chips.push(["origin", state.origin]);
  if (state.destination) chips.push(["destination", state.destination]);
  if (state.corridor) chips.push(["corridor", state.corridor]);
  if (state.length) chips.push(["length", `${state.length} ft`]);
  if (state.weight) chips.push(["weight", `${state.weight} kg`]);
  if (state.minRate) chips.push(["minRate", `$${state.minRate}`]);
  if (state.maxRate) chips.push(["maxRate", `$${state.maxRate}`]);
  if (state.searchBack) chips.push(["searchBack", `${state.searchBack} h`]);
  if (state.tab && state.tab !== "ALL") chips.push(["tab", state.tab]);
  if (chips.length === 0) return null;
  return (
    <Row gap={6} wrap style={{ marginTop: 10 }}>
      {chips.map(([k, label]) => (
        <Chip key={k} onClear={() => onClear(k)}>
          {label}
        </Chip>
      ))}
    </Row>
  );
}

/* ----------------------
   React Query hooks
---------------------- */
function useLoadsQuery({
  baseUrl,
  token,
  state
}: {
  baseUrl: string;
  token: string;
  state: any;
}) {
  const headers: Record<string, string> = { "X-Client": "FretDRC" };
  if (token) headers.Authorization = `Bearer ${token}`;

  const fetchPage = async ({ pageParam }: { pageParam?: string }) => {
    // mock when no baseUrl
    if (!baseUrl) {
      const filtered = MOCK.filter(
        (r) =>
          (!state.equipment || state.equipment === "ANY" || r.equip === state.equipment) &&
          (!state.origin ||
            r.origin.toLowerCase().includes(state.origin.toLowerCase())) &&
          (!state.destination ||
            r.destination
              .toLowerCase()
              .includes(state.destination.toLowerCase())) &&
          (!state.corridor ||
            `${r.origin} ↔ ${r.destination}`.includes(state.corridor)) &&
          (!state.length || r.length >= Number(state.length)) &&
          (!state.weight || r.weight >= Number(state.weight)) &&
          (!state.minRate || r.rateUSD >= Number(state.minRate)) &&
          (!state.maxRate || r.rateUSD <= Number(state.maxRate)) &&
          (state.tab === "ALL" ||
            (state.tab === "PREF" && r.preferred) ||
            (state.tab === "BLOCK" && r.blocked))
      );
      const start = Number(pageParam || 0);
      const page = filtered.slice(start, start + 50).map((x) => ({ ...x }));
      const items = page.map((p) => ({ ...p, distance_km: undefined, rate_per_km: undefined }));
      const result = {
        items,
        nextCursor: start + 50 < filtered.length ? String(start + 50) : undefined
      };
      return result;
    }
    const q = buildQuery(state, pageParam);
    const url = `${baseUrl.replace(/\/$/, "")}/loads?${q}`;
    const controller = new AbortController();
    const json = await httpGetJSON(url, headers, controller.signal);
    const parsed = LoadsResponseSchema.safeParse(json);
    if (!parsed.success) throw new Error("Invalid server payload");
    if (Array.isArray(parsed.data)) return { items: parsed.data, nextCursor: undefined };
    return parsed.data as { items: any[]; nextCursor?: string };
  };

  return useInfiniteQuery({
    queryKey: ["loads", baseUrl, token, state],
    queryFn: fetchPage,
    getNextPageParam: (last) => (last as any).nextCursor,
    retry: 2,
    staleTime: 15_000,
    refetchOnWindowFocus: false,
    initialPageParam: undefined as string | undefined
  });
}

function useLoadDetail({
  baseUrl,
  token,
  id
}: {
  baseUrl: string;
  token: string;
  id: string | undefined;
}) {
  const headers: Record<string, string> = { "X-Client": "FretDRC" };
  if (token) headers.Authorization = `Bearer ${token}`;
  return useQuery({
    queryKey: ["load", baseUrl, id],
    queryFn: async () => {
      if (!id) throw new Error("missing id");
      if (!baseUrl) {
        const m = MOCK.find((x) => x.id === id);
        const detail = m
          ? {
              id,
              pickupDate: new Date().toISOString(),
              origin: m.origin,
              destination: m.destination,
              equipment: m.equip,
              length: m.length,
              weight: m.weight,
              linehaul: m.rateUSD,
              company: m.company,
              contact: m.contact
            }
          : { id };
        return detail;
      }
      const url = `${baseUrl.replace(/\/$/, "")}/loads/${id}`;
      const json = await httpGetJSON(url, headers);
      const parsed = LoadDetailSchema.safeParse(json);
      if (!parsed.success) throw new Error("Invalid load detail");
      return parsed.data;
    },
    enabled: !!id,
    staleTime: 30_000
  });
}

function useBidMutation({ baseUrl, token }: { baseUrl: string; token: string }) {
  const headers: Record<string, string> = { "X-Client": "FretDRC" };
  if (token) headers.Authorization = `Bearer ${token}`;
  return useMutation({
    mutationFn: async ({
      id,
      amountUSD,
      message,
      validUntil
    }: {
      id: string;
      amountUSD: number;
      message?: string;
      validUntil?: string;
    }) => {
      if (!baseUrl) return { offerId: "demo", status: "submitted" };
      const url = `${baseUrl.replace(/\/$/, "")}/loads/${id}/offers`;
      return httpPostJSON(url, { amountUSD, message, validUntil }, headers);
    }
  });
}

/* ----------------------
   Results Table + Drawer
---------------------- */
function Results({
  data,
  dark,
  sort,
  setSort,
  dense,
  toggleFav,
  favs,
  currency,
  rate,
  visibleCols,
  loading,
  error,
  onLoadMore,
  hasMore,
  onOpen
}: {
  data: any[];
  dark: boolean;
  sort: any[];
  setSort: (u: any) => void;
  dense: boolean;
  toggleFav: (id: string) => void;
  favs: Set<string>;
  currency: string;
  rate: string;
  visibleCols: Record<string, boolean>;
  loading: boolean;
  error: string;
  onLoadMore: () => void;
  hasMore: boolean;
  onOpen: (id: string) => void;
}) {
  const v = themeVars(dark);
  const fx = Number(rate || 0);
  const toAmount = (usd: any) => {
    const n = Number(usd || 0);
    return currency === "USD" ? `$${n}` : `${Math.round(n * fx)} CDF`;
  };
  const onSort = (key: string, shift: boolean) => {
    setSort((s: any[]) => {
      const exists = s.find((x) => x.key === key);
      if (!shift)
        return [{ key, dir: exists ? (exists.dir === "asc" ? "desc" : "asc") : "asc" }];
      if (!exists) return [...s, { key, dir: "asc" }];
      return s.map((x: any) =>
        x.key === key ? { ...x, dir: x.dir === "asc" ? "desc" : "asc" } : x
      );
    });
  };
  const sorted = useMemo(() => {
    if (!sort.length) return data;
    const arr = [...data];
    arr.sort((a, b) => {
      for (const { key, dir } of sort) {
        const va = (a as any)[key];
        const vb = (b as any)[key];
        if (va == null && vb == null) continue;
        if (va == null) return 1;
        if (vb == null) return -1;
        const cmp =
          typeof va === "number" && typeof vb === "number"
            ? va - vb
            : String(va).localeCompare(String(vb));
        if (cmp !== 0) return dir === "asc" ? cmp : -cmp;
      }
      return 0;
    });
    return arr;
  }, [data, sort]);
  const Th: React.FC<{ k: string; children: React.ReactNode }> = ({ k, children }) => (
    <th
      onClick={(e) => onSort(k, (e as any).shiftKey)}
      title={"Trier" + (sort.length ? " (Shift=multi)" : "")}
      style={{
        textAlign: "left",
        padding: dense ? "6px 6px" : "10px 8px",
        background: "#f3f4f6",
        position: "sticky",
        top: 0,
        cursor: "pointer",
        whiteSpace: "nowrap"
      }}
    >
      {children}
      {sort.findIndex((x) => x.key === k) !== -1 && (
        <>
          {" "}
          &nbsp;
          {sort.find((x: any) => x.key === k)?.dir === "asc" ? "▲" : "▼"}
          <sup>{sort.findIndex((x: any) => x.key === k) + 1}</sup>
        </>
      )}
    </th>
  );
  const Td: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <td style={{ padding: dense ? "6px 6px" : "10px 8px", whiteSpace: "nowrap" }}>
      {children}
    </td>
  );

  const COLS = [
    { key: "id", label: "#" },
    { key: "age", label: t.table.age },
    { key: "avail", label: t.table.avail },
    { key: "origin", label: t.table.origin },
    { key: "destination", label: t.table.destination },
    { key: "dho", label: t.table.dho },
    { key: "company", label: t.table.company },
    { key: "contact", label: t.table.contact },
    { key: "length", label: t.table.length },
    { key: "weight", label: t.table.weight },
    { key: "rateUSD", label: t.table.rate },
    { key: "province", label: t.table.home },
    { key: "distKm", label: t.table.dist },
    { key: "rateKm", label: t.table.ratekm },
    { key: "fav", label: t.table.fav }
  ];
  const visibleList = COLS.filter((c) => visibleCols[c.key] !== false);

  const ioRef = useRef<IntersectionObserver | null>(null);
  useEffect(() => {
    const s = document.getElementById("end-sentinel");
    if (!s) return;
    ioRef.current?.disconnect?.();
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) onLoadMore?.();
      },
      { root: null, rootMargin: "400px" }
    );
    io.observe(s);
    ioRef.current = io;
    return () => io.disconnect();
  }, [onLoadMore, visibleCols]);

  return (
    <Panel dark={dark} style={{ marginTop: 12 }}>
      <Row gap={8}>
        <Badge kind="ok">
          {sorted.length} {t.results}
        </Badge>
        <div style={{ flex: 1 }} />
        {loading && <span style={{ fontSize: 12, opacity: 0.7 }}>Chargement…</span>}
        {error && (
          <span
            style={{
              background: "#fee2e2",
              color: "#7f1d1d",
              padding: "4px 8px",
              borderRadius: 8
            }}
          >
            Erreur: {String(error)}
          </span>
        )}
        <Button kind="ghost" onClick={() => downloadCSV("fretdrc-loads.csv", sorted)}>
          ⬇ {t.actions.export}
        </Button>
      </Row>
      <div style={{ marginTop: 8 }}>
        <SummaryBar items={sorted} />
      </div>
      <div style={{ overflow: "auto", marginTop: 10 }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: dense ? 12 : 13 }}>
          <thead>
            <tr>
              {visibleList.map((c) => (
                <Th key={c.key} k={c.key}>
                  {c.label}
                </Th>
              ))}
              <th style={{ width: 220 }} />
            </tr>
          </thead>
          <tbody>
            {!sorted.length && !loading && !error && (
              <tr>
                <td colSpan={visibleList.length + 1}>
                  <div style={{ padding: 24, textAlign: "center" }}>
                    <div style={{ fontWeight: 700, marginBottom: 8 }}>Aucun résultat</div>
                    <div>Essayez d&apos;élargir vos filtres.</div>
                  </div>
                </td>
              </tr>
            )}
            {loading &&
              !sorted.length &&
              Array.from({ length: 8 }).map((_, i) => (
                <tr key={i}>
                  <td colSpan={visibleList.length + 1}>
                    <div style={{ height: 36, background: "#f3f4f6", margin: "6px 0", borderRadius: 8 }} />
                  </td>
                </tr>
              ))}
            {sorted.map((r: any, idx: number) => (
              <tr
                key={r.id}
                style={{
                  borderTop: `1px solid ${v.border}`,
                  background: idx % 2 ? (dark ? "#0e1430" : "#fafafa") : "transparent"
                }}
              >
                {visibleList.map((c) => (
                  <Td key={c.key}>
                    {c.key === "rateUSD" ? (
                      toAmount(r.rateUSD)
                    ) : c.key === "fav" ? (
                      <button
                        onClick={() => toggleFav(r.id)}
                        title="Favori"
                        style={{
                          border: "none",
                          background: "transparent",
                          cursor: "pointer"
                        }}
                      >
                        {favs.has(r.id) ? "★" : "☆"}
                      </button>
                    ) : (
                      (r as any)[c.key] ?? ""
                    )}
                  </Td>
                ))}
                <Td>
                  <Row gap={6}>
                    <Button kind="ghost" onClick={() => onOpen(r.id)}>
                      🔍 Détail
                    </Button>
                    <a href={telLink(r.contact)}>
                      <Button kind="ghost">📞 {t.actions.call}</Button>
                    </a>
                    <a href={waLink(r.contact)} target="_blank" rel="noreferrer">
                      <Button kind="success">🟢 {t.actions.wa}</Button>
                    </a>
                  </Row>
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {hasMore && (
        <div style={{ textAlign: "center", marginTop: 10 }}>
          <Button onClick={onLoadMore} disabled={loading}>
            Charger plus
          </Button>
        </div>
      )}
      <div id="end-sentinel" style={{ height: 1 }} />
    </Panel>
  );
}

function LoadDrawer({
  id,
  baseUrl,
  token,
  onClose
}: {
  id: string | undefined;
  baseUrl: string;
  token: string;
  onClose: () => void;
}) {
  const { data, isLoading, error } = useLoadDetail({ baseUrl, token, id });
  const bid = useBidMutation({ baseUrl, token });
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");

  return (
    <Modal open={!!id} onClose={onClose} title={`Load ${id}`}>
      {isLoading && <div>Chargement…</div>}
      {error && (
        <div style={{ background: "#fee2e2", color: "#7f1d1d", padding: 8, borderRadius: 8 }}>
          {String((error as any)?.message || error)}
        </div>
      )}
      {data && (
        <div style={{ display: "grid", gap: 8 }}>
          <Row gap={8}>
            <Badge kind="info">Origine</Badge>
            <span>{typeof (data as any).origin === "object" ? (data as any).origin?.city : (data as any).origin}</span>
            <div style={{ flex: 1 }} />
            <Badge kind="info">Destination</Badge>
            <span>
              {typeof (data as any).destination === "object"
                ? (data as any).destination?.city
                : (data as any).destination}
            </span>
          </Row>
          <Row gap={8}>
            <Badge kind="ok">Equip.</Badge>
            <span>{(data as any).equipment || "VR"}</span>
            <Badge kind="ok">Long.</Badge>
            <span>{(data as any).length || "-"}</span>
            <Badge kind="ok">Poids</Badge>
            <span>{(data as any).weight || "-"}</span>
          </Row>
          <Row gap={8}>
            <Badge kind="warn">Tarif</Badge>
            <span>{(data as any).linehaul ?? "-"}</span>
            <Badge kind="warn">Km</Badge>
            <span>{(data as any).distance_km ?? "-"}</span>
            <Badge kind="warn">$/km</Badge>
            <span>{(data as any).rate_per_km ?? "-"}</span>
          </Row>
          <Row gap={8}>
            <Badge kind="info">Société</Badge>
            <span>{(data as any).company || "-"}</span>
            <Badge kind="info">Contact</Badge>
            <span>{(data as any).contact || "-"}</span>
          </Row>
          {(data as any).notes && (
            <div style={{ whiteSpace: "pre-wrap", background: "#f9fafb", padding: 8, borderRadius: 8 }}>
              {(data as any).notes}
            </div>
          )}

          <Panel style={{ marginTop: 8 }}>
            <div style={{ fontWeight: 600, marginBottom: 6 }}>{t.actions.bid}</div>
            <Row gap={6} wrap>
              <Input value={amount} onChange={setAmount} placeholder="Montant (USD)" />
              <Input value={message} onChange={setMessage} placeholder="Message (optionnel)" />
              <Button
                onClick={() => bid.mutate({ id: id!, amountUSD: Number(amount || 0), message })}
                disabled={!amount || bid.isPending}
              >
                Envoyer
              </Button>
              {bid.isSuccess && <Badge kind="ok">Offre envoyée</Badge>}
              {bid.isError && <Badge kind="danger">Erreur</Badge>}
            </Row>
          </Panel>
        </div>
      )}
    </Modal>
  );
}

/* ----------------------
   App
---------------------- */
function runSelfTestsOnce() {
  if (!(import.meta as any).env?.DEV) return;
  try {
    const km = haversineKm(COORDS.Kinshasa, COORDS.Matadi);
    if (typeof km !== "number" || km <= 0) throw new Error("haversineKm failed");
    const parsed = LoadsResponseSchema.safeParse({ items: [{ id: "1", origin: "A", destination: "B" }] });
    if (!parsed.success) throw new Error("Zod schema test failed");
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn("[FretDRC self-tests] failed:", e);
  }
}

type ViewSnapshot = {
  id: string;
  name: string;
  createdAt: number;
  state: any;
  currency: string;
  rate: string;
  sort: any[];
  dense: boolean;
  visibleCols: Record<string, boolean>;
  baseUrl: string;
  useServerMetrics: boolean;
};

function AppInner() {
  runSelfTestsOnce();

  const [dark, setDark] = useLocalStorage("fretdrc.dark", false);
  const [state, setState] = useState({
    tab: "ALL",
    equipment: "ANY",
    origin: "",
    destination: "",
    corridor: "",
    length: "",
    weight: "",
    minRate: "",
    maxRate: "",
    searchBack: ""
  });
  const [currency, setCurrency] = useLocalStorage("fretdrc.cur", "USD");
  const [rate, setRate] = useLocalStorage("fretdrc.rate", "2800");
  const [sort, setSort] = useLocalStorage<any[]>("fretdrc.sort", [{ key: "avail", dir: "asc" }]);
  const [dense, setDense] = useLocalStorage("fretdrc.dense", false);
  const [favs, setFavs] = useLocalStorage<string[]>("fretdrc.favs", []);
  const [views, setViews] = useLocalStorage<ViewSnapshot[]>("fretdrc.views", []);
  const [visibleCols, setVisibleCols] = useLocalStorage<Record<string, boolean>>("fretdrc.cols", {
    id: true,
    age: true,
    avail: true,
    origin: true,
    destination: true,
    dho: true,
    company: true,
    contact: true,
    length: true,
    weight: true,
    rateUSD: true,
    province: true,
    distKm: true,
    rateKm: true,
    fav: true
  });
  const [baseUrl, setBaseUrl] = useLocalStorage("fretdrc.api", "");
  const [useServerMetrics, setUseServerMetrics] = useLocalStorage("fretdrc.metricsServer", true);

  // Token with remember
  const [token, setTokenState] = useState(() => {
    try {
      return JSON.parse(
        sessionStorage.getItem("fretdrc.token") ||
          localStorage.getItem("fretdrc.token") ||
          '""'
      ) as string;
    } catch {
      return "";
    }
  });
  const writeToken = (tok: string, remember = true) => {
    try {
      sessionStorage.removeItem("fretdrc.token");
      localStorage.removeItem("fretdrc.token");
    } catch {
      // ignore
    }
    try {
      (remember ? localStorage : sessionStorage).setItem("fretdrc.token", JSON.stringify(tok));
    } catch {
      // ignore
    }
    setTokenState(tok);
  };

  // auto-logout on 401
  useEffect(() => {
    const onUnauth = () => setTokenState("");
    window.addEventListener("fretdrc:unauthorized", onUnauth as any);
    return () => window.removeEventListener("fretdrc:unauthorized", onUnauth as any);
  }, []);

  // URL ⇄ state sync
  useEffect(() => {
    const qp = parseQP();
    const next = { ...state } as any;
    ["tab", "equipment", "origin", "destination", "corridor", "length", "weight", "minRate", "maxRate", "searchBack"].forEach(
      (k) => {
        if ((qp as any)[k] != null) (next as any)[k] = (qp as any)[k];
      }
    );
    setState(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    const qs = encodeQP({ ...state });
    const url = `${window.location.pathname}?${qs}`;
    window.history.replaceState(null, "", url);
  }, [state]);

  const favSet = useMemo(() => new Set(favs), [favs]);

  // API ping
  const [apiOk, setApiOk] = useState(false);
  const onPing = async () => {
    if (!baseUrl) {
      setApiOk(true);
      return;
    }
    const base = baseUrl.replace(/\/$/, "");
    const headers: Record<string, string> = {};
    if (token) headers.Authorization = `Bearer ${token}`;
    try {
      await httpGetJSON(`${base}/health`, headers);
      setApiOk(true);
    } catch {
      try {
        await httpGetJSON(`${base}/ping`, headers);
        setApiOk(true);
      } catch {
        setApiOk(false);
      }
    }
  };

  // Loads query
  const { data, isLoading, isFetching, error, fetchNextPage, hasNextPage, refetch } =
    useLoadsQuery({ baseUrl, token, state });
  const flatItems = useMemo(() => {
    const pages = (data?.pages || []) as any[];
    const items = pages.flatMap((p) => p.items || []).map(adaptServerItem);
    const mapped = items.map((r: any) => {
      if (useServerMetrics && (r.distKm != null || r.rateKm != null)) return r;
      const a = COORDS[r.origin];
      const b = COORDS[r.destination];
      const distKm = haversineKm(a, b);
      const rateKm = distKm ? r.rateUSD / distKm : undefined;
      return { ...r, distKm, rateKm: rateKm ? Math.round(rateKm * 100) / 100 : undefined };
    });
    return mapped;
  }, [data, useServerMetrics]);

  const onSearch = () => {
    refetch();
  };
  const onLoadMore = () => {
    if (hasNextPage) fetchNextPage();
  };

  const toggleFav = (id: string) => {
    setFavs((arr) => (arr.includes(id) ? arr.filter((x) => x !== id) : [id, ...arr]));
  };

  const saveView = () => {
    const id = Math.random().toString(36).slice(2);
    const name = prompt("Nom de la vue ?") || `Vue ${views.length + 1}`;
    const view: ViewSnapshot = {
      id,
      name,
      createdAt: Date.now(),
      state,
      currency,
      rate,
      sort,
      dense,
      visibleCols,
      baseUrl,
      useServerMetrics
    };
    setViews((arr) => [view, ...arr].slice(0, 25));
  };

  const loadView = (id: string) => {
    if (!id) return;
    const v = views.find((x) => x.id === id);
    if (!v) return;
    setState(v.state);
    setCurrency(v.currency);
    setRate(v.rate);
    setSort(v.sort);
    setDense(v.dense);
    setVisibleCols(v.visibleCols);
    setBaseUrl(v.baseUrl);
    setUseServerMetrics(v.useServerMetrics);
  };

  const [openId, setOpenId] = useState<string | undefined>(undefined);

  const onLogout = () => writeToken("", true);

  const needsLogin = !!baseUrl && !token;

  return (
    <Container dark={dark}>
      <TopBar
        dark={dark}
        setDark={setDark}
        dense={dense}
        setDense={setDense}
        onLogout={onLogout}
        token={token}
      />

      <FiltersBar
        onSearch={onSearch}
        state={state}
        setState={setState}
        dark={dark}
        currency={currency}
        setCurrency={setCurrency}
        rate={rate}
        setRate={setRate}
        views={views}
        saveView={saveView}
        loadView={loadView}
        visibleCols={visibleCols}
        setVisibleCols={setVisibleCols}
        baseUrl={baseUrl}
        setBaseUrl={setBaseUrl}
        useServerMetrics={useServerMetrics}
        setUseServerMetrics={setUseServerMetrics}
        onPing={onPing}
        apiOk={apiOk}
        token={token}
        setToken={(v) => writeToken(v, true)}
      />

      {needsLogin ? (
        <LoginScreen baseUrl={baseUrl} onSuccess={({ token: tok, remember }) => writeToken(tok, remember)} />
      ) : (
        <>
          <Results
            data={flatItems}
            dark={dark}
            sort={sort}
            setSort={setSort}
            dense={dense}
            toggleFav={toggleFav}
            favs={favSet}
            currency={currency}
            rate={rate}
            visibleCols={visibleCols}
            loading={isLoading || isFetching}
            error={(error as any)?.message ? String((error as any).message) : error ? String(error) : ""}
            onLoadMore={onLoadMore}
            hasMore={!!hasNextPage}
            onOpen={(id) => setOpenId(id)}
          />
          <LoadDrawer id={openId} baseUrl={baseUrl} token={token} onClose={() => setOpenId(undefined)} />
        </>
      )}
    </Container>
  );
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2
    }
  }
});

export default function FretDRC() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppInner />
    </QueryClientProvider>
  );
}

