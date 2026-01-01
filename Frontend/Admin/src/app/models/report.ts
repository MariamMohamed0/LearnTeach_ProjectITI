// src/app/models/report.ts
export interface Report {
  reportedUserId?: number;
  reportedBy: number;
  entityType: string;
  entityId: number;
  reportDescription: string;
  createdAt?: string | null;
  status?: string | null;
}

export interface CreateReportRequest {
  reportedUserId: number;
  reportedBy: number;
  entityType: string;
  entityId: number;
  reportDescription: string;
}


/** map response exactly to frontend Report shape (no renaming) */
export function mapReportFromApi(data: any): Report {
  return {
    reportedUserId: data.reportedUserId,
    reportedBy: data.reportedBy,
    entityType: data.entityType,
    entityId: data.entityId,
    reportDescription: data.reportDescription,
    createdAt: data.createdAt ??  new Date().toISOString(),
    status: data.status ?? 'Pending',
  };
}

export function mapReportListFromApi(data: any[]): Report[] {
  return data.map((r) => mapReportFromApi(r));
}

