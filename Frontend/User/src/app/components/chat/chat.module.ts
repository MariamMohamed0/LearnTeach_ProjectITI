import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ChatLayoutComponent } from '../chat-layout-component/chat-layout-component';
import { ChatSidebarComponent } from '../chat-sidebar-component/chat-sidebar-component';
import { ChatWindowComponent } from '../chat-window-component/chat-window-component';



@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule
  ]
})
export class ChatModule {}
