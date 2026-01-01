import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Package } from '../../models/package';
import { PaymentInitiateDto, PaymentHistoryDto } from '../../models/payment';

@Injectable({ providedIn: 'root' })
export class PaymentService {
  private baseUrl = `${environment.apiUrl}/payment`;

  constructor(private http: HttpClient) { }

  getPackageById(packageId: number): Observable<Package> {
    return this.http.get<Package>(`${environment.apiUrl}/package/${packageId}`);
  }

  // بدء الدفع
  initiatePayment(dto: PaymentInitiateDto): Observable<PaymentHistoryDto> {
    return this.http.post<PaymentHistoryDto>(`${this.baseUrl}/initiate`, dto);
  }

  // شراء باقة بعد الدفع
  purchasePackage(dto: { userId: number; packageId: number }): Observable<any> {
    return this.http.post(`${environment.apiUrl}/package/purchase`, dto);
  }
}
