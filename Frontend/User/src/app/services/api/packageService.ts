import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Package, CreatePackageRequest, UpdatePackageRequest, PurchasePackageRequest } from '../../models/package';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PackageService {
  private baseUrl = `${environment.apiUrl}/package`;

  constructor(private http: HttpClient) { }

  // جميع الباقات
  getAllPackages(): Observable<Package[]> {
    return this.http.get<Package[]>(`${this.baseUrl}`);
  }

  // باقة واحدة
  getById(id: number): Observable<Package> {
    return this.http.get<Package>(`${this.baseUrl}/${id}`);
  }

  // باقات المستخدم
  getUserPackages(userId: number): Observable<Package[]> {
    return this.http.get<Package[]>(`${this.baseUrl}/user/${userId}`);
  }

  // شراء باقة
  purchasePackage(data: PurchasePackageRequest): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/purchase`, data);
  }

  // إنشاء باقة (admin)
  createPackage(data: CreatePackageRequest): Observable<Package> {
    return this.http.post<Package>(`${this.baseUrl}/admin`, data);
  }

  // تحديث باقة (admin)
  updatePackage(id: number, data: UpdatePackageRequest): Observable<Package> {
    return this.http.put<Package>(`${this.baseUrl}/admin/${id}`, data);
  }

  // حذف باقة (admin)
  deletePackage(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/admin/${id}`);
  }
}
