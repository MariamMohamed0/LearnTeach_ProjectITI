
import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { adminReportService } from '../../services/api/adminReportService';
import { AdminReport } from '../../models/adminReport';
import { Sidebar } from './../shared/sidebar/sidebar';
import { Navbar } from './../shared/navbar/navbar';
import { Router, RouterLink } from '@angular/router'; // <-- IMPORT
import { AdminHeader } from '../shared/admin-header/admin-header';
import { UserProfileService } from '../../services/api/userProfileService';
import { AuthService } from '../../services/api/authService';
import { UserProfile } from '../../models/userProfile';
import { TranslationService } from '../../services/translation';

@Component({
  selector: 'app-admin-reports',
  standalone: true,
  templateUrl: './admin-reports.html',
  styleUrls: ['./admin-reports.css'],
  imports: [CommonModule, DatePipe , Navbar , Sidebar,AdminHeader,RouterLink ]
})
export class AdminReportsComponent implements OnInit {

  allReports: AdminReport[] = [];
  pendingReports: AdminReport[] = [];
  loading = false;
  errorMessage = '';
      isSidebarOpen = true;
  isDarkMode = false;
  screenWidth: number = window.innerWidth;
    users: UserProfile[] = [];


  constructor(private router: Router,private userProfileService:UserProfileService,  public authService: AuthService ,public t: TranslationService) {} // <-- inject Router

  ngOnInit(): void {
    this.loadReports();
    // this.loadPending();
        this.userProfileService.getAll().subscribe({
      next: (res) => {
        this.users = res;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  async loadReports() {
    try {
      this.loading = true;
      this.allReports = await adminReportService.getAll();
    } catch (err) {
      console.error('Failed to load reports', err);
      this.errorMessage = 'Failed to load reports';
    } finally {
      this.loading = false;
    }
  }

  // async loadPending() {
  //   try {
  //     this.pendingReports = await adminReportService.getPending();
  //   } catch (err) {
  //     console.error('Failed to load pending reports', err);
  //   }
  // }

  // existing methods (updateStatus, suspendOrRestoreUser, deleteReport...) stay the same
  async updateStatus(id: number, status: string) {
    try {
      await adminReportService.updateStatus(id, status);

      const report = this.allReports.find(r => r.reportId === id);
      if (report) report.status = status.toLowerCase();

      const pending = this.pendingReports.find(r => r.reportId === id);
      if (pending) pending.status = status.toLowerCase();
    } catch (err) {
      console.error('Failed to update status', err);
      alert('Error updating status');
    }
  }

  async suspendOrRestoreUser(userId: number) {
    if (!confirm('Are you sure you want to suspend/restore this user?')) return;
    try {
      await adminReportService.suspendOrRestoreUser(userId);

      this.allReports.forEach(r => {
        if (r.reportedUserId === userId) {
          r.reportedUserStatus = r.reportedUserStatus === 'suspended' ? 'active' : 'suspended';
        }
      });

      this.pendingReports.forEach(r => {
        if (r.reportedUserId === userId) {
          r.reportedUserStatus = r.reportedUserStatus === 'suspended' ? 'active' : 'suspended';
        }
      });

      alert('User status updated successfully.');
    } catch (err) {
      console.error('Failed to suspend/restore user', err);
      alert('Error updating user status');
    }
  }

  async deleteReport(id: number) {
    if (!confirm('Are you sure you want to delete this report?')) return;

    try {
      await adminReportService.delete(id);
      this.loadReports();
      // this.loadPending();
    } catch (err) {
      console.error('Failed to delete report', err);
      alert('Error deleting report');
    }
  }

  // // NEW: open user profile (adjust route to your app's route)
  // openUserProfile(userId: number | null | undefined) {
  //   if (!userId) return;
  //   // change '/user' to your actual route if different (e.g. '/users', '/profile')
  //   this.router.navigate(['/user', userId]);
  // }

  getStatusBadge(status: string) {
    switch (status.toLowerCase()) {
      case 'approved':
        return { class: 'px-2 py-1 bg-green-200 text-green-700 rounded', text: 'Approved' };
      case 'rejected':
        return { class: 'px-2 py-1 bg-red-200 text-red-700 rounded', text: 'Rejected' };
      default:
        return { class: 'px-2 py-1 bg-yellow-200 text-yellow-700 rounded', text: 'Pending' };
    }
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
  openUserProfile(userId: number | undefined) {
  if (!userId) return;
  this.router.navigate(['/you-profile', userId]); 
}

}