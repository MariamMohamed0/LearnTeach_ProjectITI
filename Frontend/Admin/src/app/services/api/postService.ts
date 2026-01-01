// import { apiClient } from './client';
// import { Post, CreatePostRequest, UpdatePostRequest } from '../../models/post';
// import { PaginatedResponse } from '../../models/common';

// export const postService = {
//   async getAll(page = 1, pageSize = 10, search = ''): Promise<PaginatedResponse<Post>> {
//     const params = new URLSearchParams({
//       page: page.toString(),
//       pageSize: pageSize.toString(),
//       ...(search && { search }),
//     });
//     return apiClient.get<PaginatedResponse<Post>>(`/Post?${params}`);
//   },

//   async getById(id: number): Promise<Post> {
//     return apiClient.get<Post>(`/Post/${id}`);
//   },

//   async getByUserId(userId: number): Promise<Post[]> {
//     return apiClient.get<Post[]>(`/Post/user/${userId}`);
//   },

//   async create(data: CreatePostRequest): Promise<Post> {
//     return apiClient.post<Post>('/Post', data);
//   },

//   async update(id: number, data: UpdatePostRequest): Promise<Post> {
//     return apiClient.put<Post>(`/Post/${id}`, data);
//   },

//   async delete(id: number): Promise<void> {
//     return apiClient.delete<void>(`/Post/${id}`);
//   },
// };


// src/app/core/services/post.service.ts
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { mapPostFromApi } from '../../models/post';

import { Post, CreatePostRequest, UpdatePostRequest, PaginatedResponse } from '../../models/post';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private base = `${environment.apiUrl}/Post`;

  constructor(private http: HttpClient) {}

  // expects backend supports page,pageSize,search query params
  getAll(page = 1, pageSize = 10, search = ''): Observable<PaginatedResponse<Post>> {
    let params = new HttpParams()
      .set('page', String(page))
      .set('pageSize', String(pageSize));
    if (search) params = params.set('search', search);

    return this.http.get<any>(this.base, { params }).pipe(
      map((res) => {
        // attempt to detect paginated shape; adapt if backend differs
        // If backend returns array directly:
        if (Array.isArray(res)) {
          const items = res.map(mapPostFromApi);
          return { items, page, pageSize, total: items.length } as PaginatedResponse<Post>;
        }

        // If backend returns { items, page, pageSize, total } or similar
        const itemsRaw = res.items ?? res.data ?? res;
        const items = Array.isArray(itemsRaw) ? itemsRaw.map(mapPostFromApi) : [];
        const total = res.total ?? res.count ?? (Array.isArray(itemsRaw) ? itemsRaw.length : undefined);
        return { items, page: res.page ?? page, pageSize: res.pageSize ?? pageSize, total } as PaginatedResponse<Post>;
      })
    );
  }

  getById(id: number) {
    return this.http.get<any>(`${this.base}/${id}`).pipe(map(mapPostFromApi));
  }

  getByUserId(userId: number) {
    return this.http.get<any>(`${this.base}/user/${userId}`).pipe(
      map((arr: any[]) => (Array.isArray(arr) ? arr.map(mapPostFromApi) : []))
    );
  }

  create(data: any) {
    // adapt to CreatePostDto shape; example uses { Content, SkillId, PostType, Medias }
    return this.http.post<any>(this.base, data).pipe(map(mapPostFromApi));
  }

  update(id: number, data: any) {
    return this.http.put<any>(`${this.base}/${id}`, data).pipe(map(mapPostFromApi));
  }

  delete(id: number) {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}

