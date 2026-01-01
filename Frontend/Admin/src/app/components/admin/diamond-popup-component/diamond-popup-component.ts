// src/app/components/diamond-popup/diamond-popup.component.ts

import { Component, HostListener, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Diamond, DiamondPackage } from '../../../models/diamond';
import { DiamondService } from '../../../services/api/diamondService';
import { TranslationService } from '../../../services/translation';
import { FormsModule } from '@angular/forms';
import { Sidebar } from '../../shared/sidebar/sidebar';
import { AdminHeader } from '../../shared/admin-header/admin-header';

@Component({
  standalone: true,
  selector: 'app-diamond-popup',
  imports: [CommonModule, RouterModule, FormsModule, Sidebar, AdminHeader],
  templateUrl: './diamond-popup-component.html',
})
export class DiamondPopupComponent implements OnInit {
  userId = 1; 
  userPoints: Diamond | null = null;
  packages: DiamondPackage[] = [];
  loading = true;
    isSidebarOpen = true;
  isDarkMode = false;
  screenWidth: number = window.innerWidth;

  constructor(private diamondService: DiamondService, public t: TranslationService) { }

  ngOnInit(): void {
    this.loadUserData();
  }

  tr(key: string) {
    return this.t.translate(key);
  }

  loadUserData() {
    this.loading = true;
    this.diamondService.getUserPoints(this.userId).subscribe({
      next: (res) => this.userPoints = res,
      error: (err) => console.error(err),
      complete: () => this.loading = false
    });

    this.diamondService.getPackages().subscribe({
      next: (res) => this.packages = res,
      error: (err) => console.error(err)
    });
  }

  purchase(pkgId: number) {
    this.diamondService.purchasePackage({ userId: this.userId, diamondPackageId: pkgId })
      .subscribe({
        next: (res) => {
          alert(this.tr('PURCHASE_SUCCESS'));
          this.loadUserData();
        },
        error: (err) => alert(this.tr('PURCHASE_FAILED'))
      });
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
}
