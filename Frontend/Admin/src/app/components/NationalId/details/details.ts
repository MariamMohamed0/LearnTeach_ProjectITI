import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NationalIdService } from '../../../services/api/national-id-service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Sidebar } from '../../shared/sidebar/sidebar';
import { AdminHeader } from '../../shared/admin-header/admin-header';
import { TranslationService } from '../../../services/translation';

@Component({
  selector: 'app-details',
  imports: [CommonModule,ReactiveFormsModule,FormsModule,Sidebar,AdminHeader],
  templateUrl: './details.html',
  styleUrl: './details.css',
})
export class Details implements OnInit {
  id!: number;
  data: any;
  loading = true;
  showRejectBox = false;
  rejectReason = '';
      isSidebarOpen = true;
  isDarkMode = false;
  screenWidth: number = window.innerWidth;
  constructor(
    private route: ActivatedRoute,
    private nationalIdService: NationalIdService,
    private router: Router,
    public t: TranslationService
  ) {}

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadDetails();
  }

  loadDetails() {
    this.nationalIdService.getById(this.id).subscribe({
      next: (res) => {
        this.data = res;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  approve() {
    this.nationalIdService.approve(this.id).subscribe(() => {
      alert('Approved successfully');
      this.router.navigate(['/admin/national-id']);
    });
  }

  reject() {
    if (!this.rejectReason.trim()) {
      alert('Enter rejection reason');
      return;
    }

    this.nationalIdService.reject(this.id, this.rejectReason).subscribe(() => {
      alert('Rejected successfully');
      this.router.navigate(['/admin/national-id']);
    });
  }

  delete() {
    if (confirm('Are you sure?')) {
      this.nationalIdService.delete(this.id).subscribe(() => {
        alert('Deleted successfully');
        this.router.navigate(['/admin/national-id']);
      });
    }
  }

  cancel() {
  // Navigate back to national ID list
  this.router.navigate(['/admin/national-id']);
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
