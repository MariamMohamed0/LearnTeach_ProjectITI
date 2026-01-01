import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
  Like,
  LikeCountResponse,
  CreateLikeRequest,
  DeleteLikeRequest,
  mapLikeListFromApi
} from '../../../models/user/like';
import { environment } from '../../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class LikeService {
  private base = `${environment.apiUrl}/posts`;

  constructor(private http: HttpClient) {}


  getLikesByPost(postId: number): Observable<Like[]> {
    return new Observable(observer => {
      this.http.get<any[]>(`${this.base}/${postId}/likes`).subscribe({
        next: (res) => observer.next(mapLikeListFromApi(res)),
        error: (err) => observer.error(err),
        complete: () => observer.complete()
      });
    });
  }


  like(postId: number, userId: number): Observable<any> {
    const body: CreateLikeRequest = { postId, userId };
    return this.http.post(`${this.base}/${postId}/like`, body);
  }
//   like(postId: number, userId: number): Observable<any> {
//   return this.http.post(${this.base}/${postId}/like?userId=${userId}, {});
// }



  unlike(postId: number, userId: number): Observable<any> {
    const body: DeleteLikeRequest = { postId, userId };

    return this.http.request('delete', `${this.base}/${postId}/like`, {
      body
    });
  }
//   unlike(postId: number, userId: number): Observable<any> {
//   return this.http.delete(`${this.base}/${postId}/like?userId=${userId}`);
// }



  getLikesCount(postId: number): Observable<LikeCountResponse> {
    return this.http.get<LikeCountResponse>(`${this.base}/${postId}/likes/count`);
  }


  isLiked(postId: number, userId: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.base}/${postId}/isLiked/${userId}`);
  }
}