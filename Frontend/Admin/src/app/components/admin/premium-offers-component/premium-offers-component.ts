import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Sidebar } from '../../shared/sidebar/sidebar';
import { AdminHeader } from '../../shared/admin-header/admin-header';
import { Package } from '../../../models/premium-offers';
import { PackageService } from '../../../services/api/PremiumOffersService';
import { TranslationService } from '../../../services/translation';



@Component({
  standalone: true,
  selector: 'app-premium-offers-component',
  imports: [
    CommonModule,
    FormsModule,
    Sidebar,
    AdminHeader,
    RouterModule
  ],
  templateUrl: './premium-offers-component.html',
})
export class PremiumOffersComponent implements OnInit {

  packages: Package[] = [];
  isSidebarOpen = true;
  isDarkMode = false;
  screenWidth = window.innerWidth;

  constructor(
    private packageService: PackageService,
    public t: TranslationService
  ) { }

  ngOnInit(): void {
    this.loadPackages();
  }

  tr(key: string) {
    return this.t.translate(key);
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

  loadPackages() {
    this.packageService.getAllPackages().subscribe(res => {
      this.packages = res;
    });
  }

  deletePackage(id: number) {
    if (confirm(this.tr('Are you sure you want to delete this package?'))) {
      this.packageService.deletePackage(id).subscribe(() => {
        this.packages = this.packages.filter(p => p.packageId !== id);
      }, error => {
        alert(this.tr('Failed to delete the package'));
        console.error(error);
      });
    }
  }
}
