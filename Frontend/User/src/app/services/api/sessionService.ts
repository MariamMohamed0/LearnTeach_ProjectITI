import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Session, Skill, User } from '../../models/session';
import { environment } from '../../../environments/environment';
import { PaginatedResponse } from '../../models/paginated';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  private apiUrl = `${environment.apiUrl}/sessions`;
  private userApiUrl = `${environment.apiUrl}/sessions/users`;
  private skillApiUrl = `${environment.apiUrl}/sessions/skills`;

  constructor(private http: HttpClient) {}

  // Helper to include Authorization header
  private getAuthHeaders(): { headers: HttpHeaders } {
    // const token = localStorage.getItem('accessToken');
     const token = localStorage.getItem("token");
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return { headers };
  }

  // Get sessions of current user, optionally filtered by role
  // getMySessions(role?: string): Observable<Session[]> {
  //   const query = role ? `?role=${role}` : '';
  //   return this.http.get<Session[]>(`${this.apiUrl}/me${query}`, this.getAuthHeaders());
  // }
 getMySessions(role?: string, pageNumber: number = 1, pageSize: number = 2): Observable<PaginatedResponse<Session>> {
  let params = new URLSearchParams();
  if (role) params.append('role', role);
  params.append('pageNumber', pageNumber.toString());
  params.append('pageSize', pageSize.toString());

  const url = `${this.apiUrl}/me?${params.toString()}`;
  return this.http.get<PaginatedResponse<Session>>(url, this.getAuthHeaders());
}



  // Get all users (learners)
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.userApiUrl, this.getAuthHeaders());
  }

  // Get all skills
  getAllSkills(): Observable<Skill[]> {
    return this.http.get<Skill[]>(this.skillApiUrl, this.getAuthHeaders());
  }

  // Create a new session (Teacher only)
  createSession(dto: any): Observable<Session> {
    return this.http.post<Session>(`${this.apiUrl}/create`, dto, this.getAuthHeaders());
  }

  // Join a session (returns Zoom URL)
  // joinSession(sessionId: number): Observable<any> {
  //   return this.http.get(`${this.apiUrl}/${sessionId}/join`, this.getAuthHeaders());
  // }
  joinSession(sessionId: number): Observable<{ joinUrl: string }> {
  return this.http.get<{ joinUrl: string }>(`${this.apiUrl}/${sessionId}/join`, this.getAuthHeaders());
}



  // Update session (Teacher only)
  updateSession(id: number, updated: any): Observable<Session> {
    return this.http.put<Session>(`${this.apiUrl}/edit/${id}`, updated, this.getAuthHeaders());
  }

  // Delete session (Teacher only)
  deleteSession(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${id}`, this.getAuthHeaders());
  }
}
