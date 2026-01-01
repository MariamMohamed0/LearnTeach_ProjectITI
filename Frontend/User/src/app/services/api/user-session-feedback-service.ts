import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface UserSessionFeedbackDto  {
  feedbackId: number;
  ratingValue: number;
  comment: string;
  ratedByUserId: number;
  ratedByUserName: string;
  ratedToUserId: number;
  ratedToUserName: string;
  sessionId: number;
  createdAt?: string;
}

@Injectable({
  providedIn: 'root'
})


export class UserSessionFeedbackService {
  private apiUrl =`${environment.apiUrl}/UserSessionFeedback`;

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): { headers: HttpHeaders } {
    // const token = localStorage.getItem('accessToken');
      const token = localStorage.getItem("token");
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    return { headers };
  }

  createFeedback(feedback: any): Observable<UserSessionFeedbackDto> {
    return this.http.post<UserSessionFeedbackDto>(
      this.apiUrl,
      feedback,
      this.getAuthHeaders()
    );
  }

  updateFeedback(feedbackId: number, feedback: any): Observable<void> {
    return this.http.put<void>(
      `${this.apiUrl}/${feedbackId}`,
      feedback,
      this.getAuthHeaders()
    );
  }

  deleteFeedback(feedbackId: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${feedbackId}`,
      this.getAuthHeaders()
    );
  }

  getSessionFeedbacks(sessionId: number): Observable<UserSessionFeedbackDto[]> {
    return this.http.get<UserSessionFeedbackDto[]>(
      `${this.apiUrl}/session/${sessionId}`,
      this.getAuthHeaders()
    );
  }
}
