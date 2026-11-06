const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? "").replace(/\/$/, "");

type ApiOptions = {
  method?: "POST" | "PATCH";
  body: Record<string, string>;
};

export async function apiRequest<T>(path: string, options: ApiOptions): Promise<T> {
  if (!API_BASE_URL) {
    throw new Error("Account services are not configured. Please contact your workspace administrator.");
  }

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method: options.method ?? "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      credentials: "include",
      body: JSON.stringify(options.body),
    });
  } catch {
    throw new Error("We couldn't connect to the server. Check your connection and try again.");
  }

  const data = await response.json().catch(() => ({})) as { message?: string };
  if (!response.ok) {
    throw new Error(data.message || "We couldn't complete that request. Please try again.");
  }
  return data as T;
}
