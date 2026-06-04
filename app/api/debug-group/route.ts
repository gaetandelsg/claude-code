import { NextRequest, NextResponse } from 'next/server'
import { getCompanyGroup } from '@/lib/posthog/groups'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const groupKey = req.nextUrl.searchParams.get('gk') ?? '66e2a303876e32967a945e8d'

  const group = await getCompanyGroup(groupKey)

  // Surface every key on the group so we can see the real MDM/device field names.
  const props = group?.group_properties ?? {}
  const keys = Object.keys(props).sort()

  // Pull out anything that looks device/MDM/license related.
  const deviceish = keys.filter((k) =>
    /device|mdm|licen|enroll|commit|seat|headcount/i.test(k)
  )

  return NextResponse.json({
    groupKey,
    found: !!group,
    name: props.name ?? null,
    allKeys: keys,
    deviceRelated: Object.fromEntries(deviceish.map((k) => [k, props[k]])),
    fullProperties: props,
  })
}
