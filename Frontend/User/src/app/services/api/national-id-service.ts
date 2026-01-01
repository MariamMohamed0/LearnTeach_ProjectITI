import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface UserNationalId {
  id: number;
  userId: number;
  userName: string;
  frontPic: string;
  backPic: string;
  selfieWithId: string;
  isVerified: boolean;
  verificationStatus: 'Pending' | 'Approved' | 'Rejected' | string;
  submittedAt: string; // ISO string
  reviewedAt: string | null;
  rejectionReason?: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class NationalIdService {
  private baseUrl = `${environment.apiUrl}/UserNationalId`;

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): { headers: HttpHeaders } {
    // const token = localStorage.getItem('accessToken');
     const token = localStorage.getItem("token");
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token || ''}`,
    });
    return { headers };
  }

  create(dto: FormData): Observable<UserNationalId> {
    return this.http.post<UserNationalId>(this.baseUrl, dto, this.getAuthHeaders());
  }

  getMyNationalId(): Observable<UserNationalId> {
    return this.http.get<UserNationalId>(`${this.baseUrl}/me`, this.getAuthHeaders());
  }

  update(dto: FormData): Observable<UserNationalId> {
    return this.http.put<UserNationalId>(this.baseUrl, dto, this.getAuthHeaders());
  }

  getStatus(): Observable<{
    userId: number;
    isVerified: boolean;
    verificationStatus: string;
    submittedAt: string;
    reviewedAt: string | null;
    rejectionReason?: string | null;
  }> {
    return this.http.get<{
      userId: number;
      isVerified: boolean;
      verificationStatus: string;
      submittedAt: string;
      reviewedAt: string | null;
      rejectionReason?: string | null;
    }>(`${this.baseUrl}/status`, this.getAuthHeaders());
  }
  //mariam 
getVerificationStatus(): Observable<{ isVerified: boolean }> {
  return this.http.get<{ isVerified: boolean }>(`${this.baseUrl}/status`, this.getAuthHeaders());
}

  //mariam
}
