import { Component, OnInit, HostListener } from '@angular/core';
import { PackageService } from '../../../services/api/packageService';
import { Package } from '../../../models/package';
import { Router } from '@angular/router';
import { TranslationService } from '../../../services/translation';
import { AuthService } from '../../../services/api/authService';
import { NgIf, NgFor, NgClass, CommonModule } from '@angular/common';
import { Location } from '@angular/common';
import { Sidestudent } from '../../shared/sidestudent/sidestudent';
import { UserHeader } from '../../shared/user-header/user-header';

@Component({
  selector: 'app-premium-popup',
  standalone: true,
  imports: [NgIf, NgFor, NgClass, CommonModule, Sidestudent, UserHeader],
  templateUrl: './premium-popup-component.html',
})
// export class PremiumPopupComponent implements OnInit {

//   isDark = document.documentElement.classList.contains('dark');
//   userId!: number;
//   userPackages: Package[] = [];
//   allPackages: Package[] = [];
//   loading = true;
//   screenWidth: number = window.innerWidth;
//   isSidebarOpen = true;
//   isDarkMode = false;
//   constructor(
//     private packageService: PackageService,
//     private router: Router,
//     public t: TranslationService,
//     private auth: AuthService,
//     private location: Location
//   ) { }

//   ngOnInit(): void {
//     this.userId = this.auth.currentUser?.userId;
//     if (!this.userId) {
//       console.error('User not logged in!');
//       this.loading = false;
//       return;
//     }
//     this.loadPackages();

//     const htmlEl = document.documentElement;
//     const observer = new MutationObserver(() => {
//       this.isDark = htmlEl.classList.contains('dark');
//     });
//     observer.observe(htmlEl, { attributes: true, attributeFilter: ['class'] });
//   }

//   tr(key: string) {
//     return this.t.translate(key);
//   }

//   loadPackages() {
//     this.loading = true;

//     //   this.packageService.getUserPackages(this.userId).subscribe({
//     //     next: (userPkgs) => {
//     //       this.userPackages = userPkgs;
//     //       this.packageService.getAllPackages().subscribe({
//     //         next: (allPkgs) => {
//     //           this.allPackages = allPkgs;
//     //           this.loading = false;
//     //         },
//     //         error: (err) => {
//     //           console.error('Error loading all packages', err);
//     //           this.loading = false;
//     //         },
//     //       });
//     //     },
//     //     error: (err) => {
//     //       console.error('Error loading user packages', err);
//     //       this.loading = false;
//     //     },
//     //   });
//     // }

//     // تأكد إن userId موجود
//     console.log('User ID:', this.userId);

//     console.log('قبل استدعاء الخدمة');

//     this.packageService.getUserPackages(this.userId).subscribe({
//       next: (userPkgs) => {
//         console.log('داخل subscribe'); // لازم يظهر ده

//         this.userPackages = userPkgs;

//         // تحقق شامل للبيانات
//         if (userPkgs && (Array.isArray(userPkgs) ? userPkgs.length > 0 : Object.keys(userPkgs).length > 0)) {
//           console.log('تم استلام بيانات:', userPkgs);
//         } else {
//           console.log('لا توجد بيانات رجعت من السيرفر');
//         }
//       },
//       error: (err) => {
//         console.error('حدث خطأ أثناء جلب البيانات:', err);
//       },
//       complete: () => {
//         console.log('انتهى الـ Observable'); // يظهر حتى لو الداتا فاضية
//       }
//     });
//   }

//   convertToEGP(priceUSD: number): number {
//     return Math.round(priceUSD * 48);
//   }

//   selectPackage(pkg: Package) {
//     if (!pkg.packageId) return;
//     this.router.navigate(['/premium/payment'], {
//       state: {
//         userId: this.userId,
//         packageId: pkg.packageId,
//         packageName: pkg.packageName,
//         packagePrice: this.convertToEGP(pkg.packagePrice),
//         diamondPoints: pkg.diamondPoints,
//         packageDuration: this.tr('PACKAGE_DURATION') + ': ' + pkg.packageDuration,
//         currency: 'EGP',
//         visa: false,
//         mastercard: false,
//       },
//     });
//   }



//   daysLeft(endDate?: string): number {
//     if (!endDate) return 0;
//     const diff = new Date(endDate).getTime() - new Date().getTime();
//     return Math.ceil(diff / (1000 * 3600 * 24));
//   }

//   closeModal() {
//     this.location.back(); // ترجع خطوة في history
//   }

//   @HostListener('document:click', ['$event'])
//   onClickOutside(event: Event) {
//     const target = event.target as HTMLElement;
//     if (!target.closest('.popup-container')) {
//       this.closeModal();
//     }
//   }

//   toggleSidebar() { this.isSidebarOpen = !this.isSidebarOpen; }
//   toggleDarkMode() { this.isDarkMode = !this.isDarkMode; if (this.isDarkMode) document.body.classList.add('dark'); else document.body.classList.remove('dark'); }

//   @HostListener('window:resize', ['$event'])
//   onResize(event: any) { this.screenWidth = event.target.innerWidth; if (this.screenWidth >= 1024) this.isSidebarOpen = true; }
//   isMobile(): boolean { return this.screenWidth < 1024; }
// }


export class UserPackagesComponent implements OnInit {
  userPackages: any[] = [];
  userId = 123; // تأكد من الـ userId
  constructor(private packageService: PackageService) { }

  ngOnInit() {
    console.log('Component initialized'); // لازم يظهر
    this.loadPackages();
  }

  loadPackages() {
    console.log('قبل استدعاء الخدمة');
    this.packageService.getUserPackages(this.userId).subscribe({
      next: (data) => console.log('داخل subscribe', data),
      error: (err) => console.error('خطأ', err),
      complete: () => console.log('انتهى الـ Observable')
    });
  }
}
