import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/Authentication`; // الرابط يعتمد على environment

  constructor(private http: HttpClient) {}

  // جلب جميع الحسابات المعلقة للموافقة
  getPendingAdmins(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/PendingAdmins`);
  }

  // الموافقة على حساب Admin
  approveAdmin(userId: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/ApproveAdmin/${userId}`, {});
  }

  // رفض حساب Admin
  rejectAdmin(userId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/RejectAdmin/${userId}`);
  }
}
