import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Package, CreatePackageDto, UpdatePackageDto } from '../../models/premium-offers';

@Injectable({
    providedIn: 'root'
})
export class PackageService {

    private apiUrl = `${environment.apiUrl}/package`; // مسار الـ API العام

    constructor(private http: HttpClient) { }

    // جلب كل الباقات
    getAllPackages(): Observable<Package[]> {
        return this.http.get<Package[]>(`${this.apiUrl}`);
    }

    // جلب باقة واحدة بالـ ID
    getPackageById(id: number): Observable<Package> {
        return this.http.get<Package>(`${this.apiUrl}/${id}`);
    }

    // إنشاء باقة جديدة (Admin)
    createPackage(dto: CreatePackageDto): Observable<Package> {
        return this.http.post<Package>(`${this.apiUrl}/admin`, dto);
    }

    // تعديل باقة موجودة (Admin)
    updatePackage(id: number, dto: UpdatePackageDto): Observable<Package> {
        return this.http.put<Package>(`${this.apiUrl}/admin/${id}`, dto);
    }

    // حذف باقة (Admin)
    deletePackage(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/admin/${id}`);
    }
}
