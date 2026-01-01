import { apiClient } from './client';
import { Package, CreatePackageRequest, UpdatePackageRequest, UserPackage, PurchasePackageRequest } from '../../models/package';

export const packageService = {
  async getAll(): Promise<Package[]> {
    return apiClient.get<Package[]>('/Package');
  },

  async getById(id: number): Promise<Package> {
    return apiClient.get<Package>(`/Package/${id}`);
  },

  async getUserPackages(userId: number): Promise<UserPackage[]> {
    return apiClient.get<UserPackage[]>(`/Package/user/${userId}`);
  },

  async purchase(data: PurchasePackageRequest): Promise<void> {
    return apiClient.post<void>('/Package/purchase', data);
  },

  async create(data: CreatePackageRequest): Promise<Package> {
    return apiClient.post<Package>('/Package/admin', data);
  },

  async update(id: number, data: UpdatePackageRequest): Promise<Package> {
    return apiClient.put<Package>(`/Package/admin/${id}`, data);
  },

  async delete(id: number): Promise<void> {
    return apiClient.delete<void>(`/Package/admin/${id}`);
  },
};
