export type LoadboardCursor = {
  createdAt: string; // ISO
  id: string; // listing id
};

export function encodeCursor(c: LoadboardCursor) {
  return Buffer.from(JSON.stringify(c), "utf8").toString("base64url");
}

export function decodeCursor(raw: string): LoadboardCursor | null {
  try {
    const json = Buffer.from(raw, "base64url").toString("utf8");
    const parsed = JSON.parse(json) as unknown;
    if (!parsed || typeof parsed !== "object") return null;
    const obj = parsed as { createdAt?: unknown; id?: unknown };
    if (typeof obj.createdAt !== "string") return null;
    if (typeof obj.id !== "string") return null;
    return { createdAt: obj.createdAt, id: obj.id };
  } catch {
    return null;
  }
}

