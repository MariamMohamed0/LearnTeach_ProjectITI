// src/app/services/api/post.service.ts

// import { Injectable } from '@angular/core';
// import { HttpClient, HttpParams } from '@angular/common/http';
// import { Observable, Subject, map } from 'rxjs';
// import { environment } from '../../../environments/environment';
// import { Post, mapPostFromApi } from '../../models/post';

// export interface PaginatedResponse<T> {
//   items: T[];
//   page: number;
//   pageSize: number;
//   total?: number;
// }

// @Injectable({ providedIn: 'root' })
// export class PostService {
//   private base =` ${environment.apiUrl}/Post`;

//   private postsUpdated = new Subject<Post>();
//   public postsUpdated$ = this.postsUpdated.asObservable();


//   constructor(private http: HttpClient) {}

//   getAll(page = 1, pageSize = 10, search = ''): Observable<PaginatedResponse<Post>> {
//     let params = new HttpParams().set('page', String(page)).set('pageSize', String(pageSize));
//     if (search) params = params.set('search', search);

//     return this.http.get<any>(this.base, { params }).pipe(
//       map(res => {
//         const itemsRaw = Array.isArray(res) ? res : res.items ?? res.data ?? [];
//         const items = Array.isArray(itemsRaw) ? itemsRaw.map(mapPostFromApi) : [];
//         const total = res.total ?? res.count ?? items.length;
//         return { items, page: res.page ?? page, pageSize: res.pageSize ?? pageSize, total };
//       })
//     );
//   }

//   getById(id: number) {
//     return this.http.get<any>(`${this.base}/${id}`).pipe(map(mapPostFromApi));
//   }

  


//   create(data: { Content: string; SkillId?: number | null; Medias?: any[] }) {
//     return this.http.post<any>(this.base, data).pipe(
//       map(mapPostFromApi),
//       map((created: Post) => {
//         // بث البوست الجديد
        
//         this.postsUpdated.next(created);
//         return created;
//       })
//     );
//   }

//   update(id: number, data: any) {
//     return this.http.put<any>(`${this.base}/${id}`, data).pipe(map(mapPostFromApi));
//   }

//   delete(id: number) {
//     return this.http.delete<void>(`${this.base}/${id}`);
//   }

//   getByUserId(userId: number) {
//     return this.http.get<any[]>(`${this.base}/user/${userId}`).pipe(map(arr => Array.isArray(arr) ? arr.map(mapPostFromApi) : []));
//   }
//   getUserPosts(userId: number): Observable<Post[]> {
//   return this.http
//     .get<any[]>(`${this.base}/user/${userId}`)
//     .pipe(map(arr => arr.map(mapPostFromApi)));
// }

// filterPostsByCategory(categoryId: number): Observable<any> {
// return this.http.get(`${this.base}/GetPostsByFillter/${categoryId}`);
// }

// }



// src/app/services/api/post.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, Subject, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Post, mapPostFromApi } from '../../models/post';

export interface PaginatedResponse<T> {
  items: T[];
  page: number;
  pageSize: number;
  total?: number;
}

@Injectable({ providedIn: 'root' })
export class PostService {
  private base = `${environment.apiUrl}/Post`;

  private postsUpdated = new Subject<Post>();
  public postsUpdated$ = this.postsUpdated.asObservable();

  constructor(private http: HttpClient) {}

  // عدلت getAll عشان يقبل categoryId كـ optional parameter
  // لو categoryId موجود، هيضيف فلتر في الـ params (افترض إن الـ API بتدعم query param اسمه categoryId)
  getAll(page = 1, pageSize = 10, search = '', categoryId?: number | null): Observable<PaginatedResponse<Post>> {
    let params = new HttpParams()
      .set('page', String(page))
      .set('pageSize', String(pageSize));
    
    if (search) params = params.set('search', search);
    if (categoryId !== null && categoryId !== undefined) params = params.set('categoryId', String(categoryId));  // إضافة الفلتر هنا

    return this.http.get<any>(this.base, { params }).pipe(
      map(res => {
        const itemsRaw = Array.isArray(res) ? res : res.items ?? res.data ?? [];
        const items = Array.isArray(itemsRaw) ? itemsRaw.map(mapPostFromApi) : [];
        const total = res.total ?? res.count ?? items.length;
        return { items, page: res.page ?? page, pageSize: res.pageSize ?? pageSize, total };
      })
    );
  }

  getById(id: number) {
    return this.http.get<any>(`${this.base}/${id}`).pipe(map(mapPostFromApi));
  }

  // create(data: any) {
  //   return this.http.post<any>(this.base, data).pipe(map(mapPostFromApi));
  // }

  // create(data: { Content: string; SkillId?: number | null; Medias?: any[] }) {
  //   return this.http.post<any>(this.base, data).pipe(
  //     map(mapPostFromApi),
  //     map((created: Post) => {
  //       // بث البوست الجديد
  //       this.postsUpdated.next(created);
  //       return created;
  //     })
  //   );
  // }


//   create(data: { content: string; skillId?: number | null; categoryId?: number | null; Medias?: { MediaUrl: string; EntityType: string }[]; userId: number }) {
//   return this.http.post<any>(this.base, data).pipe(
//     map(mapPostFromApi),
//     map((created: Post) => {
//       // بث البوست الجديد
//       this.postsUpdated.next(created);
//       return created;
//     })
//   );
// }


create(data: FormData): Observable<Post> {
    return this.http.post<any>(this.base, data).pipe(
      map(mapPostFromApi),
      map((created: Post) => {
        this.postsUpdated.next(created);
        return created;
      })
    );
  }


  update(id: number, data: any) {
    return this.http.put<any>(`${this.base}/${id}`, data).pipe(map(mapPostFromApi));
  }

  // delete(id: number) {
  //   return this.http.delete<void>(`${this.base}/${id}`);
  // }
  delete(id: number, userId: number): Observable<any> {
       const params = new HttpParams().set('userId', String(userId));  // في query params
       return this.http.delete(`${this.base}/${id}`, { params });
     }
     

  getByUserId(userId: number) {
    return this.http.get<any[]>(`${this.base}/user/${userId}`).pipe(map(arr => Array.isArray(arr) ? arr.map(mapPostFromApi) : []));
  }

  getUserPosts(userId: number): Observable<Post[]> {
    return this.http
      .get<any[]>(`${this.base}/user/${userId}`)
      .pipe(map(arr => arr.map(mapPostFromApi)));
  }

  filterPostsByCategory(categoryId: number): Observable<PaginatedResponse<Post>> {
    return this.http.get<any>(`${this.base}/GetPostsByFillter/${categoryId}`).pipe(
      map(res => {
        const itemsRaw = Array.isArray(res) ? res : res.items ?? res.data ?? [];
        const items = Array.isArray(itemsRaw) ? itemsRaw.map(mapPostFromApi) : [];
        const total = res.total ?? res.count ?? items.length;
        return { items, page: 1, pageSize: items.length, total };  // افترض pagination بسيط لو مش موجود
      })
    );
  }
}
