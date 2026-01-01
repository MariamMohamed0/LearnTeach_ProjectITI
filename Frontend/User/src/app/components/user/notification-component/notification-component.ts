import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../../../services/api/notification-service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-notification-component',
  imports: [CommonModule,ReactiveFormsModule,FormsModule],
  templateUrl: './notification-component.html',
  styleUrl: './notification-component.css',
})
export class NotificationComponent implements OnInit {

  notifications: any[] = [];
  unreadCount = 0;
  showNotifications = false;

  constructor(private notifService: NotificationService) {}

  ngOnInit(): void {

    // 1) Load notifications from API
    this.notifService.getNotifications().subscribe((data: any) => {
      this.notifications = data;
      this.unreadCount = data.filter((x: any) => !x.isRead).length;
    });

    // 2) Connect SignalR
    this.notifService.startConnection();

    // 3) Listen live
    this.notifService.notifications$.subscribe((list) => {
      this.notifications = list;
      this.unreadCount = list.filter((x: any) => !x.isRead).length;
    });
  }

  toggleNotifications() {
    this.showNotifications = !this.showNotifications;
  }

 openNotification(n: any) {
  // لا نفتح نافذة جديدة
}

markAsReadOnly(n: any) {
  if (!n.isRead) {
    this.notifService.markAsRead(n.notificationId).subscribe(() => {
      n.isRead = true;
      this.unreadCount--;
    });
  }
}


  markAll() {
    this.notifService.markAllAsRead().subscribe(() => {
      this.notifications.forEach(n => n.isRead = true);
      this.unreadCount = 0;
    });
  }
}

