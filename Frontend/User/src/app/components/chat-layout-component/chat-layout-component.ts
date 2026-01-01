// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-chat-layout-component',
//   imports: [],
//   templateUrl: './chat-layout-component.html',
//   styleUrl: './chat-layout-component.css',
// })
// export class ChatLayoutComponent {

// }

// src/app/chat-layout/chat-layout.component.ts

import { Component } from '@angular/core';
import { ChatSidebarComponent } from '../chat-sidebar-component/chat-sidebar-component';
import { ChatWindowComponent } from '../chat-window-component/chat-window-component';
import { Navbar } from "../shared/navbar/navbar";

import { ActivatedRoute } from '@angular/router';





@Component({
  //selector: 'app-chat-layout',
  selector: 'app-chat-layout-component',
  standalone: true,
  imports: [ChatSidebarComponent, ChatWindowComponent, Navbar],
  template: `
    <div class="chat-container">
      <app-chat-sidebar-component class="sidebar" (chatSelected)="onChatSelected($event)"></app-chat-sidebar-component>

      <app-chat-window-component class="chat-window" [chatId]="selectedChatId"></app-chat-window-component>
    </div>
    
  `,
  styles: `
    .chat-container {
      display: flex;
      height: 100vh;
      max-width: 1200px;
      margin: 0 auto;
      border: 1px solid #ccc;
    }
    .sidebar {
      width: 300px; 
      border-right: 1px solid #eee;
    }
    .chat-window {
      flex-grow: 1; 
    }
  `
})
export class ChatLayoutComponent {


  // selectedChatId: string | null = 'chat_A_B';
  selectedChatId: string | null = null;

constructor(private route: ActivatedRoute) {}

  


  onChatSelected(chatId: string) {
    this.selectedChatId = chatId;
    console.log('Selected Chat:', chatId);
  }


  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['chatId']) {
        this.selectedChatId = params['chatId'];
        console.log('Initial Chat from queryParams:', this.selectedChatId);
      }
    });
  }


}
