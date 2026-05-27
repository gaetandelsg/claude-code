export interface PostHogGroup {
  group_type_index: number
  group_key: string
  group_properties: PostHogGroupProperties
  created_at: string
}

// Property names are placeholders — verify against your PostHog group properties tab
export interface PostHogGroupProperties {
  name?: string
  hubspot_company_id?: string
  admin_name?: string
  admin_email?: string
  active_products?: string[]
  plan?: string
  committed_headcount?: number
  committed_device_count?: number
  mdm_activated?: boolean
  ztd_configured?: boolean
  hr_system_connected?: boolean
  email_provider_connected?: boolean
  saas_discovered_count?: number
  [key: string]: unknown
}

export interface CustomerSummary {
  groupKey: string
  name: string
  activeProducts: string[]
  adminName?: string
  adminEmail?: string
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
}

export interface CockpitMetrics {
  admins: AdminRecord[]
  activeEmployees: number
  committedHeadcount: number
  pendingOnboardings: number
  pendingOffboardings: number
  hrSystemConnected: boolean
}

export interface MdmEdrMetrics {
  mdmActivated: boolean
  enrolledDevices: number
  committedDeviceCount: number
  ztdConfigured: boolean
  edrEnrolledDevices: number | null
}

export interface SaasMetrics {
  emailProviderConnected: boolean
  discoveredSaasCount: number
}

export interface OrdersMetrics {
  totalOrders: number
  lastOrderDate: string | null
}
