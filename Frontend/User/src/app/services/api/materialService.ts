import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Material, CreateMaterialRequest, UpdateMaterialRequest, mapMaterialFromApi } from '../../models/material';

@Injectable({
providedIn: 'root'
})
export class MaterialService {
private baseUrl = `${environment.apiUrl}/Materials`;

constructor(private http: HttpClient) {}

getAll(): Observable<Material[]> {
return this.http.get<any[]>(this.baseUrl).pipe(
map(res => res.map(mapMaterialFromApi))
);
}

getById(id: number): Observable<Material> {
return this.http.get<any>(`${this.baseUrl}/${id}`).pipe(
map(res => mapMaterialFromApi(res))
);
}

create(data: CreateMaterialRequest): Observable<Material> {
return this.http.post<any>(this.baseUrl, data).pipe(
map(res => mapMaterialFromApi(res))
);
}

update(id: number, data: UpdateMaterialRequest): Observable<Material> {
return this.http.put<any>(`${this.baseUrl}/${id}`, data).pipe(
map(res => mapMaterialFromApi(res))
);
}

delete(id: number): Observable<void> {
return this.http.delete<void>(`${this.baseUrl}/${id}`);
}
}
