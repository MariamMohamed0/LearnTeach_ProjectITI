/** ===================== UserProfileService ===================== */
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, Subject, map } from 'rxjs';

import {
  UserProfile, UpdateUserProfileRequest, mapUserProfileFromApi,
  Certificate, mapCertificateFromApi,
  Post, CreatePostRequest, mapPostFromApi,
  Comment, CreateCommentRequest, mapCommentFromApi, mapCommentListFromApi,
  Like, mapLikeFromApi, mapLikeListFromApi,
  UpdatePostRequest,
  Diamond,
  UserSessionFeedback,
  mapUserSessionFeedbackFromApi
} from '../../../models/user/userProfile';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class UserProfileService {
  private baseUser = `${environment.apiUrl}/UserProfile`;
  private baseCert = `${environment.apiUrl}/Certifictes`;
  private basePost = `${environment.apiUrl}/Post`;
  private baseComment = `${environment.apiUrl}/Comments`;
  private baseLike = `${environment.apiUrl}/posts`;

  constructor(private http: HttpClient) { }

  // ===== UserProfile =====
  getAll(): Observable<UserProfile[]> {
    return this.http.get<any[]>(this.baseUser).pipe(
      map(data => data.map(mapUserProfileFromApi))
    );
  }

  getById(id: number): Observable<UserProfile> {
    return this.http.get<any>(`${this.baseUser}/${id}`).pipe(
      map(mapUserProfileFromApi)
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUser}/${id}`);
  }

  uploadProfilePicture(userId: number, file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.put<any>(`${this.baseUser}/${userId}/upload-picture`, formData);
  }

  update(id: number, data: FormData): Observable<any> {
    return this.http.put(`${this.baseUser}/${id}`, data);
  }

  // ===== Certificates =====
  getUserCertificates(userId: number): Observable<Certificate[]> {
    return this.http.get<any[]>(`${this.baseCert}/user/${userId}`).pipe(
      map(data => data.map(mapCertificateFromApi))
    );
  }

  createCertificate(userId: number, data: FormData): Observable<Certificate> {
    return this.http.post<any>(`${this.baseCert}/user/${userId}`, data).pipe(
      map(mapCertificateFromApi)
    );
  }

  updateCertificate(cerId: number, userId: number, data: FormData): Observable<Certificate> {
    return this.http.put<any>(`${this.baseCert}/${cerId}/user/${userId}`, data).pipe(
      map(mapCertificateFromApi)
    );
  }

  deleteCertificate(cerId: number, userId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseCert}/${cerId}/user/${userId}`);
  }

  // ===== Posts =====
  getAllPosts(): Observable<Post[]> {
    return this.http.get<any[]>(this.basePost).pipe(map(arr => arr.map(mapPostFromApi)));
  }

  getPostById(id: number): Observable<Post> {
    return this.http.get<any>(`${this.basePost}/${id}`).pipe(map(mapPostFromApi));
  }

  createPost(dto: CreatePostRequest): Observable<Post> {
    return this.http.post<any>(this.basePost, dto).pipe(map(mapPostFromApi));
  }

  updatePost(id: number, dto: UpdatePostRequest): Observable<Post> {
    return this.http.put<any>(`${this.basePost}/${id}`, dto).pipe(
      map(mapPostFromApi)
    );
  }

  deletePost(id: number): Observable<void> {
    return this.http.delete<void>(`${this.basePost}/${id}`);
  }
getUserPosts(userId: number): Observable<Post[]> {
  return this.http
    .get<any[]>(`${this.basePost}/user/${userId}`)
    .pipe(map(arr => arr.map(mapPostFromApi)));
}


  getPostsByCategory(categoryId: number): Observable<Post[]> {
    return this.http.get<any[]>(`${this.basePost}/GetPostsByFillter/${categoryId}`).pipe(
      map(arr => arr.map(mapPostFromApi))
    );
  }


  // ===== Comments =====
  getComments(postId: number): Observable<Comment[]> {
    return this.http.get<any[]>(`${this.baseComment}/api/posts/${postId}/comments`).pipe(
      map(mapCommentListFromApi)
    );
  }

  addComment(postId: number, dto: CreateCommentRequest): Observable<Comment> {
    return this.http.post<any>(`${this.baseComment}/api/posts/${postId}/comments`, dto).pipe(
      map(mapCommentFromApi)
    );
  }

  deleteComment(commentId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseComment}/${commentId}`);
  }

  // ===== Likes =====
    likeChanged$ = new Subject<{ postId: number, likedByUser: boolean, totalLiked: number }>();

  getLikes(postId: number): Observable<Like[]> {
    return this.http.get<any[]>(`${this.baseLike}/api/posts/${postId}/likes`).pipe(
      map(mapLikeListFromApi)
    );
  }

  // addLike(postId: number, userId: number): Observable<any> {
  //   return this.http.post(`${this.baseLike}/api/posts/${postId}/like?userId=${userId}`, {});
  // }

  // removeLike(postId: number, userId: number): Observable<any> {
  //   return this.http.delete(`${this.baseLike}/api/posts/${postId}/like?userId=${userId}`);
  // }
// addLike(postId: number, userId: number): Observable<any> {
//   return this.http.post(`${this.baseLike}/api/posts/${postId}/like`, { userId });
// }

// removeLike(postId: number, userId: number): Observable<any> {
//   return this.http.request('delete', `${this.baseLike}/api/posts/${postId}/like`, { body: { userId } });
// }

//   getLikesCount(postId: number): Observable<number> {
//     return this.http.get<number>(`${this.baseLike}/api/posts/${postId}/likes/count`);
//   }

//   isLikedByUser(postId: number, userId: number): Observable<boolean> {
//     return this.http.get<boolean>(`${this.baseLike}/api/posts/${postId}/isLiked/${userId}`);
//   }
addLike(postId: number, userId: number): Observable<any> {
  return this.http.post(
    `${this.baseLike}/${postId}/like`,
    { userId }, // body
    { headers: { 'Content-Type': 'application/json' } } // مهم جدًا
  );
}


removeLike(postId: number, userId: number): Observable<any> {
  return this.http.request(
    'delete',
    `${this.baseLike}/${postId}/like`,
    { 
      body: { userId },
      headers: { 'Content-Type': 'application/json' } // مهم جدًا
    }
  );
}


  isLiked(postId: number, userId: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseLike}/${postId}/isLiked/${userId}`);
  }

  getLikesCount(postId: number): Observable<number> {
    return this.http.get<number>(`${this.baseLike}/${postId}/likes/count`);
  }

  private apiUrl = environment.apiUrl + '/Diamond';

  getUserPoints(userId: number): Observable<Diamond> {
    return this.http.get<Diamond>(`${this.apiUrl}/user/${userId}`);
  }


  //Maysoon
  // ===== UserSessionFeedback / My Rating =====
  getMyRating(): Observable<{ userId: number; rating: number; badge: string; badgeUrl: string }> {
    return this.http.get<{ userId: number; rating: number; badge: string; badgeUrl: string }>(
      `${environment.apiUrl}/UserSessionFeedback/my-rating`,
      this.getAuthHeaders() // <-- pass headers here
    );
  }

  // Helper to include Authorization header
  private getAuthHeaders(): { headers: HttpHeaders } {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return { headers };
  }

  getUserRating(userId: number): Observable<{ userId: number; rating: number; badge: string; badgeUrl: string }> {
    return this.http.get<{ userId: number; rating: number; badge: string; badgeUrl: string }>(
      `${environment.apiUrl}/UserSessionFeedback/user/${userId}`
    );
}





getMyReceivedFeedbacks(): Observable<UserSessionFeedback[]> {
  return this.http
    .get<any[]>(`${environment.apiUrl}/UserSessionFeedback/my-feedbacks`, this.getAuthHeaders())
    .pipe(map(arr => arr.map(mapUserSessionFeedbackFromApi)));
}


getReceivedFeedbacks(userId: number): Observable<UserSessionFeedback[]> {
  return this.http
    .get<any[]>(`${environment.apiUrl}/UserSessionFeedback/received/${userId}`)
    .pipe(map(arr => arr.map(mapUserSessionFeedbackFromApi)));
}
getReceivedFeedbacksuser(userId: number): Observable<UserSessionFeedback[]> {
  return this.http
    .get<any[]>(`${environment.apiUrl}/UserSessionFeedback/feedbacksById`, {
      params: { userId: userId.toString() } // تمرير الـ query param
    })
    .pipe(map(arr => arr.map(mapUserSessionFeedbackFromApi)));
}


}
