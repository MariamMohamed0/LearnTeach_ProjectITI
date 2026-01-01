import { Component, OnInit, ChangeDetectorRef, HostListener } from '@angular/core';
import { DiamondService } from '../../../services/api/diamondService';
import { AuthService } from '../../../services/api/authService';
import { DiamondPackage, Diamond } from '../../../models/diamond';
import { TranslationService } from '../../../services/translation';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Navbar } from '../../shared/navbar/navbar';
import { NgIf, NgClass, NgFor } from '@angular/common';
import { Sidestudent } from '../../shared/sidestudent/sidestudent';
import { UserHeader } from '../../shared/user-header/user-header';

@Component({
  standalone: true,
  selector: 'app-diamond-popup-component',
  imports: [CommonModule, RouterModule, Navbar, Sidestudent, UserHeader,],
  templateUrl: './diamond-popup-component.html',
})
export class DiamondPopupComponent implements OnInit {

  userId!: number;
  userPoints: Diamond | null = null;
  packages: DiamondPackage[] = [];
  loading = true;
  screenWidth: number = window.innerWidth;
  isSidebarOpen = true;
  isDarkMode = false;
  constructor(
    private diamondService: DiamondService,
    public t: TranslationService,
    private auth: AuthService,
    private cd: ChangeDetectorRef,
    private router: Router
  ) { }

  tr(key: string) {
    return this.t.translate(key);
  }

  ngOnInit(): void {
    this.userId = this.auth.currentUser?.userId;
    if (!this.userId) {
      console.error(this.tr('NO_USER_FOUND'));
      return;
    }

    this.cd.markForCheck();
    this.t.currentLang$.subscribe(() => this.cd.markForCheck());

    this.loadUserData();
  }

  loadUserData() {
    this.loading = true;
    this.cd.markForCheck();

    this.diamondService.getUserPoints(this.userId).subscribe({
      next: (res) => { this.userPoints = res; this.cd.markForCheck(); },
      error: (err) => console.error(err),
      complete: () => { this.loading = false; this.cd.markForCheck(); },
    });

    this.diamondService.getPackages().subscribe({
      next: (res) => { this.packages = res; this.cd.markForCheck(); },
      error: (err) => console.error(err),
    });
  }

  goToPayment(pkgId: number) {
    const selectedPackage = this.packages.find(p => p.diamondPackageId === pkgId);
    if (!selectedPackage) return;

    const priceInEGP = selectedPackage.price * 50; // مثال تحويل من $ لـ EGP

    this.router.navigate(['/payment/form'], {
      queryParams: {
        userId: this.userId,
        packageId: pkgId,
        diamonds: selectedPackage.diamondAmount,
        priceEGP: priceInEGP
      }
    });
  }

  closeModal() {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      this.router.navigate(['/']);
    }
  }
  toggleSidebar() { this.isSidebarOpen = !this.isSidebarOpen; }
  toggleDarkMode() { this.isDarkMode = !this.isDarkMode; if (this.isDarkMode) document.body.classList.add('dark'); else document.body.classList.remove('dark'); }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) { this.screenWidth = event.target.innerWidth; if (this.screenWidth >= 1024) this.isSidebarOpen = true; }
  isMobile(): boolean { return this.screenWidth < 1024; }
}
