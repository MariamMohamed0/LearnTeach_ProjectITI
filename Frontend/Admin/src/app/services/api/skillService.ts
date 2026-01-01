import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Skill, CreateSkillRequest, UpdateSkillRequest, mapSkillFromApi, mapSkillListFromApi } from '../../models/skill';

@Injectable({
providedIn: 'root',
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
getAllUserSkills() {
  return this.http.get(`${this.baseUrl}/user-skills`);
}
deleteUserSkill(userId: number, skillId: number) {
  return this.http.delete(`${this.baseUrl}/${skillId}/${userId}`);
}

}
