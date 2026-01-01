import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Sidebar } from '../../shared/sidebar/sidebar';
import { AdminHeader } from '../../shared/admin-header/admin-header';
import { UpdatePackageDto, Package } from '../../../models/premium-offers';
import { PackageService } from '../../../services/api/PremiumOffersService';
import { TranslationService } from '../../../services/translation';

@Component({
  standalone: true,
  selector: 'app-premium-offers-edit-component',
  imports: [
    CommonModule,
    FormsModule,
    Sidebar,
    AdminHeader,
  ],
  templateUrl: './premium-offers-edit-component.html'
})
export class PremiumOffersEditComponent implements OnInit {

  packageId!: number;
  formData: UpdatePackageDto = {
    packageName: '',
    packageDetails: '',
    packageDuration: '',
    diamondPoints: 0,
    packagePrice: 0
  };

  isSaving: boolean = false;
  isSidebarOpen = true;
  isDarkMode = false;
  screenWidth: number = window.innerWidth;

  allPackages: Package[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private packageService: PackageService,
    public t: TranslationService
  ) { }

  ngOnInit(): void {
    this.packageId = Number(this.route.snapshot.paramMap.get('id'));

    this.packageService.getAllPackages().subscribe(res => {
      this.allPackages = res;
      const found = res.find(p => p.packageId === this.packageId);
      if (found) {
        this.formData = { ...found };
      }
    });
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

  // ===== Validation Functions =====

  get packageNameError(): string | null {
    const name = this.formData.packageName.trim();
    if (!name) return this.tr('REQUIRED_FIELD');
    if (name.length > 50) return this.tr('MAX_50_CHARS');
    if (!/^[A-Za-z\u0600-\u06FF\s]+$/.test(name)) return this.tr('ONLY_LETTERS_SPACES');
    if (this.allPackages.some(p => p.packageName.toLowerCase() === name.toLowerCase() && p.packageId !== this.packageId)) {
      return this.tr('NAME_EXISTS');
    }
    return null;
  }

  get packageDetailsError(): string | null {
    const val = this.formData.packageDetails || '';
    if (val.length > 200) return this.tr('MAX_200_CHARS');
    if (!/^[A-Za-z0-9\u0600-\u06FF\s\-]*$/.test(val)) return this.tr('ONLY_LETTERS_NUMBERS_SPACES_DASH');
    return null;
  }

  get packagePriceError(): string | null {
    if (this.formData.packagePrice == null) return this.tr('REQUIRED_FIELD');
    if (this.formData.packagePrice <= 0 || this.formData.packagePrice > 1000) return this.tr('PRICE_RANGE');
    return null;
  }

  get diamondPointsError(): string | null {
    if (this.formData.diamondPoints == null) return this.tr('REQUIRED_FIELD');
    if (this.formData.diamondPoints <= 0 || this.formData.diamondPoints > 5000) return this.tr('POINTS_RANGE');
    return null;
  }

  get packageDurationError(): string | null {
    const num = Number(this.formData.packageDuration);
    if (!this.formData.packageDuration) return this.tr('REQUIRED_FIELD');
    if (isNaN(num) || num < 1 || num > 12) return this.tr('DURATION_RANGE');
    return null;
  }

  isFormValid(): boolean {
    return !this.packageNameError &&
      !this.packagePriceError &&
      !this.diamondPointsError &&
      !this.packageDurationError &&
      !this.packageDetailsError;
  }

  save() {
    // trim fields before saving
    this.formData.packageName = this.formData.packageName.trim();
    this.formData.packageDetails = this.formData.packageDetails.trim();
    this.formData.packageDuration = this.formData.packageDuration.trim();

    if (!this.isFormValid()) return;

    this.isSaving = true;
    this.packageService.updatePackage(this.packageId, this.formData).subscribe({
      next: () => {
        this.isSaving = false;
        alert(this.tr('PACKAGE_UPDATED'));
        this.router.navigate(['/admin/premium-offers']);
      },
      error: (err) => {
        this.isSaving = false;
        alert(this.tr('PACKAGE_UPDATE_FAILED') + ': ' + err.message);
      }
    });
  }

  cancel() {
    this.router.navigate(['/admin/premium-offers']);
  }

}
