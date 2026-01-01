// src/app/services/premium-dashboard.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PremiumSummary, PremiumDistribution, PremiumUser } from '../../models/premium-statistics';

@Injectable({
    providedIn: 'root'
})
export class PremiumDashboardService {
    private apiUrl = `${environment.apiUrl}/premiumDashboard`;

    constructor(private http: HttpClient) { }

    getSummary(): Observable<PremiumSummary> {
        return this.http.get<PremiumSummary>(`${this.apiUrl}/summary`);
    }

    getDistribution(): Observable<PremiumDistribution> {
        return this.http.get<PremiumDistribution>(`${this.apiUrl}/distribution`);
    }

    getUsers(): Observable<PremiumUser[]> {
        return this.http.get<PremiumUser[]>(`${this.apiUrl}/users`);
    }
}
