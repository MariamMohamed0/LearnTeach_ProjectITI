export interface AdminReport {
  id: number;
  description: string;
  entityType: string;
  entityId: number;

  status: 'Pending' | 'Approved' | 'Rejected';

  createdAt: string | null;

  reportedBy: number;
  reportedUserId?: number;

  reportedByName?: string;
  reportedUserName?: string;
}


export interface UpdateReportStatusRequest {
  status: 'Pending' | 'Approved' | 'Rejected';
}


export interface AdminReportStats {
  total: number;
  pending: number;
  reviewed: number;
  resolved: number;
  rejected: number;
}
export function mapAdminReportFromApi(data: any): AdminReport {
  return {
    id: data.reportId,
    description: data.reportDescription,
    entityType: data.entityType,
    entityId: data.entityId,

    status: data.reportStatus,

    createdAt: data.createdAt,

    reportedBy: data.reportedBy,
    reportedUserId: data.reportedUserId,

    reportedByName: data.reportedByNavigation?.userName,
    reportedUserName: data.reportedUser?.userName
  };
}

export function mapAdminReportListFromApi(data: any[]): AdminReport[] {
  return data.map(r => mapAdminReportFromApi(r));
}

