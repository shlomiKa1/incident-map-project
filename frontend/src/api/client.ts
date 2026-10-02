import { API_URI } from "../config";
import { useAuthStore } from "../store/auth.store";
import type { ApiResponse } from "../types/api";

type RequstOption = {
  method?: "GET" | "POST" | "PATCH" | "DELETE" | "UPDATE";
  body?: unknown;
};

export class ApiRequestError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

console.log("API_URI=", API_URI);

export async function apiRequest<T>(
  path: string,
  { method = "GET", body }: RequstOption = {},
) {
  const headers: Record<string, string> = {};
  if (body !== undefined) headers["Content-Type"] = "application/json";

  let res: Response;
  try {
    res = await fetch(`${API_URI}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      credentials: "include",
    });
  } catch {
    throw new ApiRequestError(0, "Cannot reach server");
  }

  const json = (await res.json().catch(() => null)) as ApiResponse<T> | null;

  if (!res.ok || !json || !json.success) {
    if (res.status === 401) useAuthStore.getState().setGuest();

    const message =
      json && !json.success ? json.message : `Request failed (${res.status})`;

    throw new ApiRequestError(res.status, message);
  }

  return json.data;
}
