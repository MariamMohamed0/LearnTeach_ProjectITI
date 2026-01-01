import { Component, HostListener, OnInit } from '@angular/core';
import { DashboardService } from '../../../services/api/dashboardService';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { UserSessionFeedback } from '../../../models/dashboard';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Sidebar } from '../../shared/sidebar/sidebar';
import { AdminHeader } from '../../shared/admin-header/admin-header';
import { TranslationService } from '../../../services/translation';

@Component({
  selector: 'app-dashboard-component',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, Sidebar, AdminHeader,RouterLink],
  templateUrl: './dashboard-component.html',
  styleUrl: './dashboard-component.css',
})
export class DashboardComponent implements OnInit {
    isDialogOpen = false;
    isDeleteDialogOpen = false;
    isSidebarOpen = true;
    isDarkMode = false;
    screenWidth: number = window.innerWidth;
  userCount = 0;
  postCount = 0;
  commentCount = 0;
  likeCount = 0;
  skillCount = 0;
  sessionCount = 0;
  categoryCount = 0;
  packageCount = 0;
  feedbacks: UserSessionFeedback[] = [];

  constructor(private dashboardService: DashboardService,private router: Router,public t: TranslationService) {}

  ngOnInit(): void {
    this.dashboardService.getUserCount().subscribe({ next: c => this.userCount = c, error: (err: HttpErrorResponse) => console.error(err) });
    this.dashboardService.getPostCount().subscribe({ next: c => this.postCount = c, error: (err: HttpErrorResponse) => console.error(err) });
    this.dashboardService.getCommentCount().subscribe({ next: c => this.commentCount = c, error: (err: HttpErrorResponse) => console.error(err) });
    this.dashboardService.getLikeCount().subscribe({ next: c => this.likeCount = c, error: (err: HttpErrorResponse) => console.error(err) });
    this.dashboardService.getSkillCount().subscribe({ next: c => this.skillCount = c, error: (err: HttpErrorResponse) => console.error(err) });
    this.dashboardService.getSessionCount().subscribe({ next: c => this.sessionCount = c, error: (err: HttpErrorResponse) => console.error(err) });
    this.dashboardService.getCategoryCount().subscribe({ next: c => this.categoryCount = c, error: (err: HttpErrorResponse) => console.error(err) });
    this.dashboardService.getPackageCount().subscribe({ next: c => this.packageCount = c, error: (err: HttpErrorResponse) => console.error(err) });
    this.loadRecentFeedbacks();
  }


  loadRecentFeedbacks(): void {
    this.dashboardService.getRecentFeedbacks().subscribe({
      next: (data: UserSessionFeedback[]) => {
        this.feedbacks = data.slice(0, 5);
      },
      error: err => console.error('Error fetching feedbacks', err)
    });
  }

  viewAll(): void {
    this.router.navigate(['/feedbacks']); 
  }



  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    if (this.isDarkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.screenWidth = event.target.innerWidth;
    if (this.screenWidth >= 1024) this.isSidebarOpen = true;
  }

  isMobile(): boolean {
    return this.screenWidth < 1024;
  }
    tr(key: string) {
    return this.t.translate(key);
  }
}