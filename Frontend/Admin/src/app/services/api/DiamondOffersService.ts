import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DiamondOffer, UpdateDiamondPackageRequest, CreateDiamondOfferRequest } from '../../models/diamond-offers';

@Injectable({
    providedIn: 'root'
})
export class DiamondOffersService {
    private apiUrl = `${environment.apiUrl}/diamondoffers`;

    constructor(private http: HttpClient) { }

    getAll(): Observable<DiamondOffer[]> {
        return this.http.get<DiamondOffer[]>(this.apiUrl);
    }

    getById(id: number): Observable<DiamondOffer> {
        return this.http.get<DiamondOffer>(`${this.apiUrl}/${id}`);
    }

    update(id: number, offer: Partial<DiamondOffer>): Observable<void> {
        return this.http.put<void>(`${this.apiUrl}/${id}`, offer);
    }

    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

    updatePackage(data: UpdateDiamondPackageRequest): Observable<void> {
        const body = {
            title: data.title,
            diamondAmount: data.diamondAmount,
            price: data.price,
            currency: data.currency
        };

        return this.http.put<void>(`${this.apiUrl}/${data.id}`, body);
    }


    getPackageById(id: number): Observable<DiamondOffer> {
        return this.http.get<DiamondOffer>(`${this.apiUrl}/${id}`);
    }


    // Create
    create(data: CreateDiamondOfferRequest): Observable<DiamondOffer> {
        return this.http.post<DiamondOffer>(this.apiUrl, data);
    }
}
