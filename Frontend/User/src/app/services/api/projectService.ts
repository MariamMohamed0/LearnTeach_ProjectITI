import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Project, mapProjectFromApi, mapProjectListFromApi, CreateProjectRequest, UpdateProjectRequest } from '../../models/project';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private baseUrl = `${environment.apiUrl}/Projects`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Project[]> {
    return this.http.get<any[]>(this.baseUrl).pipe(
      map(res => mapProjectListFromApi(res))
    );
  }

  getByUserId(userId: number): Observable<Project[]> {
    return this.http.get<any[]>(`${this.baseUrl}/user/${userId}`).pipe(
      map(res => mapProjectListFromApi(res))
    );
  }

  create(data: CreateProjectRequest): Observable<Project> {
    return this.http.post<any>(this.baseUrl, data).pipe(
      map(res => mapProjectFromApi(res))
    );
  }

  update(id: number, data: UpdateProjectRequest): Observable<Project> {
    return this.http.put<any>(`${this.baseUrl}/${id}`, data).pipe(
      map(res => mapProjectFromApi(res))
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
