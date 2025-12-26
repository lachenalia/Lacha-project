import { getAuthToken, isAuthTokenValid } from "@/lib/auth";

const BE_URL =
  (typeof window === "undefined"
    ? (process.env.BE_URL ?? process.env.NEXT_PUBLIC_BE_URL)
    : process.env.NEXT_PUBLIC_BE_URL) ?? "http://localhost:3000";

export type ApiFetchOptions = {
  apiUrl: string;
  method?: string;
  params?: Record<string, string | number | boolean | null | undefined>;
  body?: unknown;
  headers?: Record<string, string>;
  cache?: RequestCache;
};

export class ApiRequestError<T = unknown> extends Error {
  status: number;
  data: T;

  constructor(message: string, status: number, data: T) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

function buildUrl(
  baseUrl: string,
  apiUrl: string,
  params?: ApiFetchOptions["params"],
) {
  const url = new URL(apiUrl, baseUrl);

  if (params) {
    for (const [k, v] of Object.entries(params)) {
      if (v === undefined || v === null) continue;
      url.searchParams.set(k, String(v));
    }
  }

  return url.toString();
}

export async function apiFetch<T = unknown>(
  options: ApiFetchOptions,
): Promise<{ res: Response; data: T }> {
  const method = options.method ?? (options.body ? "POST" : "GET");
  const url = buildUrl(BE_URL, options.apiUrl, options.params);

  const authHeader = (() => {
    if (typeof window === "undefined") return undefined;
    if (!isAuthTokenValid()) return undefined;
    const token = getAuthToken();
    if (!token) return undefined;
    return `Bearer ${token}`;
  })();

  const init: RequestInit = {
    method,
    cache: options.cache,
    headers: {
      ...(authHeader ? { Authorization: authHeader } : {}),
      ...(options.body && !(options.body instanceof FormData)
        ? { "Content-Type": "application/json" }
        : {}),
      ...(options.headers ?? {}),
    },
  };

  if (options.body !== undefined) {
    init.body =
      options.body instanceof FormData
        ? options.body
        : JSON.stringify(options.body);
  }

  const res = await fetch(url, init);
  const text = await res.text();

  let data: T;
  try {
    data = (text ? JSON.parse(text) : null) as T;
  } catch {
    data = text as unknown as T;
  }

  return { res, data };
}

function errorMessageFromData(data: unknown) {
  if (!data) return "API request failed";
  if (typeof data === "string") return data;
  if (
    typeof data === "object" &&
    "message" in (data as any) &&
    typeof (data as any).message === "string"
  ) {
    return (data as any).message;
  }
  return "API request failed";
}

export async function apiRequest<TResponse = unknown>(
  options: ApiFetchOptions,
): Promise<{ res: Response; data: TResponse }> {
  const { res, data } = await apiFetch<TResponse>(options);
  if (!res.ok) {
    throw new ApiRequestError(errorMessageFromData(data), res.status, data);
  }
  return { res, data };
}

export async function apiGet<TResponse = unknown>(
  url: string,
  params?: ApiFetchOptions["params"],
  options?: Omit<ApiFetchOptions, "apiUrl" | "method" | "params" | "body">,
): Promise<TResponse> {
  const { data } = await apiRequest<TResponse>({
    apiUrl: url,
    method: "GET",
    params,
    ...options,
  });
  return data;
}

export async function apiPost<TResponse = unknown, TBody = unknown>(
  url: string,
  body?: TBody,
  params?: ApiFetchOptions["params"],
  options?: Omit<ApiFetchOptions, "apiUrl" | "method" | "params" | "body">,
): Promise<TResponse> {
  const { data } = await apiRequest<TResponse>({
    apiUrl: url,
    method: "POST",
    params,
    body,
    ...options,
  });
  return data;
}

export async function apiPut<TResponse = unknown, TBody = unknown>(
  url: string,
  body?: TBody,
  params?: ApiFetchOptions["params"],
  options?: Omit<ApiFetchOptions, "apiUrl" | "method" | "params" | "body">,
): Promise<TResponse> {
  const { data } = await apiRequest<TResponse>({
    apiUrl: url,
    method: "PUT",
    params,
    body,
    ...options,
  });
  return data;
}

export async function apiPatch<TResponse = unknown, TBody = unknown>(
  url: string,
  body?: TBody,
  params?: ApiFetchOptions["params"],
  options?: Omit<ApiFetchOptions, "apiUrl" | "method" | "params" | "body">,
): Promise<TResponse> {
  const { data } = await apiRequest<TResponse>({
    apiUrl: url,
    method: "PATCH",
    params,
    body,
    ...options,
  });
  return data;
}

export async function apiDelete<TResponse = unknown>(
  url: string,
  params?: ApiFetchOptions["params"],
  options?: Omit<ApiFetchOptions, "apiUrl" | "method" | "params" | "body">,
): Promise<TResponse> {
  const { data } = await apiRequest<TResponse>({
    apiUrl: url,
    method: "DELETE",
    params,
    ...options,
  });
  return data;
}
