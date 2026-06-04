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
  const body = await res.json()
  // Return full body so we can see errors in any format
  return body
}

export async function GET(req: NextRequest) {
  const gk = (req.nextUrl.searchParams.get('gk') ?? '66e2a303876e32967a945e8d').replace(/'/g, "\\'")

  // 1. Sample one row from viewcompanymetrics for this company.
  const metricsSample = await hogql(`
    SELECT *
    FROM mongodb.viewcompanymetrics
    WHERE companyId = '${gk}'
    LIMIT 1
  `)

  // 2. MDM status breakdown from viewdevice for this company.
  const mdmBreakdown = await hogql(`
    SELECT mdmStatus, platform, count() AS c
    FROM mongodb.viewdevice
    WHERE companyId = '${gk}'
      AND availableStatus != 'RETIRED'
    GROUP BY mdmStatus, platform
    ORDER BY platform, mdmStatus
  `)

  // 3. Total enrolled (MDM_ON) and total non-retired devices.
  const mdmSummary = await hogql(`
    SELECT
      countIf(mdmStatus = 'MDM_ON') AS enrolled,
      countIf(mdmStatus != 'MDM_ON' AND mdmStatus != 'READY_ZTD') AS not_enrolled,
      count() AS total
    FROM mongodb.viewdevice
    WHERE companyId = '${gk}'
      AND availableStatus != 'RETIRED'
  `)

  return NextResponse.json({ gk, metricsSample, mdmBreakdown, mdmSummary })
}
