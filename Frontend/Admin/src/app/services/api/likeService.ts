// import { apiClient } from './client';
// import { Like, LikeResponse } from '../../models/like';

// export const likeService = {
//   async like(postId: number): Promise<LikeResponse> {
//     return apiClient.post<LikeResponse>(`/posts/${postId}/like`);
//   },

//   async unlike(postId: number): Promise<LikeResponse> {
//     return apiClient.delete<LikeResponse>(`/posts/${postId}/like`);
//   },

//   async getCount(postId: number): Promise<{ count: number }> {
//     return apiClient.get<{ count: number }>(`/posts/${postId}/likes/count`);
//   },

//   async isLiked(postId: number, userId: number): Promise<{ isLiked: boolean }> {
//     return apiClient.get<{ isLiked: boolean }>(`/posts/${postId}/isLiked/${userId}`);
//   },

//   async getLikes(postId: number): Promise<Like[]> {
//     return apiClient.get<Like[]>(`/posts/${postId}/likes`);
//   },
// };



// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable, map } from 'rxjs';
// import { environment } from '../../../environments/environment';
// import { Like } from '../../models/like';

// @Injectable({
//   providedIn: 'root'
// })
// export class LikeService {
//   private base = `${environment.apiUrl}/posts`;

//   constructor(private http: HttpClient) {}

//   getLikesByPost(postId: number): Observable<Like[]> {
//     return this.http.get<Like[]>(`${this.base}/${postId}/likes`);
//   }

//   likePost(postId: number, userId: number) {
//     return this.http.post(`${this.base}/${postId}/like`, { userId });
//   }

//   deleteLike(postId: number, userId: number) {
//     return this.http.delete(`${this.base}/${postId}/like`, { body: { userId } });
//   }

//   getLikesCount(postId: number): Observable<number> {
//     return this.http.get<number>(`${this.base}/${postId}/likes/count`);
//   }

//   isLiked(postId: number, userId: number): Observable<boolean> {
//     return this.http.get<boolean>(`${this.base}/${postId}/isLiked/${userId}`);
//   }
// }



import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
  Like,
  LikeCountResponse,
  CreateLikeRequest,
  DeleteLikeRequest,
  mapLikeListFromApi
} from '../../models/like';

@Injectable({
  providedIn: 'root'
})
export class LikeService {
  private base = 'https://localhost:7299/api/posts';

  constructor(private http: HttpClient) {}

  /** GET: Get all likes for a post */
  getLikesByPost(postId: number): Observable<Like[]> {
    return new Observable(observer => {
      this.http.get<any[]>(`${this.base}/${postId}/likes`).subscribe({
        next: (res) => observer.next(mapLikeListFromApi(res)),
        error: (err) => observer.error(err),
        complete: () => observer.complete()
      });
    });
  }

  /** POST: Like a post */
  like(postId: number, userId: number): Observable<any> {
    const body: CreateLikeRequest = { postId, userId };
    return this.http.post(`${this.base}/${postId}/like`, body);
  }

  /** DELETE: Unlike a post */
  unlike(postId: number, userId: number): Observable<any> {
    const body: DeleteLikeRequest = { postId, userId };

    return this.http.request('delete', `${this.base}/${postId}/like`, {
      body
    });
  }

  /** GET: Count likes of a post */
  getLikesCount(postId: number): Observable<LikeCountResponse> {
    return this.http.get<LikeCountResponse>(`${this.base}/${postId}/likes/count`);
  }

  /** GET: Check if user liked the post */
  isLiked(postId: number, userId: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.base}/${postId}/isLiked/${userId}`);
  }
}
