import 'server-only'
import { phGet } from './client'
import type { PostHogGroup } from '../types'

interface GroupsResponse {
  results: PostHogGroup[]
  next: string | null
}

export async function listCompanyGroups(): Promise<PostHogGroup[]> {
  const all: PostHogGroup[] = []
  let path: string | null = '/groups/?group_type_index=1&limit=100'
  while (path) {
    const data: GroupsResponse = await phGet<GroupsResponse>(path)
    all.push(...data.results)
    path = data.next ?? null
  }
  return all
}

export async function getCompanyGroup(groupKey: string): Promise<PostHogGroup | null> {
  try {
    const data = await phGet<GroupsResponse>(
      `/groups/?group_type_index=1&group_key=${encodeURIComponent(groupKey)}`
    )
    return data.results[0] ?? null
  } catch {
    return null
  }
}
