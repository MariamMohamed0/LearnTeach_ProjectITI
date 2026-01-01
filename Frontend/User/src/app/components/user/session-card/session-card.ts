import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { Session } from '../../../models/session';
import { AuthService } from '../../../services/api/authService';
import { CommonModule } from '@angular/common';
import { UserSessionFeedbackService } from '../../../services/api/user-session-feedback-service';
import { UserSessionFeedback } from "../user-session-feedback/user-session-feedback";
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserHeader } from '../../shared/user-header/user-header';
import { Sidestudent } from '../../shared/sidestudent/sidestudent';
import { TranslationService } from '../../../services/translation';


@Component({
  selector: 'app-session-card',
  imports: [CommonModule, MatDialogModule, ReactiveFormsModule, FormsModule, UserHeader, Sidestudent],
  templateUrl: './session-card.html',
  styleUrls: ['./session-card.css'],
})
export class SessionCard {
  @Input() session!: Session;
  @Output() joinEvent = new EventEmitter<Session>();
  @Output() editEvent = new EventEmitter<Session>();
  @Output() deleteEvent = new EventEmitter<Session>();
  @Input() currentFilter: 'All' | 'Teacher' | 'Student' = 'All';

  isSidebarOpen = true;
  isDarkMode = false;
  screenWidth: number = window.innerWidth;
  constructor(private feedbackService: UserSessionFeedbackService,
    private dialog: MatDialog,
    public t: TranslationService
  ) { }


  openFeedbackModal(sessionId: number) {
    this.dialog.open(UserSessionFeedback, {
      data: { sessionId },
      width: '600px',
      maxHeight: '80vh'
    });
  }



  canEdit(filter: 'All' | 'Teacher' | 'Student'): boolean {
    // يظهر Edit فقط إذا الفلتر Teacher و status = 'Scheduled'
    return filter === 'Teacher' && this.session.status === 'Scheduled';
  }

  canDelete(filter: 'All' | 'Teacher' | 'Student'): boolean {
    // يظهر Delete لكل الحالات إذا الفلتر Teacher
    return filter === 'Teacher';
  }


  canJoin(): boolean {
    return this.session.status === 'Ongoing';
  }

  onJoin() { this.joinEvent.emit(this.session); }
  onEdit() { this.editEvent.emit(this.session); }
  onDelete() { this.deleteEvent.emit(this.session); }
  toggleSidebar() { this.isSidebarOpen = !this.isSidebarOpen; }
  toggleDarkMode() { this.isDarkMode = !this.isDarkMode; if (this.isDarkMode) document.body.classList.add('dark'); else document.body.classList.remove('dark'); }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) { this.screenWidth = event.target.innerWidth; if (this.screenWidth >= 1024) this.isSidebarOpen = true; }

  isMobile(): boolean { return this.screenWidth < 1024; }
    tr(key: string) {
    return this.t.translate(key);
  }
}


