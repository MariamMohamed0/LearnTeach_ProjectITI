import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../../services/api/ChatService';
import { AuthService } from '../../services/api/authService';
import { UserProfileService } from '../../services/api/userProfileService';
import { UserProfile } from '../../models/userProfile';
import { TranslationService } from '../../services/translation';


@Component({
  selector: 'app-user-chat-window',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-chat-window-component.html',
  styleUrls: ['./user-chat-window-component.css'],
})
export class UserChatWindowComponent implements OnInit {
  chatId!: string;

  receiverId!: number | undefined;

  message = '';
  
messages: { senderId: string; message: string; createdAt: string }[] = [];


  constructor(
    private route: ActivatedRoute,
    private chatService: ChatService,
    private authService: AuthService,
    private profileService:UserProfileService,
     public t: TranslationService
  ) {}

 
 
  myId!: string;



receiverProfile: UserProfile | null = null;




ngOnInit(): void {
  this.myId = localStorage.getItem('userId')!;

  // استمع لأي تغيير في الـ route params
  this.route.params.subscribe(params => {
    this.chatId = params['chatId'];

    const receiverParam = this.route.snapshot.queryParamMap.get('receiverId');
    this.receiverId = receiverParam ? Number(receiverParam) : undefined;

    // جلب بيانات المستلم لو موجودة
    if (this.receiverId !== undefined) {
      this.getReceiverProfile(this.receiverId);
    }

    // جلب الرسائل لو chatId موجود
    if (this.chatId) {
      this.loadMessages(this.chatId);
    }
  });

  // بدء اتصال SignalR مرة واحدة
  this.chatService.startConnection();

  // استقبال الرسائل الجديدة realtime
  this.chatService.onMessage((senderId: string, message: string) => {
    this.messages.push({
      senderId: senderId === this.myId ? 'me' : senderId,
      message,
      createdAt: new Date().toISOString()
    });
  });
}

getReceiverProfile(receiverId: number) {
  this.profileService.getById(receiverId).subscribe({
    next: profile => this.receiverProfile = profile,
    error: err => console.error('Error loading receiver profile', err)
  });
}


loadMessages(chatId: string) {
  this.chatService.getChatMessages(chatId).subscribe(res => {
    this.messages = res
      .map(m => ({
        senderId: m.senderId === this.myId ? 'me' : m.senderId,
        message: m.message,
        createdAt: (m as any).createdAt || new Date().toISOString()
      }))
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  });
}




send() {
  if (!this.message.trim() || !this.receiverId) return;

  this.chatService.sendMessage(this.receiverId, this.message)
    .then(() => {
      this.messages.push({ 
        senderId: 'me', 
        message: this.message,
        createdAt: new Date().toISOString() 
      });
      this.message = '';
      console.log('Message sent!');
    })
    .catch(err => console.error('Send error:', err));
}
  tr(key: string) {
    return this.t.translate(key);
  }

}
