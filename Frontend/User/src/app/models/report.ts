export interface Report {
  ReportId: number;
  ReportDescription: string;
  EntityType: string;
  EntityId: number;
  ReportStatus: string;
  CreatedAt: string;
  ReportedBy: number;
  ReportedUserId?: number;
  
  ReportedByName?: string | null;
  ReportedUserName?: string | null;
}

export interface CreateReportRequest {
  ReportDescription: string;
  EntityType: string;
  EntityId: number;
  ReportedUserId?: number;
}

export function mapReportFromApi(data: any): Report {
  return {
    ReportId: data.reportId,
    ReportDescription: data.reportDescription,
    EntityType: data.entityType,
    EntityId: data.entityId,
    ReportStatus: data.reportStatus,
    CreatedAt: data.createdAt,
    ReportedBy: data.reportedBy,
    ReportedUserId: data.reportedUserId,

    ReportedByName: null,
    ReportedUserName: null
  };
}


export function mapReportListFromApi(data: any[]): Report[] {
  return data.map(r => mapReportFromApi(r));
}

