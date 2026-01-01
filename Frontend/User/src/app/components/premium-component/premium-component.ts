import { Component, OnInit, HostListener } from '@angular/core';
import { PackageService } from '../../services/api/packageService';
import { Package } from '../../models/package';
import { Router } from '@angular/router';
import { TranslationService } from '../../services/translation';
import { AuthService } from '../../services/api/authService';
import { NgIf, NgFor, NgClass, NgStyle } from '@angular/common';
import { Location } from '@angular/common';
import { Sidestudent } from '../shared/sidestudent/sidestudent';
import { UserHeader } from '../shared/user-header/user-header';

@Component({
  selector: 'app-premium-component',
  standalone: true,
  imports: [NgIf, NgFor, NgClass, NgStyle, Sidestudent, UserHeader],
  templateUrl: './premium-component.html',
})
export class PremiumComponent implements OnInit {

  userId!: number;
  userPackages: Package[] = [];
  allPackages: Package[] = [];
  loading = true;

  screenWidth: number = window.innerWidth;
  isSidebarOpen = true;
  isDarkMode = false;

  constructor(
    private packageService: PackageService,
    private router: Router,
    public t: TranslationService,
    private auth: AuthService,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.userId = this.auth.currentUser?.userId;
    if (!this.userId) {
      console.error('User not logged in!');
      this.loading = false;
      return;
    }
    this.loadPackages();
  }

  tr(key: string): string {
    return this.t.translate(key);
  }

  loadPackages() {
    this.loading = true;

    this.packageService.getUserPackages(this.userId).subscribe({
      next: (userPkgs) => {
        this.userPackages = userPkgs;
        this.packageService.getAllPackages().subscribe({
          next: (allPkgs) => {
            this.allPackages = allPkgs;
            this.loading = false;
          },
          error: (err) => {
            console.error('Error loading all packages', err);
            this.loading = false;
          }
        });
      },
      error: (err) => {
        console.error('Error loading user packages', err);
        this.loading = false;
      }
    });
  }

  convertToEGP(priceUSD: number): number {
    return Math.round(priceUSD * 48);
  }

  selectPackage(pkg: Package) {
    if (!pkg.packageId) return;
    this.router.navigate(['/premium/payment'], {
      state: {
        userId: this.userId,
        packageId: pkg.packageId,
        packageName: pkg.packageName,
        packagePrice: this.convertToEGP(pkg.packagePrice),
        diamondPoints: pkg.diamondPoints,
        packageDuration: `${this.tr('PACKAGE_DURATION')}: ${pkg.packageDuration}`,
        currency: 'EGP',
        visa: false,
        mastercard: false,
      }
    });
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }


  daysLeftFromDuration(startDate?: string, duration?: string): number {
    if (!startDate || !duration) return 0;

    const start = new Date(startDate);
    if (isNaN(start.getTime())) return 0;

    const end = new Date(start.getTime());

    let months = 0;

    // أولاً نحاول نجيب الرقم قبل "month" أو "months"
    const matchMonth = duration.match(/(\d+)\s*(?:months?|month)/i);
    if (matchMonth) {
      months = parseInt(matchMonth[1], 10);
    } else {
      // لو مفيش "month" ناخد أي رقم موجود في النص
      const matchNumber = duration.match(/(\d+)/);
      if (matchNumber) {
        months = parseInt(matchNumber[1], 10);
      }
    }

    end.setMonth(end.getMonth() + months);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    const diff = end.getTime() - today.getTime();
    const daysLeft = Math.ceil(diff / (1000 * 3600 * 24));

    return daysLeft > 0 ? daysLeft : 0;
  }


  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.screenWidth = event.target.innerWidth;
    if (this.screenWidth >= 1024) this.isSidebarOpen = true;
  }

  isMobile(): boolean {
    return this.screenWidth < 1024;
  }

  getProgressColor(daysLeft: number): string {
    if (daysLeft > 15) return '#16a34a';   // أخضر
    if (daysLeft > 5) return '#eab308';    // أصفر
    return '#dc2626';                      // أحمر
  }


  getProgressOffset(pkg: any): number {
    const daysLeft = this.daysLeftFromDuration(pkg.startDate, pkg.packageDuration);
    const totalDays = this.getTotalDays(pkg.packageDuration);

    const percent = Math.max(0, Math.min(1, daysLeft / totalDays));

    const circumference = 2 * Math.PI * 45; // ≈ 282.6
    return circumference * (1 - percent);
  }

  getTotalDays(duration: string): number {
    const match = duration.match(/(\d+)/);
    const months = match ? parseInt(match[1], 10) : 1;

    return months * 30; // تقدير طبيعي للمدة
  }


  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    if (this.isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

}
