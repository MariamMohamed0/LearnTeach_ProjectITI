// import {
//   Component, Input, OnInit, OnDestroy, OnChanges,
//   SimpleChanges, ChangeDetectorRef
// } from '@angular/core';
// import { CommonModule, DatePipe } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { ChatService, Message } from '../../services/chat-service';
// import { Subscription } from 'rxjs';

// @Component({
//   selector: 'app-chat-window-component',
//   standalone: true,
//   imports: [CommonModule, FormsModule, DatePipe],
//   templateUrl: './chat-window-component.html',
//  styleUrl: './chat-window-component.css'
// })
// export class ChatWindowComponent implements OnInit, OnChanges, OnDestroy {
  
//   @Input() chatId: string | null = 'chat_A_B';

//   messages: Message[] = [];
//   newMessageText = "";
//   isSending = false;
//   isLoading = false;

//   currentUserId = "10010";
//   otherUserId = "10012";

//   private sub: Subscription | null = null;

//   constructor(
//     private chatService: ChatService,
//     private cdr: ChangeDetectorRef
//   ) {}

//   ngOnInit() {
//     this.currentUserId = this.chatService.getCurrentUserId();
//     this.otherUserId = this.chatService.getOtherUserId();
    
//     if (!this.chatId) {
//       this.chatId = this.chatService.getDefaultChatId();
//     }
//   }

//   ngOnChanges(changes: SimpleChanges) {
//     if (!this.chatId) return;

//     this.listenToMessages();
//   }

//   listenToMessages() {
//     this.isLoading = true;
//     this.sub?.unsubscribe();

//     this.sub = this.chatService.getChatMessages(this.chatId!).subscribe(messages => {
//       this.messages = messages;
//       this.isLoading = false;
//       this.cdr.detectChanges();
//       this.scrollBottom();
//     });
//   }

//   async sendMessage() {
//     if (!this.newMessageText.trim() || !this.chatId) return;

//     this.isSending = true;

//     await this.chatService.sendMessage(
//       this.newMessageText.trim(),
//       this.currentUserId,
//       this.chatId
//     );

//     this.newMessageText = "";
//     this.isSending = false;
//   }

//   scrollBottom() {
//     setTimeout(() => {
//       const el = document.querySelector('.messages-list');
//       if (el) el.scrollTop = el.scrollHeight;
//     }, 200);
//   }

//   ngOnDestroy() {
//     this.sub?.unsubscribe();
//   }
// }


//verson 2 working
import {
  Component, Input, OnInit, OnDestroy, OnChanges,
 SimpleChanges, ChangeDetectorRef
} from '@angular/core';
 import { CommonModule, DatePipe } from '@angular/common';
 import { FormsModule } from '@angular/forms';
 import { ChatService, Message } from '../../services/chat-service';
 import { Subscription } from 'rxjs';

 @Component({
   selector: 'app-chat-window-component',
  standalone: true,
   imports: [CommonModule, FormsModule, DatePipe],
  templateUrl: './chat-window-component.html',
  styleUrl: './chat-window-component.css'
 })
 export class ChatWindowComponent implements OnInit, OnChanges, OnDestroy {

@Input() chatId: string | null = null;

  messages: Message[] = [];
  newMessageText = "";
  isSending = false;
  isLoading = false;

   currentUserId: string | null = null;
   otherUserId: string | null = null;
  

  private sub: Subscription | null = null;
  private userSub: Subscription | null = null;
  private createChatSub: Subscription | null = null;


 constructor(
    private chatService: ChatService,
    private cdr: ChangeDetectorRef
    
  ) {}

  ngOnInit() {

    /** ⭐ تحميل الـ User IDs أولاً */
    this.userSub = this.chatService.getCurrentUserId().subscribe({
      next: (id) => {
        this.currentUserId = id;

        // تحميل الـ other user
        this.chatService.getOtherUserId().subscribe({
          next: (otherId) => {
            this.otherUserId = otherId;
          }
        });
      }
    });

    if (!this.chatId) {
      this.chatId = this.chatService.getDefaultChatId();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!this.chatId) return;
    this.listenToMessages();
  }

  listenToMessages() {
    this.isLoading = true;
    this.sub?.unsubscribe();

    this.sub = this.chatService.getChatMessages(this.chatId!).subscribe(messages => {
      this.messages = messages;
      this.isLoading = false;

      this.cdr.detectChanges();
      this.scrollBottom();
    });
  }

  async sendMessage() {
    if (!this.newMessageText.trim() || !this.chatId || !this.currentUserId) return;

    this.isSending = true;

    await this.chatService.sendMessage(
      this.newMessageText.trim(),
      this.currentUserId,
      this.chatId
    );

    this.newMessageText = "";
    this.isSending = false;
  }

  scrollBottom() {
    setTimeout(() => {
      const el = document.querySelector('.messages-list');
      if (el) el.scrollTop = el.scrollHeight;
    }, 200);
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
    this.userSub?.unsubscribe();
  }
}

















