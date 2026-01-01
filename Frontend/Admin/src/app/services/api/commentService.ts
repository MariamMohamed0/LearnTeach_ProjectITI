// import { apiClient } from './client';
// import { Comment, CreateCommentRequest, UpdateCommentRequest } from '../../models/comment';

// export const commentService = {
//   async getAll(): Promise<Comment[]> {
//     return apiClient.get<Comment[]>('/Comments');
//   },

//   async getById(id: number): Promise<Comment> {
//     return apiClient.get<Comment>(`/Comments/${id}`);
//   },

//   async getByPostId(postId: number): Promise<Comment[]> {
//     return apiClient.get<Comment[]>(`/posts/${postId}/comments`);
//   },

//   async create(postId: number, data: CreateCommentRequest): Promise<Comment> {
//     return apiClient.post<Comment>(`/posts/${postId}/comments`, data);
//   },

//   async update(id: number, data: UpdateCommentRequest): Promise<Comment> {
//     return apiClient.put<Comment>(`/Comments/${id}`, data);
//   },

//   async delete(id: number): Promise<void> {
//     return apiClient.delete<void>(`/Comments/${id}`);
//   },
// };



import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';

import {
  Comment,
  CreateCommentRequest,
  UpdateCommentRequest,
  mapCommentFromApi,
  mapCommentListFromApi
} from '../../models/comment';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  private base = `${environment.apiUrl}`;

  constructor(private http: HttpClient) {}

  /** ================================
   *  ✔️ 1) Get all comments (admin)
   *  GET /api/Comments
   * ================================= */
  getAll(): Observable<Comment[]> {
    return this.http.get<any[]>(`${this.base}/Comments`)
      .pipe(map(mapCommentListFromApi));
  }

  /** ================================
   *  ✔️ 2) Get comment by ID
   *  GET /api/Comments/{id}
   * ================================= */
  getById(id: number): Observable<Comment> {
    return this.http.get<any>(`${this.base}/Comments/${id}`)
      .pipe(map(mapCommentFromApi));
  }

  /** ================================
   *  ✔️ 3) Delete comment
   *  DELETE /api/Comments/{id}
   * ================================= */
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/Comments/${id}`);
  }

  /** ================================
   * ✔️ 4) Update comment
   * PUT /api/Comments/{id}
   * ================================= */
  update(id: number, body: UpdateCommentRequest): Observable<Comment> {
    return this.http.put<any>(`${this.base}/Comments/${id}`, body)
      .pipe(map(mapCommentFromApi));
  }

  /** =====================================
   *  ✔️ 5) Get comments of a post
   *  GET /api/posts/{postId}/comments
   * ====================================== */
  getByPost(postId: number): Observable<Comment[]> {
    return this.http.get<any[]>(`${this.base}/posts/${postId}/comments`)
      .pipe(map(mapCommentListFromApi));
  }

  /** =====================================
   *  ✔️ 6) Add new comment to a post
   *  POST /api/posts/{postId}/comments
   * ====================================== */
  create(postId: number, body: CreateCommentRequest): Observable<Comment> {
    return this.http.post<any>(`${this.base}/posts/${postId}/comments`, body)
      .pipe(map(mapCommentFromApi));
  }
}

