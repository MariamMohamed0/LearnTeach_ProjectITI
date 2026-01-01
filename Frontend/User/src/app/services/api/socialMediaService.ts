import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { SocialMedia, CreateSocialMediaRequest, UpdateSocialMediaRequest, mapSocialMediaFromApi } from '../../models/socialMedia';

@Injectable({
providedIn: 'root'
})
export class SocialMediaService {
private baseUrl = `${environment.apiUrl}/SocialMedia`;

constructor(private http: HttpClient) {}

getAll(): Observable<SocialMedia[]> {
return this.http.get<any[]>(this.baseUrl).pipe(
map(res => res.map(mapSocialMediaFromApi))
);
}

getByUserId(userId: number): Observable<SocialMedia[]> {
return this.http.get<any[]>(`${this.baseUrl}/user/${userId}`).pipe(
map(res => res.map(mapSocialMediaFromApi))
);
}

create(data: CreateSocialMediaRequest): Observable<SocialMedia> {
return this.http.post<any>(this.baseUrl, data).pipe(
map(res => mapSocialMediaFromApi(res))
);
}

update(data: UpdateSocialMediaRequest): Observable<SocialMedia> {
  if (!data.accountId) throw new Error("accountId missing");
  return this.http.put<any>(`${this.baseUrl}/${data.accountId}`, data).pipe(
    map(res => mapSocialMediaFromApi(res))
  );
}


delete(id: number): Observable<void> {
  return this.http.delete<void>(`${this.baseUrl}/${id}`);
}

}
