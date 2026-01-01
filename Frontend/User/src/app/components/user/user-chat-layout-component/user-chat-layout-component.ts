import { Component } from '@angular/core';
import { UserChatSidebarComponent } from '../user-chat-sidebar-component/user-chat-sidebar-component';
import { UserChatWindowComponent } from '../../user-chat-window-component/user-chat-window-component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-user-chat-layout-component',
  imports: [UserChatSidebarComponent,UserChatWindowComponent,RouterOutlet],
  templateUrl: './user-chat-layout-component.html',
  styleUrl: './user-chat-layout-component.css',
})
export class UserChatLayoutComponent {

}
