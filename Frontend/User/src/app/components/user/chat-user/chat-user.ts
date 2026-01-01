import { Component, OnInit } from '@angular/core';
import { ChatService } from '../../../services/api/ChatService';
import { AuthService } from '../../../services/api/authService';
import { UserService } from '../../../services/api/UserService';
import { UserProfileService } from '../../../services/api/userProfileService';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat-user',
  imports: [CommonModule,FormsModule],
  templateUrl: './chat-user.html',
  styleUrl: './chat-user.css',
})
export class ChatUser implements OnInit {

  users: any[] = [];
  selectedUserId!: number;

  message = '';
  messages: any[] = [];

  myUserId!: number;

  constructor(
    private chatService: ChatService,
    private authService: AuthService,
    private userService: UserProfileService

  ) {}

  ngOnInit() {
    // ✅ جاي من ProfileId
    this.myUserId = this.authService.getCurrentUserId()!;

    // ✅ تشغيل SignalR
    this.chatService.startConnection();

    // ✅ الاستقبال
    this.chatService.onMessage((senderId, message) => {
      this.messages.push({ senderId, message });
    });

    // ✅ تحميل اليوزرز
    this.userService.getAll().subscribe(res => {
      this.users = res.filter(u => u.userId !== this.myUserId);
    });
  }

  send() {
    if (!this.message.trim()) return;

    this.chatService.sendMessage(this.selectedUserId, this.message);

    this.messages.push({
      senderId: this.myUserId,
      message: this.message
    });

    this.message = '';
  }
}
