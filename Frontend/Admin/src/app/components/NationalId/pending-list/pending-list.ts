import { Component, HostListener, OnInit } from '@angular/core';
import { NationalIdService } from '../../../services/api/national-id-service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Sidebar } from '../../shared/sidebar/sidebar';
  import { AdminHeader } from './../../shared/admin-header/admin-header';
import { TranslationService } from '../../../services/translation';
@Component({
  selector: 'app-pending-list',
  imports: [CommonModule,ReactiveFormsModule,FormsModule,Sidebar,AdminHeader],

templateUrl: './pending-list.html',
  styleUrl: './pending-list.css',
})
export class PendingList implements OnInit {
  pendingList: any[] = [];
  loading = true;
   isSidebarOpen = true;
  isDarkMode = false;
  screenWidth: number = window.innerWidth;
  constructor(
    private nationalIdService: NationalIdService,
    private router: Router,
    public t: TranslationService
  ) {}

  ngOnInit(): void {
    this.loadPending();
  }

  loadPending() {
    this.nationalIdService.getPending().subscribe({
      next: (data) => {
        this.pendingList = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  viewDetails(id: number) {
    this.router.navigate(['/admin/national-id', id]);
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
 
