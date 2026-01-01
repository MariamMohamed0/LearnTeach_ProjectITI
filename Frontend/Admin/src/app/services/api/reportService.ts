import { 
  CreateReportRequest, 
  Report, 
  mapReportFromApi, 
  mapReportListFromApi 
} from '../../models/report';

import { apiClient } from './client';

export const reportService = {

  create: async (data: CreateReportRequest): Promise<Report> => {
    const response = await apiClient.post<any>('/Report', data);
    return mapReportFromApi(response);
  },

  getByUserId: async (userId: number): Promise<Report[]> => {
    const response = await apiClient.get<any[]>(`/Report/user/${userId}`);
    return mapReportListFromApi(response);
  },
};
