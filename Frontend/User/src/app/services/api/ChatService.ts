import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private hubConnection!: signalR.HubConnection;

  constructor(private http: HttpClient) { }

  // بدء الاتصال بالـ SignalR Hub
  startConnection() {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${environment.apiUrl.replace('/api','')}/chatHub`, {
        accessTokenFactory: () => localStorage.getItem('token')!
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection.start()
      .then(() => console.log('✅ Chat Connected'))
      .catch(err => console.error('❌ Chat Error:', err));
  }

  // إرسال رسالة
  sendMessage(receiverId: number, message: string) {
    return this.hubConnection.invoke('SendMessage', receiverId.toString(), message);
  }

  // استقبال الرسائل realtime
  onMessage(callback: (senderId: string, message: string) => void) {
    this.hubConnection.on('ReceiveMessage', callback);
  }

  // إنشاء محادثة جديدة
  createChat(receiverId: number) {
    return this.http.post<{ chatId: string }>(
      `${environment.apiUrl}/UserChat/create?user2=${receiverId}`, 
      {}
    );
  }

  // جلب الرسائل السابقة
  getChatMessages(chatId: string) {
    return this.http.get<{ senderId: string, message: string }[]>(
      `${environment.apiUrl}/UserChat/${chatId}`
    );
  }

  // داخل ChatService
getContacts() {
  const token = localStorage.getItem('token') || '';
  return this.http.get<any[]>(
    `${environment.apiUrl}/UserChat/contacts`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
}




}