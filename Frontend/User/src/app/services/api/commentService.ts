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


  getAll(): Observable<Comment[]> {
    return this.http.get<any[]>(`${this.base}/Comments`)
      .pipe(map(mapCommentListFromApi));
  }

  getById(id: number): Observable<Comment> {
    return this.http.get<any>(`${this.base}/Comments/${id}`)
      .pipe(map(mapCommentFromApi));
  }


  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/Comments/${id}`);
  }


  update(id: number, body: UpdateCommentRequest): Observable<Comment> {
    return this.http.put<any>(`${this.base}/Comments/${id}`, body)
      .pipe(map(mapCommentFromApi));
  }


  getByPost(postId: number): Observable<Comment[]> {
    return this.http.get<any[]>(`${this.base}/posts/${postId}/comments`)
      .pipe(map(mapCommentListFromApi));
  }


create(postId: number, body: CreateCommentRequest): Observable<Comment> {
    return this.http.post<any>(`${this.base}/posts/${postId}/comments`, body)
      .pipe(map(mapCommentFromApi));
  }
}
