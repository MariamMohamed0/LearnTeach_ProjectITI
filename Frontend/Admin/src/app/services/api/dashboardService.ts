import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import { environment } from '../../../environments/environment';
import { CategoryDto, CommentDto, LikeDto, PackageDto, PostDto, SessionDto, SkillDto, UserProfile, UserSessionFeedback } from '../../models/dashboard';


@Injectable({
  providedIn: 'root',
})
export class DashboardService {
    private baseUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) {}

 getUserCount(): Observable<number> {
    return this.http.get<UserProfile[]>(`${this.baseUrl}/UserProfile`).pipe(map(users => users.length));
  }

  getPostCount(): Observable<number> {
    return this.http.get<PostDto[]>(`${this.baseUrl}/Post`).pipe(map(posts => posts.length));
  }

  getCommentCount(): Observable<number> {
    return this.http.get<CommentDto[]>(`${this.baseUrl}/Comment`).pipe(map(comments => comments.length));
  }

  getLikeCount(): Observable<number> {
    return this.http.get<LikeDto[]>(`${this.baseUrl}/Like`).pipe(map(likes => likes.length));
  }

  getSkillCount(): Observable<number> {
    return this.http.get<SkillDto[]>(`${this.baseUrl}/Skill`).pipe(map(skills => skills.length));
  }

  getSessionCount(): Observable<number> {
    return this.http.get<SessionDto[]>(`${this.baseUrl}/Session`).pipe(map(sessions => sessions.length));
  }

  getCategoryCount(): Observable<number> {
    return this.http.get<CategoryDto[]>(`${this.baseUrl}/Category`).pipe(map(categories => categories.length));
  }

  getPackageCount(): Observable<number> {
    return this.http.get<PackageDto[]>(`${this.baseUrl}/Package`).pipe(map(packages => packages.length));
  }
   getAllFeedbacks(): Observable<UserSessionFeedback[]> {
    return this.http.get<UserSessionFeedback[]>(this.baseUrl);
  }

  // جلب آخر 5 feedbacks (مثلاً للـ card)
  getRecentFeedbacks(): Observable<UserSessionFeedback[]> {
    return this.http.get<UserSessionFeedback[]>(this.baseUrl);
  }

  // جلب feedbacks حسب user معين
  getFeedbacksByUser(userId: number): Observable<UserSessionFeedback[]> {
    return this.http.get<UserSessionFeedback[]>(`${this.baseUrl}/user/${userId}`);
  }

  // إنشاء feedback جديد
  createFeedback(feedback: Partial<UserSessionFeedback>): Observable<UserSessionFeedback> {
    return this.http.post<UserSessionFeedback>(this.baseUrl, feedback);
  }

  // تعديل feedback موجود
  updateFeedback(feedbackId: number, feedback: Partial<UserSessionFeedback>): Observable<UserSessionFeedback> {
    return this.http.put<UserSessionFeedback>(`${this.baseUrl}/${feedbackId}`, feedback);
  }

  // حذف feedback
  deleteFeedback(feedbackId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${feedbackId}`);
  }
}
