import type { PaginatedResult } from "@/types/paginated"
import { api } from "./api"

export interface AuditLogEntry {
  id: string
  actorId: string | null
  actorEmail: string | null
  action: string
  entity: string
  entityId: string | null
  ip: string | null
  createdAt: string
}

export const auditApi = {
  async list(params?: { entity?: string; action?: string; dateFrom?: string; dateTo?: string; page?: number; limit?: number }): Promise<PaginatedResult<AuditLogEntry>> {
    const qs = new URLSearchParams()
    if (params?.entity) qs.set("entity", params.entity)
    if (params?.action) qs.set("action", params.action)
    if (params?.dateFrom) qs.set("dateFrom", params.dateFrom)
    if (params?.dateTo) qs.set("dateTo", params.dateTo)
    if (params?.page) qs.set("page", String(params.page))
    if (params?.limit) qs.set("limit", String(params.limit))
    const query = qs.toString()
    return api.get<PaginatedResult<AuditLogEntry>>(`/api/audit-logs${query ? `?${query}` : ""}`)
  },
}
