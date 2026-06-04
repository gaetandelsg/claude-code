export interface PostHogGroup {
  group_type_index: number
  group_key: string
  group_properties: PostHogGroupProperties
  created_at: string
}

export interface PostHogGroupProperties {
  name?: string
  hasMDM?: boolean
  hasIAM?: boolean
  hasEDRThreatdown?: boolean
  hasEDRSentinelOne?: boolean
  trialPeriodEnabled?: boolean
  trialPeriodRemainingDays?: number
  isSelfSignup?: boolean
  ztdConfigured?: boolean
  devicesEnrolledCount?: number
  committedDeviceCount?: number
  [key: string]: unknown
}

export interface CustomerSummary {
  groupKey: string
  name: string
  activeProducts: string[]
}

export interface HogQLResult {
  results: unknown[][]
  columns: string[]
  hasMore?: boolean
}

export interface AdminRecord {
  first_name: string | null
  last_name: string | null
  email: string | null
  last_seen: string | null
}

export interface MdmMetrics {
  enrolledDeviceCount: number
  committedDeviceCount: number | null
}

export interface CockpitMetrics {
  admins: AdminRecord[]
  pendingOnboardings: number
  pendingOffboardings: number
}

export interface OrderProduct {
  name: string
  priceNoVAT?: number
}

export interface OrderRecord {
  reference: string | null
  priceNoVAT: number | null
  products: OrderProduct[]
  status: string | null
  date: string
}

export interface OrdersMetrics {
  totalOrders: number
  lastOrderDate: string | null
  ordersLast6m: number
  amountLast6m: number
  shippedCountries: number
  recentOrders: OrderRecord[]
}
