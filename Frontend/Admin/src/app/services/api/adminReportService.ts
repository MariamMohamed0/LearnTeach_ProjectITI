
import { apiClient } from './client';
import { AdminReport, mapAdminReportListFromApi } from '../../models/adminReport';

export const adminReportService = {
  getAll: async (): Promise<AdminReport[]> => {
    const response = await apiClient.get<any[]>('/admin/reports');
    return mapAdminReportListFromApi(response);
  },

  getPending: async (): Promise<AdminReport[]> => {
    const response = await apiClient.get<any[]>('/admin/reports/pending');
    return mapAdminReportListFromApi(response);
  },
  suspendOrRestoreUser: async (userId: number): Promise<void> => {
    await apiClient.post(`/admin/reports/user/${userId}/suspend-restore`, {});
  },
  
  updateStatus: async (id: number, newStatus: string): Promise<void> => {
    await apiClient.put(`/admin/reports/${id}/status`, { status: newStatus });
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/admin/reports/${id}`);
  },
};
