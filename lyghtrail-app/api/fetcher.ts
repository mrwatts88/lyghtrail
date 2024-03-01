import { getStageEnv } from "~/stage";

const baseUrl = getStageEnv().apiBaseUrl;

export async function fetcher(url: string, init?: RequestInit) {
  return (await fetchWithBaseUrl(url, init)).json();
}

export async function fetchWithBaseUrl(url: string, init?: RequestInit) {
  const token = await (window as any).Clerk.session.getToken();
  return fetch(`${baseUrl}${url}`, {
    ...init,
    headers: {
      ...init?.headers,
      Authorization: `Bearer ${token}`,
    },
  });
}
