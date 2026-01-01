import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Package, PurchasePackageRequest } from '../../models/package';
import { PaymentInitiateDto, PaymentHistoryDto } from '../../models/payment';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class PremiumService {
    private packageBase = `${environment.apiUrl}/package`;
    private paymentBase = `${environment.apiUrl}/payment`;
    private premiumBase = `${environment.apiUrl}/premium`;

    constructor(private http: HttpClient) { }

    // --------------------------
    // 📦 Package APIs
    // --------------------------

    getAllPackages(): Observable<Package[]> {
        return this.http.get<Package[]>(`${this.packageBase}`);
    }

    getPackageById(id: number): Observable<Package> {
        return this.http.get<Package>(`${this.packageBase}/${id}`);
    }

    getUserPackages(userId: number): Observable<Package[]> {
        return this.http.get<Package[]>(`${this.packageBase}/user/${userId}`);
    }

    purchasePackage(data: PurchasePackageRequest): Observable<void> {
        return this.http.post<void>(`${this.premiumBase}/purchase`, data);
    }

    // --------------------------
    // 💳 Payment APIs
    // --------------------------

    initiatePayment(payload: PaymentInitiateDto): Observable<PaymentHistoryDto> {
        return this.http.post<PaymentHistoryDto>(`${this.paymentBase}/initiate`, payload);
    }
}
