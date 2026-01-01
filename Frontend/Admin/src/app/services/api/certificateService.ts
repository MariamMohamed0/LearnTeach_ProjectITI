import { apiClient } from './client';
import { Certificate } from '../../models/certificate';

export const certificateService = {
  getAllAdmin: async (): Promise<Certificate[]> => {
    const certificates = await apiClient.get<Certificate[]>('/admin/certificates');
    return certificates; 
    
  },

  deleteByAdmin: async (cerId: number): Promise<void> => {
    await apiClient.delete(`/admin/certificates/${cerId}`);
  },
};

