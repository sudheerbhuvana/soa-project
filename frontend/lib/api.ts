// Smart API client: tries the real Spring Cloud Gateway (NEXT_PUBLIC_API_BASE),
// falls back to local Next.js mock routes if the gateway is unreachable.

const REMOTE = process.env.NEXT_PUBLIC_API_BASE;
const LOCAL = "/api";
function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("hf_token");
}

async function tryFetch(url: string, init: RequestInit, headers: Record<string, string>) {
  const res = await fetch(url, { ...init, headers });
  if (!res.ok) throw new Error((await res.text()) || `Request failed: ${res.status}`);
  const ct = res.headers.get("content-type") || "";
  if (ct.includes("application/json")) return res.json();
  if (res.status === 204) return null;
  return res.text();
}

export async function api<T = any>(path: string, init: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(init.headers as Record<string, string> | undefined),
  };
  const token = getToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;
  if (REMOTE) {
    try {
      return (await tryFetch(`${REMOTE}${path}`, init, headers)) as T;
    } catch (e) {
      const msg = (e as Error).message || "";
      const isNetwork = msg.includes("Failed to fetch") || msg.includes("ECONNREFUSED") || msg.includes("Request failed: 0");
      if (!isNetwork) throw e;
    }
  }
  return (await tryFetch(`${LOCAL}${path}`, init, headers)) as T;
}

export const authApi = {
  register: (data: { email: string; password: string; companyName: string }) =>
    api("/auth/register", { method: "POST", body: JSON.stringify(data) }),
  login: (data: { email: string; password: string }) =>
    api("/auth/login", { method: "POST", body: JSON.stringify(data) }),
};

export type Carrier = { carrierId: number; companyName: string; email: string; vesselIdentifier: string };
export const carrierApi = {
  list: () => api<Carrier[]>("/carriers"),
  get: (id: number) => api<Carrier>(`/carriers/${id}`),
  create: (data: Omit<Carrier, "carrierId">) => api<Carrier>("/carriers", { method: "POST", body: JSON.stringify(data) }),
  update: (id: number, data: Partial<Carrier>) => api<Carrier>(`/carriers/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  remove: (id: number) => api(`/carriers/${id}`, { method: "DELETE" }),
};

export type Container = { containerId: number; carrierId: number; weight: number; cargoType: string; currentStatus: string };
export const containerApi = {
  list: () => api<Container[]>("/containers"),
  get: (id: number) => api<Container>(`/containers/${id}`),
  create: (data: Omit<Container, "containerId">) => api<Container>("/containers", { method: "POST", body: JSON.stringify(data) }),
  update: (id: number, data: Partial<Container>) => api<Container>(`/containers/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  setStatus: (id: number, status: string) =>
    api<Container>(`/containers/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) }),
  remove: (id: number) => api(`/containers/${id}`, { method: "DELETE" }),
};

export type YardSlot = { slotId: number; zoneCode: string; rowNumber: number; isOccupied: boolean; containerId?: number | null };
export const yardApi = {
  list: () => api<YardSlot[]>("/yard/slots"),
  place: (containerId: number, zoneCode?: string) =>
    api<YardSlot>("/yard/place", { method: "POST", body: JSON.stringify({ containerId, zoneCode }) }),
  release: (containerId: number) => api<YardSlot>(`/yard/release/${containerId}`, { method: "POST" }),
};

export type GateTransaction = { gateTransactionId: number; containerId: number; transactionType: string; truckLicense: string; timestamp: string };
export const gateApi = {
  list: () => api<GateTransaction[]>("/gate/transactions"),
  create: (data: Omit<GateTransaction, "gateTransactionId" | "timestamp">) =>
    api<GateTransaction>("/gate/transactions", { method: "POST", body: JSON.stringify(data) }),
};
