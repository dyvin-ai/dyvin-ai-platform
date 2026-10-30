import type { AppError } from "@/types";
import { authService } from "@/lib/auth";

export interface RequestOptions {
  method?: string | undefined;
  headers?: Record<string, string> | undefined;
  body?: string | null | undefined;
  timeoutMs?: number | undefined;
  params?: Record<string, string | number | boolean | undefined> | undefined;
  signal?: AbortSignal | undefined;
  _isRetry?: boolean | undefined;
}

let refreshPromise: Promise<string | null> | null = null;

export class ApiClient {
  private baseUrl: string;
  private tokenProvider: () => string | null;
  private orgIdProvider: () => string | null;

  constructor(
    baseUrl: string = (import.meta.env["VITE_API_BASE_URL"] as string) || "/api/v1",
    tokenProvider: () => string | null = () => authService.getAccessToken(),
    orgIdProvider: () => string | null = () => authService.getActiveOrgId()
  ) {
    this.baseUrl = baseUrl.replace(/\/$/, "");
    this.tokenProvider = tokenProvider;
    this.orgIdProvider = orgIdProvider;
  }

  private normalizeError(error: unknown, status?: number): AppError {
    if (typeof error === "object" && error !== null && "code" in error && "message" in error) {
      const err = error as AppError;
      return {
        code: err.code || "INTERNAL_ERROR",
        message: err.message || "An unexpected error occurred",
        status: status ?? err.status ?? 500,
        retryable: err.retryable ?? (status ? status >= 500 || status === 429 : true),
        details: err.details,
      };
    }

    if (error instanceof DOMException && error.name === "AbortError") {
      const isTimeout =
        (typeof error.message === "string" && error.message.includes("timed out")) ||
        (error as any)?.reason === "Request timed out";
      return {
        code: "NETWORK_ERROR",
        message: isTimeout ? "Request timed out. Please try again." : "Request was cancelled",
        status: 408,
        retryable: isTimeout,
      };
    }

    if (
      error instanceof TypeError &&
      (error.message.includes("fetch") ||
        error.message.includes("network") ||
        error.message.includes("Network"))
    ) {
      return {
        code: "NETWORK_ERROR",
        message: "Unable to connect to Dyvin AI server. Please check your network connection.",
        status: 503,
        retryable: true,
        details: { error: error.message },
      };
    }

    if (status === 401) {
      return {
        code: "UNAUTHORIZED",
        message: "Authentication session expired or invalid",
        status: 401,
        retryable: false,
        details: error instanceof Error ? { error: error.message } : undefined,
      };
    }

    if (status === 403) {
      return {
        code: "FORBIDDEN",
        message: error instanceof Error && error.message ? error.message : "You do not have permission to access this resource",
        status: 403,
        retryable: false,
        details: error instanceof Error ? { error: error.message } : undefined,
      };
    }

    if (status === 404) {
      const msg =
        error instanceof Error && error.message && error.message !== "Not Found"
          ? error.message
          : "The requested resource was not found";
      return {
        code: "NOT_FOUND",
        message: msg,
        status: 404,
        retryable: false,
        details: error instanceof Error ? { error: error.message } : undefined,
      };
    }

    if (status === 409) {
      return {
        code: "VALIDATION_ERROR",
        message: error instanceof Error ? error.message : "Resource conflict occurred",
        status: 409,
        retryable: false,
      };
    }

    if (status === 429) {
      return {
        code: "RATE_LIMITED",
        message: "Rate limit exceeded. Please wait a moment before trying again.",
        status: 429,
        retryable: true,
      };
    }

    return {
      code: "INTERNAL_ERROR",
      message: error instanceof Error ? error.message : "Network error. Please check your connection.",
      status: status ?? 500,
      retryable: true,
    };
  }

  public async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { timeoutMs = 12000, params, headers, method = "GET", body, signal, _isRetry } = options;

    let url = `${this.baseUrl}/${endpoint.replace(/^\//, "")}`;
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, String(value));
        }
      });
      const queryString = searchParams.toString();
      if (queryString) {
        url += (url.includes("?") ? "&" : "?") + queryString;
      }
    }

    const token = this.tokenProvider();
    const activeOrgId = this.orgIdProvider();

    const defaultHeaders: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(activeOrgId ? { "X-Organization-Id": activeOrgId } : {}),
      ...(headers || {}),
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort("Request timed out"), timeoutMs);

    if (signal) {
      if (signal.aborted) {
        controller.abort(signal.reason);
      } else {
        signal.addEventListener("abort", () => controller.abort(signal.reason), { once: true });
      }
    }

    const init: RequestInit = {
      method,
      headers: defaultHeaders,
      signal: controller.signal,
    };

    if (body !== undefined && body !== null) {
      init.body = body;
    }

    try {
      const response = await fetch(url, init);
      clearTimeout(timeoutId);

      // Handle 401 Unauthorized with token refresh if not already retried
      if (response.status === 401 && !_isRetry && token) {
        if (!refreshPromise) {
          refreshPromise = authService.refreshTokens().finally(() => {
            refreshPromise = null;
          });
        }

        const newToken = await refreshPromise;
        if (newToken) {
          return this.request<T>(endpoint, {
            ...options,
            _isRetry: true,
          });
        }
      }

      if (!response.ok) {
        let errorData: { message?: string | string[] } = {};
        try {
          errorData = await response.json();
        } catch {
          errorData = { message: response.statusText };
        }
        const errorMsg = Array.isArray(errorData.message)
          ? errorData.message.join(", ")
          : errorData.message || response.statusText;
        throw this.normalizeError(new Error(errorMsg), response.status);
      }

      if (response.status === 204) {
        return undefined as T;
      }

      const json = await response.json();
      const data = (json && typeof json === "object" && "data" in json && "success" in json) ? json.data : json;
      return data as T;
    } catch (err) {
      clearTimeout(timeoutId);
      throw this.normalizeError(err);
    }
  }

  public get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "GET" });
  }

  public post<T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "POST",
      body: body !== undefined ? JSON.stringify(body) : null,
    });
  }

  public patch<T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "PATCH",
      body: body !== undefined ? JSON.stringify(body) : null,
    });
  }

  public async downloadBlob(
    endpoint: string,
    options: RequestOptions = {},
  ): Promise<{ blob: Blob; filename: string; contentType: string }> {
    const { timeoutMs = 30000, params, headers, signal, _isRetry } = options;

    let url = `${this.baseUrl}/${endpoint.replace(/^\//, "")}`;
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, String(value));
        }
      });
      const queryString = searchParams.toString();
      if (queryString) {
        url += (url.includes("?") ? "&" : "?") + queryString;
      }
    }

    const token = this.tokenProvider();
    const activeOrgId = this.orgIdProvider();

    const defaultHeaders: Record<string, string> = {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(activeOrgId ? { "X-Organization-Id": activeOrgId } : {}),
      ...(headers || {}),
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort("Request timed out"), timeoutMs);

    if (signal) {
      if (signal.aborted) {
        controller.abort(signal.reason);
      } else {
        signal.addEventListener("abort", () => controller.abort(signal.reason), { once: true });
      }
    }

    const init: RequestInit = {
      method: "GET",
      headers: defaultHeaders,
      signal: controller.signal,
    };

    try {
      const response = await fetch(url, init);
      clearTimeout(timeoutId);

      // Handle 401 Unauthorized with token refresh if not already retried
      if (response.status === 401 && !_isRetry && token) {
        if (!refreshPromise) {
          refreshPromise = authService.refreshTokens().finally(() => {
            refreshPromise = null;
          });
        }

        const newToken = await refreshPromise;
        if (newToken) {
          return this.downloadBlob(endpoint, {
            ...options,
            _isRetry: true,
          });
        }
      }

      if (!response.ok) {
        let errorData: { message?: string | string[] } = {};
        try {
          errorData = await response.json();
        } catch {
          errorData = { message: response.statusText };
        }
        const errorMsg = Array.isArray(errorData.message)
          ? errorData.message.join(", ")
          : errorData.message || response.statusText;
        throw this.normalizeError(new Error(errorMsg), response.status);
      }

      const contentType = response.headers.get("content-type") || "application/octet-stream";
      const contentDisposition = response.headers.get("content-disposition") || "";
      let filename = "export-artifact";
      const utf8Match = contentDisposition.match(/filename\*=UTF-8''([^;\s]+)/i);
      if (utf8Match && utf8Match[1]) {
        try {
          filename = decodeURIComponent(utf8Match[1].trim());
        } catch {
          filename = utf8Match[1].trim();
        }
      } else {
        const filenameMatch = contentDisposition.match(/filename=["']?([^"';]+)["']?/i);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1].trim().replace(/^["']|["']$/g, "");
        }
      }

      const blob = await response.blob();
      return { blob, filename, contentType };
    } catch (err) {
      clearTimeout(timeoutId);
      throw this.normalizeError(err);
    }
  }

  public getBaseUrl(): string {
    return this.baseUrl;
  }

  public delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "DELETE" });
  }
}

export const apiClient = new ApiClient();
