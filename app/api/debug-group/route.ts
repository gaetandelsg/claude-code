import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const BASE_URL = process.env.POSTHOG_HOST!
const PROJECT = process.env.POSTHOG_PROJECT_ID!
const API_KEY = process.env.POSTHOG_API_KEY!

async function hogql(query: string) {
  const res = await fetch(`${BASE_URL}/api/projects/${PROJECT}/query/`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: { kind: 'HogQLQuery', query } }),
    cache: 'no-store',
  })
  return res.json()
}

export async function GET(req: NextRequest) {
  const gk = (req.nextUrl.searchParams.get('gk') ?? '66e2a303876e32967a945e8d').replace(/'/g, "\\'")

  // Get this company's raw metrics record
  const metricsRaw = await hogql(`
    SELECT _id, data
    FROM mongodb.viewcompanymetrics
    WHERE _id = '${gk}'
    LIMIT 1
  `)

  // Try dot notation for enrolled + committed from viewcompanymetrics
  const metricsFields = await hogql(`
    SELECT
      data.devicesEnrolledCount,
      data.committedDeviceCount,
      data.deviceMdm.countMdmOn
    FROM mongodb.viewcompanymetrics
    WHERE _id = '${gk}'
    LIMIT 1
  `)

  // Count enrolled from viewdevice with dot notation
  const deviceCount = await hogql(`
    SELECT
      countIf(data.mdmStatus = 'MDM_ON') AS enrolled,
      count() AS total
    FROM mongodb.viewdevice
    WHERE data.companyId = '${gk}'
      AND data.availableStatus != 'RETIRED'
  `)

  return NextResponse.json({ gk, metricsRaw, metricsFields, deviceCount })
}
