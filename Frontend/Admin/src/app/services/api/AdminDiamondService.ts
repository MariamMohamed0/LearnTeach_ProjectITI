// src/app/services/api/diamond.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DiamondAverage, DiamondBuyersCount, TotalUsd, UserDiamondDetail } from '../../models/diamond';

@Injectable({
    providedIn: 'root'
})
export class AdminDiamondService {

    private apiUrl = `${environment.apiUrl}/admin/diamonds`;

    constructor(private http: HttpClient) { }

    getAverageDiamonds(): Observable<DiamondAverage> {
        return this.http.get<DiamondAverage>(`${this.apiUrl}/average`);
    }

    getBuyersCount(): Observable<DiamondBuyersCount> {
        return this.http.get<DiamondBuyersCount>(`${this.apiUrl}/buyers-count`);
    }

    getTotalUsd(): Observable<TotalUsd> {
        return this.http.get<TotalUsd>(`${this.apiUrl}/total-usd`);
    }

    getAllUsersDetails(): Observable<UserDiamondDetail[]> {
        return this.http.get<UserDiamondDetail[]>(`${this.apiUrl}/users-details`);
    }
}
