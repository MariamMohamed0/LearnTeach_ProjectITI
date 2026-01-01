import { Component, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AdminHeader } from '../../shared/admin-header/admin-header';
import { Sidebar } from '../../shared/sidebar/sidebar';
import { CreatePackageDto } from '../../../models/premium-offers';
import { PackageService } from '../../../services/api/PremiumOffersService';
import { TranslationService } from '../../../services/translation';

@Component({
  selector: 'app-premium-add-offer-component',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    AdminHeader,
    Sidebar,
  ],
  templateUrl: './premium-add-offer-component.html',
})
export class PremiumAddOfferComponent {

  isSidebarOpen = true;
  isDarkMode = false;
  screenWidth = window.innerWidth;

  nameExists = false;

  newPackage: CreatePackageDto = {
    packageName: '',
    packageDetails: '',
    packageDuration: '',     // ← Backend expects STRING
    diamondPoints: 0,
    packagePrice: 0
  };

  isSaving = false;

  constructor(
    private packageService: PackageService,
    private router: Router,
    public t: TranslationService
  ) {
    this.isSidebarOpen = !this.isMobile();
  }

  tr(key: string) {
    return this.t.translate(key);
  }

  // -------- TRIM FUNCTION --------
  trimName() {
    // لو undefined يبقى empty string قبل trim
    this.newPackage.packageName = (this.newPackage.packageName || '').replace(/^\s+/, '');
  }

  // -------- CHECK IF NAME EXISTS --------
  checkNameExists() {
    const name = (this.newPackage.packageName || '').trim();
    if (!name) return;

    this.packageService.getAllPackages().subscribe(all => {
      this.nameExists = all.some(
        x => (x.packageName || '').trim().toLowerCase() === name.toLowerCase()
      );
    });
  }

  // -------- ADD PACKAGE --------
  createPackage(form: any) {
    if (form.invalid || this.nameExists) return;

    this.isSaving = true;

    // تحويلات مهمة قبل الإرسال للـ Backend
    const dtoToSend: CreatePackageDto = {
      ...this.newPackage,
      packageDuration: String(this.newPackage.packageDuration), // number → string
      diamondPoints: Number(this.newPackage.diamondPoints),
      packagePrice: Number(this.newPackage.packagePrice)
    };


    this.packageService.createPackage(dtoToSend).subscribe({
      next: () => {
        this.isSaving = false;
        this.router.navigate(['/admin/premium-offers']);
      },
      error: err => {
        this.isSaving = false;
        console.error("API ERROR:", err);
        alert(this.tr('Failed to add package'));
      }
    });
  }


  // -------- UI CONTROLS --------
  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    document.documentElement.classList.toggle('dark', this.isDarkMode);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.screenWidth = event.target.innerWidth;
    if (!this.isMobile()) this.isSidebarOpen = true;
  }

  isMobile(): boolean {
    return this.screenWidth < 1024;
  }
}
