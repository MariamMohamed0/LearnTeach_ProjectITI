import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class NationalIdService 
{
  private  api= `${environment.apiUrl}/UserNationalId`;
  constructor(private http: HttpClient) {}

  getPending(): Observable<any> {
    return this.http.get(`${this.api}/admin/pending`);
  }

  getById(id: number): Observable<any> {
    return this.http.get(`${this.api}/admin/${id}`);
  }

  approve(id: number): Observable<any> {
    return this.http.put(`${this.api}/admin/verify/${id}`, {});
  }

  reject(id: number, reason: string): Observable<any> {
    return this.http.put(`${this.api}/admin/reject/${id}`, {
      rejectionReason: reason,
    });
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.api}/admin/${id}`);
  }
}
