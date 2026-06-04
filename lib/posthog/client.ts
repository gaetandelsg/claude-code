import 'server-only'

const BASE_URL = process.env.POSTHOG_HOST!
const PROJECT = process.env.POSTHOG_PROJECT_ID!
const API_KEY = process.env.POSTHOG_API_KEY!

function authHeaders(): HeadersInit {
  return {
    Authorization: `Bearer ${API_KEY}`,
    'Content-Type': 'application/json',
  }
}

export async function phGet<T>(path: string): Promise<T> {
  const url = path.startsWith('http')
    ? path
    : `${BASE_URL}/api/projects/${PROJECT}${path}`
  const res = await fetch(url, {
    headers: authHeaders(),
    next: { revalidate: 300 },
  })
  if (!res.ok) throw new Error(`PostHog GET ${path} → ${res.status}`)
  return res.json() as Promise<T>
}

export async function phPost<T>(path: string, body: unknown): Promise<T> {
  const url = `${BASE_URL}/api/projects/${PROJECT}${path}`
  const res = await fetch(url, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(body),
    cache: 'no-store',
  })
  if (!res.ok) throw new Error(`PostHog POST ${path} → ${res.status}`)
  return res.json() as Promise<T>
}
