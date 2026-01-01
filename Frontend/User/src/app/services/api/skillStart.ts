import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';

import { AuthService } from './authService';
import { CategoryBlock, CreateSkillRequest, mapSkillFromApi, mapSkillListFromApi, Skill, UpdateSkillRequest } from '../../models/skillStart';


@Injectable({
  providedIn: 'root'
})
export class SkillStartService {
  private baseUrl = `${environment.apiUrl}/Skill`;

  constructor(private http: HttpClient, private auth: AuthService) {}

  getAll(): Observable<Skill[]> {
    return this.http.get<any[]>(this.baseUrl).pipe(
      map(data => mapSkillListFromApi(data))
    );
  }

  getById(id: number): Observable<Skill> {
    return this.http.get<any>(`${this.baseUrl}/${id}`).pipe(
      map(data => mapSkillFromApi(data))
    );
  }

  getByUserId(): Observable<Skill[]> {
    const userId = this.auth.getCurrentUserId();
    if (!userId) throw new Error('User not logged in');
    return this.http.get<any[]>(`${this.baseUrl}/user/${userId}`).pipe(
      map(data => mapSkillListFromApi(data))
    );
  }

  createForCurrentUser(data: CreateSkillRequest): Observable<Skill> {
    const userId = this.auth.getCurrentUserId();
    if (!userId) throw new Error('User not logged in');
    return this.http.post<any>(`${this.baseUrl}/${userId}`, data).pipe(
      map(res => mapSkillFromApi(res))
    );
  }

  updateForCurrentUser(skillId: number, data: UpdateSkillRequest): Observable<Skill> {
    const userId = this.auth.getCurrentUserId();
    if (!userId) throw new Error('User not logged in');
    return this.http.put<any>(`${this.baseUrl}/${userId}/${skillId}`, data).pipe(
      map(res => mapSkillFromApi(res))
    );
  }

  deleteForCurrentUser(skillId: number): Observable<void> {
    const userId = this.auth.getCurrentUserId();
    if (!userId) throw new Error('User not logged in');
    return this.http.delete<void>(`${this.baseUrl}/${userId}/${skillId}`);
  }

  getCategories(): Observable<CategoryBlock[]> {
    return this.http.get<CategoryBlock[]>(`${this.baseUrl.replace('Skill','Category')}`);
  }

  addCategory(cat: { name: string }): Observable<CategoryBlock> {
    return this.http.post<CategoryBlock>(`${this.baseUrl.replace('Skill','Category')}`, cat);
  }

  deleteCategory(categoryId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl.replace('Skill','Category')}/${categoryId}`);
  }
  linkSkillToUser(userId: number, skill: Skill) {
  const dto = {
    Name: skill.name,
    GoodAtIt: skill.goodAtIt ?? 5,
    CateId: skill.cateId ?? 0
  };
  return this.http.post(`${this.baseUrl}/${userId}`, dto, { responseType: 'text' });
}

}
