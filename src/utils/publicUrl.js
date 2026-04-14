const SITE_URL =
  (import.meta.env.VITE_SITE_URL || "https://www.redealerta.ong.br").replace(/\/+$/, "");

export function getSiteUrl() {
  return SITE_URL;
}

export function buildNewsPublicUrl(slug) {
  return `${SITE_URL}/informacoes/${slug}`;
}

export function buildNewsShareUrl(slug) {
  return `${SITE_URL}/share/news/${slug}`;
}

export function buildCasePublicUrl(id) {
  return `${SITE_URL}/caso/${id}`;
}

export function buildCaseShareUrl(id) {
  return `${SITE_URL}/share/case/${id}`;
}

export function toAbsoluteApiAssetUrl(assetUrl) {
  if (!assetUrl) return "";

  if (/^https?:\/\//i.test(assetUrl)) {
    return assetUrl;
  }

  const apiBase = (import.meta.env.VITE_API_URL || "").replace(/\/+$/, "");
  const path = String(assetUrl).replace(/^\/+/, "");

  return `${apiBase}/${path}`.replace(/([^:]\/)\/+/g, "$1");
}