import { Component, HostListener } from '@angular/core';

import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Sidebar } from '../../shared/sidebar/sidebar';
import { AdminHeader } from '../../shared/admin-header/admin-header';
import { DiamondOffer } from '../../../models/diamond-offers';
import { DiamondOffersService } from '../../../services/api/DiamondOffersService';
import { TranslationService } from '../../../services/translation';

@Component({
  selector: 'app-diamond-offers-component',
  imports: [CommonModule, RouterModule, Sidebar, AdminHeader],
  standalone: true,
  templateUrl: './diamond-offers-component.html',
})
export class DiamondOffersComponent {
  offers: DiamondOffer[] = [];
  isSidebarOpen = true;
  isDarkMode = false;
  screenWidth = window.innerWidth;

  constructor(
    private offersService: DiamondOffersService,
    public t: TranslationService
  ) {
    this.loadOffers();
  }

  tr(key: string) {
    return this.t.translate(key);
  }

  loadOffers() {
    this.offersService.getAll().subscribe({
      next: (data) => (this.offers = data),
      error: (err) => console.error(err)
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

  deleteOffer(id: number) {
    if (confirm(this.tr('CONFIRM_DELETE'))) {
      this.offersService.delete(id).subscribe({
        next: () => {
          // تحديث العرض محليًا بعد الحذف لتجنب إعادة تحميل من السيرفر
          this.offers = this.offers.filter(o => o.diamondPackageId !== id);
        },
        error: (err) => console.error(err)
      });
    }
  }
}
