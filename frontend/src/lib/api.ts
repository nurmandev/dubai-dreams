const API_BASE_URL = "http://localhost:5000";

interface RequestOptions extends RequestInit {
  data?: any;
}

const request = async (
  method: string,
  path: string,
  options: RequestOptions = {},
) => {
  const token = localStorage.getItem("accessToken");
  const isFormData = options.data instanceof FormData;

  const headers: HeadersInit = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers,
      body: options.data
        ? isFormData
          ? options.data
          : JSON.stringify(options.data)
        : undefined,
      ...options,
    });

    // Handle No Content cases (204)
    if (response.status === 204) return { data: null, status: 204 };

    // Handle 401 Unauthorized - redirect to login
    if (response.status === 401) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      if (window.location.pathname.startsWith("/admin")) {
        window.location.href = "/login";
        return { data: null, status: 401 };
      }
    }

    // Try to parse JSON safely
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw { response: { data, status: response.status } };
    }

    return { data, status: response.status };
  } catch (error: any) {
    if (error.name === "AbortError") throw error;
    console.error(`API Error on ${path}:`, error);
    throw error;
  }
};

export const api = {
  request,
  get: (path: string, options?: RequestOptions) =>
    request("GET", path, options),
  post: (path: string, options?: RequestOptions) =>
    request("POST", path, options),
  put: (path: string, options?: RequestOptions) =>
    request("PUT", path, options),
  patch: (path: string, options?: RequestOptions) =>
    request("PATCH", path, options),
  delete: (path: string, options?: RequestOptions) =>
    request("DELETE", path, options),
};
