import { Certificate } from '../../models/certificate';
import { apiClient } from './client';


export const certificateService = {
  getAll: async (): Promise<Certificate[]> => {
    const res = await apiClient.get<any>('/certificates');
    return res.data;
  },

create: async (data: FormData): Promise<Certificate> => {
    const res = await apiClient.post<any>('/certifictes', data, true);
    return res;
}
,


  update: async (CerId: number, data: FormData): Promise<Certificate> => {
    const res = await apiClient.put<any>(`/certificates/${CerId}`, data, true);
    return res.data;
  },

  delete: async (CerId: number): Promise<void> => {
    await apiClient.delete<any>(`/certificates/${CerId}`);
  },
};
