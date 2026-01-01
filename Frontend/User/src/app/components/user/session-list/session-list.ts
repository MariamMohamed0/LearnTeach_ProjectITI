import { Component, HostListener, OnInit } from '@angular/core';
import { Session } from '../../../models/session';
import { SessionService } from '../../../services/api/sessionService';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/api/authService';
import { SessionCard } from "../session-card/session-card";
import { UserHeader } from '../../shared/user-header/user-header';
import { Sidestudent } from '../../shared/sidestudent/sidestudent';
import { TranslationService } from '../../../services/translation';


@Component({
  selector: 'app-session-list',
  imports: [SessionCard, CommonModule, RouterModule,UserHeader,Sidestudent],
  templateUrl: './session-list.html',
  styleUrls: ['./session-list.css'], // ⚠ corrected
})
export class SessionList implements OnInit {

  sessions: Session[] = [];
  filter: 'All' | 'Teacher' | 'Student' = 'All';
  currentRole: 'Teacher' | 'Student' | null = null;
  isSidebarOpen = true;
  isDarkMode = false;
  screenWidth: number = window.innerWidth;

  // Pagination
  totalCount: number = 0;
  pageNumber: number = 1;
  pageSize: number = 2;

  constructor(
    private sessionService: SessionService,
    private authService: AuthService,
    private router: Router,
    public t: TranslationService
  ) {}

  ngOnInit(): void {
    
    this.currentRole = this.authService.getCurrentUserRole();
    this.loadSessions();
  }

  // loadSessions() {
  //   const role = this.filter === 'All' ? undefined : this.filter.toLowerCase();
  //   this.sessionService.getMySessions(role).subscribe(s => this.sessions = s);
  // }
  loadSessions() {
  const role = this.filter === 'All' ? undefined : this.filter.toLowerCase();

  this.sessionService.getMySessions(role, this.pageNumber, this.pageSize).subscribe({
    next: (res) => {
      this.sessions = res.sessions;  // هنا مصفوفة الجلسات
      this.totalCount = res.totalCount;
      this.pageNumber = res.pageNumber;
      this.pageSize = res.pageSize;
    },
    error: (err) => {
      console.error("❌ Error loading sessions:", err);
    }
  });
}


nextPage() {
  if (this.pageNumber * this.pageSize < this.totalCount) {
    this.pageNumber++;
    this.loadSessions();
  }
}

prevPage() {
  if (this.pageNumber > 1) {
    this.pageNumber--;
    this.loadSessions();
  }
}

goToPage(page: number) {
  this.pageNumber = page;
  this.loadSessions();
}

get totalPages(): number {
  return Math.ceil(this.totalCount / this.pageSize);
}


  setFilter(f: 'All' | 'Teacher' | 'Student') {
    this.filter = f;
    this.loadSessions();
  }

  onJoin(session: Session) {
  if (session.status !== 'Ongoing') {
    alert('Session not started yet!');
    return;
  }

  this.sessionService.joinSession(session.sessionId).subscribe({
    next: res => {
      if (res.joinUrl) {
        //window.location.href = res.joinUrl;
       
        window.open(res.joinUrl, '_blank');
      } else {
        alert('Zoom URL not available');
      }
    },
    error: err => {
      console.error(err);
      alert('Failed to join session');
    }
  });
}

  

  onEdit(session: Session) {
    this.router.navigate(['/sessions/edit', session.sessionId]);
  }

  onDelete(session: Session) {
    if(confirm('Are you sure to delete this session?')) {
      this.sessionService.deleteSession(session.sessionId).subscribe(() => {
        this.loadSessions();
      });
    }
  }
   toggleSidebar() { this.isSidebarOpen = !this.isSidebarOpen; }
  toggleDarkMode() { this.isDarkMode = !this.isDarkMode; if (this.isDarkMode) document.body.classList.add('dark'); else document.body.classList.remove('dark'); }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) { this.screenWidth = event.target.innerWidth; if (this.screenWidth >= 1024) this.isSidebarOpen = true; }

  isMobile(): boolean { return this.screenWidth < 1024; }
  get pagesArray(): number[] {
  return this.totalPages && this.totalPages > 0
    ? Array(this.totalPages).fill(0)
    : [];
}
 tr(key: string) {
    return this.t.translate(key);
  }
}
