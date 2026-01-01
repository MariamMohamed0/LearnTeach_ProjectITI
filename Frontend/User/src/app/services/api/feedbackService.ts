import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { UserSessionFeedback, CreateFeedbackRequest, UpdateFeedbackRequest, FeedbackStats, mapFeedbackFromApi, mapFeedbackListFromApi } from '../../models/feedback';

@Injectable({
providedIn: 'root',
})
export class FeedbackService {
private baseUrl = `${environment.apiUrl}/UserSessionFeedback`;

constructor(private http: HttpClient) {}

getAll(): Observable<UserSessionFeedback[]> {
return this.http.get<any[]>(this.baseUrl).pipe(
map(data => mapFeedbackListFromApi(data))
);
}

getById(id: number): Observable<UserSessionFeedback> {
return this.http.get<any>(`${this.baseUrl}/${id}`).pipe(
map(data => mapFeedbackFromApi(data))
);
}

getByUserId(userId: number): Observable<UserSessionFeedback[]> {
return this.http.get<any[]>(`${this.baseUrl}/user/${userId}`).pipe(
map(data => mapFeedbackListFromApi(data))
);
}

getBySessionId(sessionId: number): Observable<UserSessionFeedback[]> {
return this.http.get<any[]>(`${this.baseUrl}/session/${sessionId}`).pipe(
map(data => mapFeedbackListFromApi(data))
);
}

getStats(userId: number): Observable<FeedbackStats> {
return this.http.get<FeedbackStats>(`${this.baseUrl}/stats/${userId}`);
}

create(data: CreateFeedbackRequest): Observable<UserSessionFeedback> {
return this.http.post<any>(this.baseUrl, data).pipe(
map(data => mapFeedbackFromApi(data))
);
}

update(id: number, data: UpdateFeedbackRequest): Observable<UserSessionFeedback> {
return this.http.put<any>(`${this.baseUrl}/${id}`, data).pipe(
map(data => mapFeedbackFromApi(data))
);
}

delete(id: number): Observable<void> {
return this.http.delete<void>(`${this.baseUrl}/${id}`);
}
}
