import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as signalR from '@microsoft/signalr';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private apiUrl = `${environment.apiUrl}/Notifications`;
  private hubConnection!: signalR.HubConnection;

  notifications$ = new BehaviorSubject<any[]>([]);

  constructor(private http: HttpClient) {}

  // Helper to include Authorization header
  private getAuthHeaders(): { headers: HttpHeaders } {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return { headers };
  }

  // -------- API --------
  getNotifications() {
    return this.http.get(`${this.apiUrl}/user`, this.getAuthHeaders());
  }

  markAsRead(id: number) {
    return this.http.put(`${this.apiUrl}/mark-seen/${id}`, {}, this.getAuthHeaders());
  }

  markAllAsRead() {
    return this.http.put(`${this.apiUrl}/mark-all-seen`, {}, this.getAuthHeaders());
  }

  // -------- SignalR --------
  startConnection() {
    const token = localStorage.getItem('token') || '';
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${environment.apiUrl}/hubs/notifications`, {
        accessTokenFactory: () => token
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection.start()
      .catch(err => console.log('Error starting SignalR: ', err));

    this.hubConnection.on('ReceiveNotification', (notification) => {
      const current = this.notifications$.value;
      this.notifications$.next([notification, ...current]);
    });
  }
}
