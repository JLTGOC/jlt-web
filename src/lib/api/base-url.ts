const RAW_API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string | undefined;

function normalizeBaseUrl(baseUrl: string): string {
  return baseUrl.trim().replace(/\/+$/, "").replace(/\/api$/, "");
}

export function getApiOriginUrl(): string {
  if (!RAW_API_BASE_URL) {
    return "";
  }

  return normalizeBaseUrl(RAW_API_BASE_URL);
}

export function getApiBaseUrl(): string {
  const origin = getApiOriginUrl();

  if (!origin) {
    return "/api";
  }

  return `${origin}/api`;
}