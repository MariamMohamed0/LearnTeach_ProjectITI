import { AdminReport } from '../../models/adminReport';
import { apiClient } from './client';


export const adminReportService = {

  getAll: async (): Promise<AdminReport[]> => {
    return apiClient.get<AdminReport[]>('/admin/reports');
  },

  getPending: async (): Promise<AdminReport[]> => {
    return apiClient.get<AdminReport[]>('/admin/reports/pending');
  },

  updateStatus: async (id: number, newStatus: string): Promise<any> => {
    return apiClient.put<any>(`/admin/reports/${id}/status?newStatus=${newStatus}`, {});
  },

  delete: async (id: number): Promise<void> => {
    return apiClient.delete<void>(`/admin/reports/${id}`);
  },
};
