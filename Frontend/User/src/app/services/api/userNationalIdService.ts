import { apiClient } from './client';
import { UserNationalId, CreateUserNationalIdRequest, UpdateUserNationalIdRequest, VerifyNationalIdRequest } from '../../models/userNationalId';

export const userNationalIdService = {
  async getByUserId(userId: number): Promise<UserNationalId> {
    return apiClient.get<UserNationalId>(`/UserNationalId/user/${userId}`);
  },

  async getById(id: number): Promise<UserNationalId> {
    return apiClient.get<UserNationalId>(`/UserNationalId/${id}`);
  },

  async getPending(): Promise<UserNationalId[]> {
    return apiClient.get<UserNationalId[]>('/UserNationalId/pending');
  },

  async getVerificationStatus(userId: number): Promise<{ status: string }> {
    return apiClient.get<{ status: string }>(`/UserNationalId/verification-status/${userId}`);
  },

  async create(userId: number, data: CreateUserNationalIdRequest): Promise<UserNationalId> {
    return apiClient.post<UserNationalId>(`/UserNationalId/user/${userId}`, data);
  },

  async update(id: number, data: UpdateUserNationalIdRequest): Promise<UserNationalId> {
    return apiClient.put<UserNationalId>(`/UserNationalId/${id}`, data);
  },

  async verify(id: number, data: VerifyNationalIdRequest): Promise<void> {
    return apiClient.post<void>(`/UserNationalId/verify/${id}`, data);
  },

  async reject(id: number, data: VerifyNationalIdRequest): Promise<void> {
    return apiClient.post<void>(`/UserNationalId/reject/${id}`, data);
  },

  async delete(id: number): Promise<void> {
    return apiClient.delete<void>(`/UserNationalId/${id}`);
  },
};
