import { 
  CreateReportRequest, 
  Report, 
  mapReportFromApi, 
  mapReportListFromApi 
} from '../../models/report';
import { apiClient } from './client';

export const reportService = {
  create: async (data: CreateReportRequest): Promise<Report> => {
    const response = await apiClient.post<any>('/user/reports', data);
    return mapReportFromApi(response);
  },

  
  getMyReports: async (): Promise<Report[]> => {
    const response = await apiClient.get<any[]>('/user/reports');
    return mapReportListFromApi(response);
  },
};



