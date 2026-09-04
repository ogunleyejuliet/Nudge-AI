const STORAGE_KEY = "ol-user-id";

export function getOrCreateUserId(): string {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem(STORAGE_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(STORAGE_KEY, id);
  }
  return id;
}

export function authHeaders(): Record<string, string> {
  return { "X-User-Id": getOrCreateUserId() };
}
