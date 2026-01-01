// src/app/services/category.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Category, CreateCategoryRequest, mapCategoryFromApi, mapCategoryListFromApi, UpdateCategoryRequest } from '../../models/category';


@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private baseUrl = `${environment.apiUrl}/Category`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Category[]> {
    return this.http.get<any[]>(this.baseUrl).pipe(
      map(data => mapCategoryListFromApi(data))
    );
  }

  getById(id: number): Observable<Category> {
    return this.http.get<any>(`${this.baseUrl}/${id}`).pipe(
      map(data => mapCategoryFromApi(data))
    );
  }

  create(data: CreateCategoryRequest): Observable<Category> {
    return this.http.post<any>(this.baseUrl, data).pipe(
      map(res => mapCategoryFromApi(res))
    );
  }

  update(id: number, data: UpdateCategoryRequest): Observable<Category> {
    return this.http.put<any>(`${this.baseUrl}/${id}`, data).pipe(
      map(res => mapCategoryFromApi(res))
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}