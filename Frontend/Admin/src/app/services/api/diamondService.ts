// src/app/services/diamond.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Diamond, DiamondPackage, PurchaseDiamondPackage } from '../../models/diamond';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DiamondService {
  private apiUrl = `${environment.apiUrl}/diamond`; // رابط الـ API من environment

  constructor(private http: HttpClient) { }

  // Get all packages
  getPackages(): Observable<DiamondPackage[]> {
    return this.http.get<DiamondPackage[]>(`${this.apiUrl}/packages`);
  }

  // Purchase package
  purchasePackage(payload: PurchaseDiamondPackage): Observable<any> {
    return this.http.post(`${this.apiUrl}/package/purchase`, payload);
  }

  // Get user points
  getUserPoints(userId: number): Observable<Diamond> {
    return this.http.get<Diamond>(`${this.apiUrl}/user/${userId}`);
  }
}
