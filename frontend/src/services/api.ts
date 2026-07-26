const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/api/v1";

export const getApiUrl = (path: string) => `${BASE_URL}${path}`;

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(getApiUrl(path), {
    ...options,
    credentials: "include",
    headers: { "Content-Type": "application/json", ...(options.headers ?? {}) },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.detail ?? body?.message ?? `API error ${res.status}: ${res.statusText}`);
  }
  const contentType = res.headers.get("content-type");

  if (contentType?.includes("application/json")) return res.json();
  return res.blob() as Promise<T>;
}

export const api = {
  get: <T>(path: string, options: RequestInit = {}) => request<T>(path, { method: "GET", ...options }),
  post: <T>(path: string, body?: unknown) => request<T>(path, { method: "POST", body: body ? JSON.stringify(body) : undefined }),
  put: <T>(path: string, body?: unknown) => request<T>(path, { method: "PUT", body: body ? JSON.stringify(body) : undefined }),
  del: <T>(path: string) => request<T>(path, { method: "DELETE" }),
};
