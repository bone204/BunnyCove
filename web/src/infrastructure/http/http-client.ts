import { AppUrls } from "../constants/app-urls";
import { StorageKeys } from "../constants/defaults";
import { ResponseCodes } from "../constants/response-codes";

export interface ApiResponse<T = unknown> {
  success: boolean;
  code?: string;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export class AppHttpError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly status: number = 400,
    public readonly details?: unknown
  ) {
    super(message);
    this.name = "AppHttpError";
  }
}

export class HttpClient {
  private static isRefreshing = false;
  private static refreshSubscribers: ((token: string) => void)[] = [];

  private static subscribeTokenRefresh(cb: (token: string) => void) {
    this.refreshSubscribers.push(cb);
  }

  private static onRefreshed(token: string) {
    this.refreshSubscribers.forEach((cb) => cb(token));
    this.refreshSubscribers = [];
  }

  static getAccessToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(StorageKeys.accessToken);
  }

  static setAccessToken(token: string | null): void {
    if (typeof window === "undefined") return;
    if (token) {
      localStorage.setItem(StorageKeys.accessToken, token);
    } else {
      localStorage.removeItem(StorageKeys.accessToken);
    }
  }

  static getRefreshToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(StorageKeys.refreshToken);
  }

  static setRefreshToken(token: string | null): void {
    if (typeof window === "undefined") return;
    if (token) {
      localStorage.setItem(StorageKeys.refreshToken, token);
    } else {
      localStorage.removeItem(StorageKeys.refreshToken);
    }
  }

  static clearTokens(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(StorageKeys.accessToken);
    localStorage.removeItem(StorageKeys.refreshToken);
    localStorage.removeItem(StorageKeys.userProfile);
  }

  private static async refreshAccessToken(): Promise<string | null> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      this.clearTokens();
      return null;
    }

    try {
      const response = await fetch(AppUrls.auth.refresh, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        this.clearTokens();
        return null;
      }

      const json: ApiResponse<{ tokens: { accessToken: string; refreshToken?: string } }> =
        await response.json();

      if (json.success && json.data?.tokens.accessToken) {
        const newAccessToken = json.data.tokens.accessToken;
        this.setAccessToken(newAccessToken);
        if (json.data.tokens.refreshToken) {
          this.setRefreshToken(json.data.tokens.refreshToken);
        }
        return newAccessToken;
      }

      this.clearTokens();
      return null;
    } catch {
      this.clearTokens();
      return null;
    }
  }

  static async request<T = unknown>(
    url: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers = new Headers(options.headers || {});

    if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
      headers.set("Content-Type", "application/json");
    }

    const token = this.getAccessToken();
    if (token && !headers.has("Authorization")) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    const config: RequestInit = {
      ...options,
      headers,
    };

    let response: Response;
    try {
      response = await fetch(url, config);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Network error";
      throw new AppHttpError(
        ResponseCodes.NETWORK_ERROR,
        message,
        0
      );
    }

    // Handle 401 Unauthorized token refresh
    if (response.status === 401) {
      if (!this.isRefreshing) {
        this.isRefreshing = true;
        const newToken = await this.refreshAccessToken();
        this.isRefreshing = false;

        if (newToken) {
          this.onRefreshed(newToken);
          headers.set("Authorization", `Bearer ${newToken}`);
          return this.request<T>(url, { ...options, headers });
        }
      } else {
        return new Promise<T>((resolve, reject) => {
          this.subscribeTokenRefresh(async (newToken: string) => {
            try {
              headers.set("Authorization", `Bearer ${newToken}`);
              const res = await HttpClient.request<T>(url, { ...options, headers });
              resolve(res);
            } catch (error) {
              reject(error);
            }
          });
        });
      }
    }

    let payload: ApiResponse<T>;
    try {
      payload = await response.json();
    } catch {
      if (!response.ok) {
        throw new AppHttpError(
          ResponseCodes.SERVER_ERROR,
          response.statusText,
          response.status
        );
      }
      return {} as T;
    }

    if (!response.ok || !payload.success) {
      const code = payload.error?.code || ResponseCodes.SERVER_ERROR;
      const message = payload.error?.message || "An unexpected error occurred";
      throw new AppHttpError(code, message, response.status, payload.error?.details);
    }

    return payload.data as T;
  }

  static get<T = unknown>(url: string, headers?: HeadersInit): Promise<T> {
    return this.request<T>(url, { method: "GET", headers });
  }

  static post<T = unknown>(url: string, body?: unknown, headers?: HeadersInit): Promise<T> {
    return this.request<T>(url, {
      method: "POST",
      headers,
      body: body instanceof FormData ? body : JSON.stringify(body),
    });
  }

  static put<T = unknown>(url: string, body?: unknown, headers?: HeadersInit): Promise<T> {
    return this.request<T>(url, {
      method: "PUT",
      headers,
      body: body instanceof FormData ? body : JSON.stringify(body),
    });
  }

  static patch<T = unknown>(url: string, body?: unknown, headers?: HeadersInit): Promise<T> {
    return this.request<T>(url, {
      method: "PATCH",
      headers,
      body: body instanceof FormData ? body : JSON.stringify(body),
    });
  }

  static delete<T = unknown>(url: string, headers?: HeadersInit): Promise<T> {
    return this.request<T>(url, { method: "DELETE", headers });
  }
}
