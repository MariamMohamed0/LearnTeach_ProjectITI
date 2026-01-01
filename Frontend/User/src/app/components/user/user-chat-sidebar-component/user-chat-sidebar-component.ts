import { Component, OnInit } from '@angular/core';
import { ChatService } from '../../../services/api/ChatService';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslationService } from '../../../services/translation';
interface ChatContact {
  chatId: string;
  id: string;        
  name: string;      
}

@Component({
  selector: 'app-user-chat-sidebar-component',
  imports: [CommonModule,FormsModule,RouterLink],
  templateUrl: './user-chat-sidebar-component.html',
  styleUrl: './user-chat-sidebar-component.css',
  
})
export class UserChatSidebarComponent implements OnInit {
  contacts: ChatContact[] = [];
  currentUserId!: number;

  constructor(private chatService: ChatService, private router: Router,  public t: TranslationService) {}


ngOnInit() {
  this.currentUserId = Number(localStorage.getItem('userId'));
  if (!this.currentUserId) return;

  this.chatService.getContacts().subscribe({
    next: res => this.contacts = res,
    error: err => console.error('Error loading contacts', err)
  });
}

openChat(contact: ChatContact) {

  this.router.navigate(['/chat', contact.chatId], {
  queryParams: { receiverId: Number(contact.id) }
});

}
  tr(key: string) {
    return this.t.translate(key);
  }
}
