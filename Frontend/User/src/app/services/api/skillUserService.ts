import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Skill, CreateSkillRequest, UpdateSkillRequest, mapSkillFromApi, mapSkillListFromApi, CategoryBlock } from '../../models/skillStart';

@Injectable({
  providedIn: 'root'
})
export class SkillService {
private baseUrl = `${environment.apiUrl}/Skill`;

constructor(private http: HttpClient) {}

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

getByUserId(userId: number): Observable<Skill[]> {
return this.http.get<any[]>(`${this.baseUrl}/user/${userId}`).pipe(
map(data => mapSkillListFromApi(data))
);
}

create(data: CreateSkillRequest): Observable<Skill> {
return this.http.post<any>(this.baseUrl, data).pipe(
map(res => mapSkillFromApi(res))
);
}

update(skillId: number, data: UpdateSkillRequest): Observable<Skill> {
return this.http.put<any>(`${this.baseUrl}/${skillId}`, data).pipe(
map(res => mapSkillFromApi(res))
);
}

delete(skillId: number): Observable<void> {
return this.http.delete<void>(`${this.baseUrl}/${skillId}`);
}

getAllUserSkills(): Observable<Skill[]> {
return this.http.get<any[]>(`${this.baseUrl}/user-skills`).pipe(
map(data => mapSkillListFromApi(data))
);
}

deleteUserSkill(userId: number, skillId: number): Observable<void> {
return this.http.delete<void>(`${this.baseUrl}/${skillId}/${userId}`);
}

linkSkillToUser(userId: number, skill: Skill) {
  return this.http.post(`${this.baseUrl}/${userId}`, {
    name: skill.name,
    goodAtIt: skill.goodAtIt ?? 5,
    cateId: skill.cateId ?? 0
  }, { responseType: 'text' }); 
}




getSkillsByCategory(categoryId: number): Observable<Skill[]> {
  return this.getAll().pipe(
    map(skills => skills.filter(s => s.cateId === categoryId))
  );
}

updateSkill(skill: Skill) {
  return this.http.put(`/api/skills/${skill.id}`, skill);
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
}
