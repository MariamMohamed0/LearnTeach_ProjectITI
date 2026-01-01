import { Component, HostListener, OnInit, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidationErrors
} from '@angular/forms';

import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DiamondOffersService } from '../../../services/api/DiamondOffersService';
import { TranslationService } from '../../../services/translation';
import { CreateDiamondOfferRequest, DiamondOffer } from '../../../models/diamond-offers';
import { AdminHeader } from '../../shared/admin-header/admin-header';
import { Sidebar } from '../../shared/sidebar/sidebar';

@Component({
  selector: 'app-create-new-diamond-package',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, Sidebar, AdminHeader],
  templateUrl: './create-new-diamond-package-component.html',
  styleUrls: ['./create-new-diamond-package-component.css'],
})
export class CreateNewDiamondPackageComponent implements OnInit {

  service = inject(DiamondOffersService);
  router = inject(Router);
  t = inject(TranslationService);

  existingOffers: DiamondOffer[] = [];
  isSidebarOpen = true;
  isDarkMode = false;
  screenWidth: number = window.innerWidth;

  form = new FormGroup({
    title: new FormControl('', [
      Validators.required,
      Validators.maxLength(200),
      this.titleValidator.bind(this),
      this.duplicateTitleValidator.bind(this)
    ]),
    diamondAmount: new FormControl(1, [
      Validators.required,
      Validators.pattern(/^[0-9]+$/),
      Validators.max(10000),
      Validators.min(1)
    ]),
    price: new FormControl(0, [
      Validators.required,
      Validators.pattern(/^[0-9]+(\.[0-9]{1,2})?$/),
      Validators.max(1000),
      Validators.min(0)
    ]),
    currency: new FormControl('USD', [
      Validators.required,
      Validators.pattern(/^(USD|EGP)$/i)
    ]),
  });

  ngOnInit(): void {
    this.service.getAll().subscribe({
      next: offers => this.existingOffers = offers,
      error: err => console.error(err)
    });
  }

  tr(key: string): string {
    return this.t.translate(key);
  }

  /** --------------------------
   *        TITLE VALIDATOR
   * --------------------------- */


  // يتحقق إن القيمة تبدأ بحرف عربي أو إنجليزي، والباقي حروف أو مسافات فقط
  titleValidator(control: AbstractControl): ValidationErrors | null {
    // 🔹 trim البداية والنهاية
    const value = control.value?.trim();
    if (!value) return { required: true };

    // تحديث قيمة الـ control بدون مسافات إضافية
    if (control.value !== value) {
      control.setValue(value, { emitEvent: false });
    }

    // regex: يبدأ بحرف عربي أو إنجليزي، باقي الحروف عربي/إنجليزي/مسافة
    if (!/^[A-Za-z\u0600-\u06FF][A-Za-z\u0600-\u06FF ]*$/.test(value)) {
      return { invalidStart: 'Title must start with a letter (Arabic or English) and contain only letters or spaces' };
    }

    return null;
  }


  // 2️⃣ التحقق من التكرار
  duplicateTitleValidator(control: AbstractControl): ValidationErrors | null {
    if (!this.existingOffers?.length) return null;

    const value = control.value?.trim().toLowerCase();
    if (!value) return null;

    const exists = this.existingOffers.some(
      o => o.title.trim().toLowerCase() === value
    );

    return exists ? { duplicate: true } : null;
  }

  /** --------------------------
   *        ERROR MESSAGES
   * --------------------------- */
  getError(field: string): string | null {
    const control = this.form.get(field);
    if (!control || !control.touched) return null;

    if (control.errors?.['required'])
      return this.tr('REQUIRED') || 'مطلوب';

    if (control.errors?.['maxlength'])
      return `${this.tr('TITLE')} ${this.tr('TOO_LONG')}`;

    if (control.errors?.['invalidStart'])
      return control.errors['invalidStart'];

    if (control.errors?.['duplicate'])
      return this.tr('OFFER_ALREADY_EXISTS') || 'This offer already exists!';

    if (control.errors?.['min'])
      return `${field} ${this.tr('MIN_VALUE')}`;

    if (control.errors?.['max'])
      return `${field} ${this.tr('MAX_VALUE')}`;

    if (control.errors?.['pattern'])
      return `${field} ${this.tr('INVALID')}`;

    return null;
  }

  /** -------------------------- */

  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const dto = this.form.value as CreateDiamondOfferRequest;

    this.service.create(dto).subscribe({
      next: () => this.router.navigate(['/admin/diamonds-offers']),
      error: err => console.error(err)
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
