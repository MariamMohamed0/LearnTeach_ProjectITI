export interface AdminReport {
  reportId: number;
  description: string;
  entityType: string;
  entityId: number;
  status: string;  // pending / approved / rejected
  createdAt: string;

  reportedBy: number;
  reportedByName?: string;       // <-- optional name
  reportedUserId: number | null;
  reportedUserName?: string;      // <-- optional name
  reportedUserStatus?: string; // active / suspended
  notified?: boolean; 
}

export function mapAdminReportFromApi(data: any): AdminReport {
  return {
    reportId: data.reportId,
    description: data.reportDescription || 'No description',
    entityType: data.entityType,
    entityId: data.entityId,
    status: data.reportStatus || 'Pending',

    createdAt: data.createdAt,
    reportedBy: data.reportedBy,

    reportedByName: data.reportedByName || undefined,     // from backend if provided

    reportedUserId: data.reportedUserId || null,
    
    reportedUserName: data.reportedUserName || undefined, // from backend if provided

    reportedUserStatus: data.reportedUserStatus || 'active',
    notified: data.notified || false,
  };
}

export function mapAdminReportListFromApi(list: any[]): AdminReport[] {
  return list.map(mapAdminReportFromApi);
}