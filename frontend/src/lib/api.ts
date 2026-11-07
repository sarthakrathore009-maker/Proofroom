// Use the deployed Render API by default; VITE_API_URL can override it.
const API_BASE_URL = (import.meta.env.VITE_API_URL || "https://proofroom-3x8b.onrender.com").replace(/\/$/, "");

type ApiOptions = {
  method?: "GET" | "POST" | "PATCH";
  body?: Record<string, string> | FormData;
};

export async function apiRequest<T>(path: string, options: ApiOptions): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method: options.method ?? "POST",
      headers: {
        Accept: "application/json",
        ...(options.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
      },
      credentials: "include",
      ...(options.body
        ? { body: options.body instanceof FormData ? options.body : JSON.stringify(options.body) }
        : {}),
    });
  } catch {
    throw new Error("We couldn't connect to the server. Check your connection and try again.");
  }

  const data = await response.json().catch(() => ({})) as { message?: string; error?: string };
  if (!response.ok) {
    throw new Error(data.message || data.error || "We couldn't complete that request. Please try again.");
  }
  return data as T;
}
