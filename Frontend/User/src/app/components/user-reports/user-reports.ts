// import { Component , Input, inject, OnInit } from '@angular/core';
// import { CommonModule, NgFor, NgIf, DatePipe } from '@angular/common';
// import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
// import { HttpClientModule } from '@angular/common/http';
// import { reportService } from '../../services/api/reportService';
// import { Report, CreateReportRequest } from '../../models/report';
// import { AuthService } from '../../services/api/authService';

// @Component({
//   selector: 'app-user-reports',
//   imports: [CommonModule, ReactiveFormsModule, HttpClientModule, NgIf, NgFor, DatePipe],
//   templateUrl: './user-reports.html',
//   styleUrls: ['./user-reports.css'],
// })
// export class UserReportsComponent implements OnInit {
//   private fb = inject(FormBuilder);
//   private authService = inject(AuthService);

//   @Input() userId!: string; 


//   form = this.fb.group({
//     ReportDescription: ['', Validators.required],
//   });

//   user: any = null;
//   reports: Report[] = [];
//   loading = true;
//   dialogOpen = false;

//   selectedEntityType: string = '';
//   selectedEntityId: number = 0;
//   selectedReportedUserId: number = 0;

//   constructor() {
//     this.user = this.authService.currentUser;
//     if (!this.user) {
//       console.error('User not logged in!');
//       this.loading = false;
//       return;
//     }
//     this.loadCurrentUserAndReports();
//   }

//   private loadCurrentUserAndReports() {
//     this.loading = true;
//     this.user = this.authService.currentUser;

//     if (!this.user || !this.user.userId) {
//       console.error('User not logged in or userId missing!', this.user);
//       this.loading = false;
//       return;
//     }

//     reportService.getByUserId(this.user.userId)
//       .then((reports) => {
//         this.reports = reports;
//         this.loading = false;
//       })
//       .catch((err) => {
//         console.error('Failed to load reports', err);
//         this.loading = false;
//       });
//   }

//   openReportDialog(entityType: string, entityId: number, reportedUserId: number) {
//     this.selectedEntityType = entityType;
//     this.selectedEntityId = entityId;
//     this.selectedReportedUserId = reportedUserId;
//     this.dialogOpen = true;
//   }

//   submit() {
//     if (!this.user || this.form.invalid) return;

//     const payload: CreateReportRequest = {
//       ReportDescription: this.form.value.ReportDescription ?? '',
//       EntityType: this.selectedEntityType,
//       EntityId: this.selectedEntityId,
//       ReportedBy: this.user.userId,
//       ReportedUserId: this.selectedReportedUserId,
//     };
    

//     reportService.create(payload)
//       .then(() => {
//         this.dialogOpen = false;
//         this.form.reset({ ReportDescription: '' });
//         this.loadCurrentUserAndReports();
//       })
//       .catch((err) => {
//         console.error('Failed to submit report', err);
//       });
//   }

//   getStatusBadge(status: string | null | undefined) {
//     const s = (status || '').toLowerCase();
//     const variants: Record<string, { color: string; icon: string }> = {
//       pending: { color: 'bg-gray-200 text-gray-700', icon: '⏰' },
//       approved: { color: 'bg-green-200 text-green-700', icon: '✅' },
//       rejected: { color: 'bg-red-200 text-red-700', icon: '❌' },
//     };
//     return variants[s] || variants['pending'];
//   }
// }

import { Component, HostListener, inject, OnInit } from '@angular/core';
import { CommonModule, NgFor, NgIf, DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { reportService } from '../../services/api/reportService';
import { Report } from '../../models/report';
import { AuthService } from '../../services/api/authService';
import { MakeReportComponent } from '../make-report/make-report';
import { UserHeader } from '../shared/user-header/user-header';
import { Sidestudent } from '../shared/sidestudent/sidestudent';
import { TranslationService } from './../../services/translation';

@Component({
  selector: 'app-user-reports',
  standalone: true,
  imports: [CommonModule, HttpClientModule, NgIf, NgFor, DatePipe,MakeReportComponent,UserHeader,Sidestudent],
  templateUrl: './user-reports.html',
  styleUrls: ['./user-reports.css'],
})
export class UserReportsComponent implements OnInit {
  private authService = inject(AuthService);

  reports: Report[] = [];
  loading = true;
  user: any = null;
  isSidebarOpen = true;
  isDarkMode = false;
  screenWidth: number = window.innerWidth;
  constructor(public translation: TranslationService)  {
    this.user = this.authService.currentUser;
    if (!this.user) {
      console.error('User not logged in!');
      this.loading = false;
      return;
    }
    this.loadCurrentUserReports();
  }

  ngOnInit(): void {}

  private loadCurrentUserReports() {
    this.loading = true;
    reportService.getMyReports()
      .then((reports) => {
        this.reports = reports;
        this.loading = false; 
      })
      .catch((err) => {
        console.error('Failed to load reports', err);
        this.loading = false;
      });
  }

  getStatusBadge(status: string | null | undefined) {
    const s = (status || '').toLowerCase();
    const variants: Record<string, { color: string; icon: string }> = {
      pending: { color: 'bg-gray-200 text-gray-700', icon: '⏰' },
      approved: { color: 'bg-green-200 text-green-700', icon: '✅' },
      rejected: { color: 'bg-red-200 text-red-700', icon: '❌' },
    };
    return variants[s] || variants['pending'];
  }
toggleSidebar() { this.isSidebarOpen = !this.isSidebarOpen; }
  toggleDarkMode() { this.isDarkMode = !this.isDarkMode; if (this.isDarkMode) document.body.classList.add('dark'); else document.body.classList.remove('dark'); }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) { this.screenWidth = event.target.innerWidth; if (this.screenWidth >= 1024) this.isSidebarOpen = true; }

  isMobile(): boolean { return this.screenWidth < 1024; }
}



