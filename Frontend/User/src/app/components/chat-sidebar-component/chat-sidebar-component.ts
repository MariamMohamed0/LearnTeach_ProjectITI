// import { Component, Output, EventEmitter, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';

// @Component({
//   selector: 'app-chat-sidebar-component',
//  standalone: true,
//   imports: [CommonModule],
//   template: `
//     <div class="sidebar-list">
//       <h2>Recent Chats</h2>
//       @for (chat of chats; track chat.id) {
//         <div
//           class="chat-item"
//           [class.active]="chat.id === selectedChatId"
//           (click)="selectChat(chat.id)"
//         >
//           {{ chat.name }}
//         </div>
//       }
//     </div>
//   `,
//   styles: `
//     .sidebar-list {
//       padding: 15px;
//       height: 100%;
//       overflow-y: auto;
//     }
//     .chat-item {
//       padding: 10px;
//       margin-bottom: 5px;
//       border-radius: 5px;
//       cursor: pointer;
//       background-color: #f9f9f9;
//       transition: background-color 0.2s;
//     }
//     .chat-item:hover {
//       background-color: #eee;
//     }
//     .chat-item.active {
//       background-color: #007bff;
//       color: white;
//       font-weight: bold;
//     }
//   `
// })
// export class ChatSidebarComponent implements OnInit {
//   @Output() chatSelected = new EventEmitter<string>();

//   // محادثات افتراضية للاختبار
//   chats = [
//     { id: 'chat_A_B', name: 'Chat with User B (Test 1)' },
//     { id: 'chat_A_C', name: 'Chat with User C (Test 2)' },
//     { id: 'chat_A_D', name: 'Chat with User D (Test 3)' },
//   ];
//   selectedChatId: string | null = null;

//   ngOnInit() {
//     // اختيار أول محادثة تلقائيًا عند التحميل
//     if (this.chats.length > 0) {
//       this.selectChat(this.chats[0].id);
//     }
//   }

//   selectChat(chatId: string) {
//     this.selectedChatId = chatId;
//     this.chatSelected.emit(chatId);
//   }
// }

import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chat-sidebar-component',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="sidebar-container">

      <h2 class="title">Messages</h2>

      <!-- <div class="sidebar-search">
        <i class="bi bi-search"></i>
        <input placeholder="Search..." />
      </div> -->

      <div class="chat-list">

        @for (chat of chats; track chat.id) {
          <div
            class="chat-item"
            [class.active]="chat.id === selectedChatId"
            (click)="selectChat(chat.id)"
          >
            <div class="avatar-wrapper">
              <img src="assets/people.png" class="avatar" />
              <span class="online"></span>
            </div>

            <div class="chat-content">
              <h3>{{ chat.name }}</h3>
              <p>{{ chat.lastMessage }}</p>
            </div>
          </div>
        }

      </div>

    </div>
  `,
  styles: `
    .sidebar-container {
      width: 100%;
      height: 100%;
      background: white;
      border-radius: 20px 0 0 20px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.05);
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 15px;
    }

    .title {
      font-size: 24px;
      font-weight: 700;
      margin: 0 0 10px;
    }

    /* SEARCH */
    .sidebar-search {
      display: flex;
      align-items: center;
      background: #f4f6fa;
      padding: 12px 15px;
      border-radius: 12px;
      gap: 10px;
    }

    .sidebar-search input {
      border: none;
      outline: none;
      background: transparent;
      width: 100%;
    }

    /* CHAT LIST */
    .chat-list {
      flex: 1;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 10px;
      margin-top: 10px;
    }

    .chat-item {
      display: flex;
      gap: 12px;
      padding: 14px;
      border-radius: 15px;
      cursor: pointer;
      transition: 0.2s;
      background: #ffffff;
      border: 1px solid #f1f1f1;
    }

    .chat-item:hover {
      background: #f7f9ff;
    }

    .chat-item.active {
      background: #e6efff;
      border-color: #1b72ff;
      box-shadow: 0 4px 12px rgba(27, 114, 255, 0.2);
    }

    /* AVATAR */
    .avatar-wrapper {
      position: relative;
    }

    .avatar {
      width: 52px;
      height: 52px;
      border-radius: 50%;
    }

    // .online {
    //   width: 13px;
    //   height: 13px;
    //   background: #33d873;
    //   border-radius: 50%;
    //   border: 2px solid white;
    //   position: absolute;
    //   bottom: 0;
    //   right: 0;
    // }

    /* TEXT */
    .chat-content h3 {
      margin: 0;
      font-size: 17px;
      font-weight: 600;
    }

    .chat-content p {
      margin: 4px 0 0;
      color: #6b7280;
      font-size: 13px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 170px;
    }
  `
})
export class ChatSidebarComponent implements OnInit {
  @Output() chatSelected = new EventEmitter<string>();

  // نفس اللي عندك + ضفنالهم lastMessage عشان نعمل زي الصورة
  chats = [
    { id: 'chat_A_B', name: 'Mohamed', lastMessage: 'That sounds great! Let me know when you are…' },
    { id: 'chat_A_C', name: 'Noor', lastMessage: 'Thanks for the feedback! I really appreciate it.' },
    { id: 'chat_A_D', name: 'Nada', lastMessage: 'Perfect! See you tomorrow at 3 PM.' },
    { id: 'chat_A_E', name: 'Yasser', lastMessage: 'I have sent you the documents you requested.' },
  ];

  selectedChatId: string | null = null;

  ngOnInit() {
    if (this.chats.length > 0) {
      this.selectChat(this.chats[0].id);
    }
  }

  selectChat(chatId: string) {
    this.selectedChatId = chatId;
    this.chatSelected.emit(chatId);
  }
}
