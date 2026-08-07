import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || '/api/v1';
const REQUEST_TIMEOUT = 30_000;

// ──────────────────────────────────────────────
// Axios instance
// ──────────────────────────────────────────────
export const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: REQUEST_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true,
});

export const client = apiClient;

// ──────────────────────────────────────────────
// Request interceptor — attach access token
// ──────────────────────────────────────────────
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Import lazily to avoid circular dependency
    const stored = localStorage.getItem('dyvin-auth');
    if (stored) {
      try {
        const { state } = JSON.parse(stored);
        if (state?.accessToken) {
          config.headers['Authorization'] = `Bearer ${state.accessToken}`;
        }
      } catch {
        // ignore parse errors
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ──────────────────────────────────────────────
// Track refresh state to avoid parallel refresh calls
// ──────────────────────────────────────────────
let isRefreshing = false;
let refreshQueue: Array<{
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}> = [];

function processRefreshQueue(token: string | null, error: unknown = null) {
  refreshQueue.forEach((p) => {
    if (token) p.resolve(token);
    else p.reject(error);
  });
  refreshQueue = [];
}

// ──────────────────────────────────────────────
// Response interceptor — 401 refresh flow + error normalization
// ──────────────────────────────────────────────
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // 401 → try refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          refreshQueue.push({
            resolve: (token) => {
              originalRequest.headers['Authorization'] = `Bearer ${token}`;
              resolve(apiClient(originalRequest));
            },
            reject,
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const stored = localStorage.getItem('dyvin-auth');
        if (!stored) throw new Error('No refresh token');
        const { state } = JSON.parse(stored);
        if (!state?.refreshToken) throw new Error('No refresh token');

        const { data } = await axios.post(`${BASE_URL}/auth/refresh`, {
          refreshToken: state.refreshToken,
        });

        const { accessToken, refreshToken } = data.data ?? data;

        // Update store
        const newState = { ...state, accessToken, refreshToken, isAuthenticated: true };
        localStorage.setItem('dyvin-auth', JSON.stringify({ state: newState, version: 0 }));

        processRefreshQueue(accessToken);
        originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        processRefreshQueue(null, refreshError);
        localStorage.removeItem('dyvin-auth');
        window.location.href = '/auth/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Normalize error
    return Promise.reject(normalizeError(error));
  }
);

// ──────────────────────────────────────────────
// Error normalization
// ──────────────────────────────────────────────
export interface ApiError {
  message: string;
  statusCode: number;
  errors?: Record<string, string[]>;
  code?: string;
}

function normalizeError(error: AxiosError): ApiError {
  if (error.response) {
    const data = error.response.data as Record<string, unknown>;
    return {
      message: (data?.message as string) ?? 'An error occurred',
      statusCode: error.response.status,
      errors: data?.errors as Record<string, string[]>,
      code: data?.code as string,
    };
  }
  if (error.request) {
    return { message: 'Network error — please check your connection', statusCode: 0 };
  }
  return { message: error.message || 'Unknown error', statusCode: -1 };
}

// ──────────────────────────────────────────────
// Helper: build cancel token
// ──────────────────────────────────────────────
export function createCancelToken() {
  return axios.CancelToken.source();
}

// ──────────────────────────────────────────────
// Helper: paginated query params
// ──────────────────────────────────────────────
export interface PaginationParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
  search?: string;
}

export function buildPaginationParams(params: PaginationParams): URLSearchParams {
  const p = new URLSearchParams();
  if (params.page !== undefined) p.set('page', String(params.page));
  if (params.limit !== undefined) p.set('limit', String(params.limit));
  if (params.sort) p.set('sort', params.sort);
  if (params.order) p.set('order', params.order);
  if (params.search) p.set('search', params.search);
  return p;
}

// ──────────────────────────────────────────────
// Generic typed request helpers
// ──────────────────────────────────────────────
export async function get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  const res = await apiClient.get<T>(url, config);
  return res.data;
}

export async function post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
  const res = await apiClient.post<T>(url, data, config);
  return res.data;
}

export async function put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
  const res = await apiClient.put<T>(url, data, config);
  return res.data;
}

export async function patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
  const res = await apiClient.patch<T>(url, data, config);
  return res.data;
}

export async function del<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  const res = await apiClient.delete<T>(url, config);
  return res.data;
}

// ──────────────────────────────────────────────
// File upload helper
// ──────────────────────────────────────────────
export async function uploadFile<T>(
  url: string,
  file: File,
  onProgress?: (pct: number) => void
): Promise<T> {
  const formData = new FormData();
  formData.append('file', file);

  const res = await apiClient.post<T>(url, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (e) => {
      if (onProgress && e.total) {
        onProgress(Math.round((e.loaded * 100) / e.total));
      }
    },
  });
  return res.data;
}

// ──────────────────────────────────────────────
// File download helper
// ──────────────────────────────────────────────
export async function downloadFile(url: string, filename: string): Promise<void> {
  const res = await apiClient.get(url, { responseType: 'blob' });
  const blob = new Blob([res.data]);
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
}
