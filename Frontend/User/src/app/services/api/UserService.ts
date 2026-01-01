import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Certificate, mapCertificateFromApi } from '../../models/userProfile';



@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/Authentication`; 

  constructor(private http: HttpClient) {}

  getPendingAdmins(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/PendingAdmins`);
  }

  approveAdmin(userId: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/ApproveAdmin/${userId}`, {});
  }

  rejectAdmin(userId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/RejectAdmin/${userId}`);
  }
  getUserCertificates(userId: number): Observable<Certificate[]> {
      return this.http.get<any[]>(`${this.apiUrl}/user/${userId}`).pipe(
        map(data => data.map(mapCertificateFromApi))
      );
    }
  
    createCertificate(userId: number, data: FormData): Observable<Certificate> {
      return this.http.post<any>(`${this.apiUrl}/user/${userId}`, data).pipe(
        map(mapCertificateFromApi)
      );
    }
  
    updateCertificate(cerId: number, userId: number, data: FormData): Observable<Certificate> {
      return this.http.put<any>(`${this.apiUrl}/${cerId}/user/${userId}`, data).pipe(
        map(mapCertificateFromApi)
      );
    }
  
    deleteCertificate(cerId: number, userId: number): Observable<void> {
      return this.http.delete<void>(`${this.apiUrl}/${cerId}/user/${userId}`);
    }
}
