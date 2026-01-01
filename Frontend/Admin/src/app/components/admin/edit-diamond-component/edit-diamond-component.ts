import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ReactiveFormsModule, AsyncValidatorFn } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Sidebar } from '../../shared/sidebar/sidebar';
import { AdminHeader } from '../../shared/admin-header/admin-header';
import { DiamondOffer, UpdateDiamondPackageRequest } from '../../../models/diamond-offers';
import { DiamondOffersService } from '../../../services/api/DiamondOffersService';
import { TranslationService } from '../../../services/translation';
import { debounceTime, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-edit-diamond-component',
  imports: [CommonModule, Sidebar, AdminHeader, ReactiveFormsModule],
  standalone: true,
  templateUrl: './edit-diamond-component.html',
  styleUrls: ['./edit-diamond-component.css']
})
export class EditDiamondComponent implements OnInit {

  editForm!: FormGroup;
  loading = true;
  saving = false;
  isSidebarOpen = true;
  isDarkMode = false;
  screenWidth = window.innerWidth;
  packageId!: number;
  packageData!: DiamondOffer;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private diamondService: DiamondOffersService,
    private fb: FormBuilder,
    public t: TranslationService
  ) { }

  tr(key: string) {
    return this.t.translate(key);
  }

  ngOnInit(): void {
    this.packageId = Number(this.route.snapshot.paramMap.get('id'));

    this.editForm = this.fb.group({
      title: ['', [
        Validators.required,
        Validators.maxLength(250),
        this.packageNameValidator()

      ]],

      diamondAmount: [0, [
        Validators.required,
        Validators.min(1),
        Validators.max(1000),
        Validators.pattern(/^\d+$/)
      ]],
      price: [0, [
        Validators.required,
        Validators.min(1),
        Validators.max(500),
        Validators.pattern(/^\d+$/)
      ]],
      currency: ['', [
        Validators.required,
        this.currencyValidator(['EGP', 'USD'])
      ]]
    });

    this.loadPackage();
  }

  loadPackage(): void {
    this.diamondService.getPackageById(this.packageId).subscribe({
      next: (data) => {
        this.packageData = data;
        this.editForm.patchValue(data);

        const titleControl = this.editForm.get('title');
        titleControl?.setAsyncValidators([this.uniquePackageNameValidator()]);
        titleControl?.updateValueAndValidity();

        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  save(): void {
    if (this.editForm.invalid) {
      this.editForm.markAllAsTouched();
      return;
    }

    this.saving = true;

    const formValue = this.editForm.value;
    const request: UpdateDiamondPackageRequest = {
      id: this.packageId,
      title: formValue['title'],
      diamondAmount: formValue['diamondAmount'],
      price: formValue['price'],
      currency: formValue['currency']
    };

    this.diamondService.updatePackage(request).subscribe({
      next: () => {
        this.saving = false;
        this.router.navigate(['/admin/diamonds-offers']);
      },
      error: (err) => {
        console.error(err);
        this.saving = false;
      }
    });
  }

  uniquePackageNameValidator(): AsyncValidatorFn {
    return (control: AbstractControl) => {
      const value = (control.value || '').trim();

      // لو الاسم فارغ نرجع null (ما فيش خطأ)
      if (!value) return of(null);

      // لو الاسم ما تغيّرش عن الاسم الحالي، نرجع null مباشرة
      if (this.packageData && value.toLowerCase() === (this.packageData.title || '').trim().toLowerCase()) {
        return of(null);
      }

      // وإلا نعمل التحقق ضد باقي الباقات
      return this.diamondService.getAll().pipe(
        debounceTime(300),
        map(all => {
          const exists = all.some(pkg =>
            pkg.id !== this.packageId &&
            (pkg.title || '').trim().toLowerCase() === value.toLowerCase()
          );
          return exists ? { nameExists: true } : null;
        })
      );
    };
  }


  packageNameValidator() {
    return (control: AbstractControl): ValidationErrors | null => {
      let value = control.value as string;

      if (!value) return { required: true };

      // 🔹 إزالة المسافات البداية والنهاية
      const trimmed = value.trim();
      if (value !== trimmed) {
        control.setValue(trimmed, { emitEvent: false });
        value = trimmed;
      }

      // 🔹 regex: يبدأ بحرف عربي أو إنجليزي، الباقي حروف ومسافات
      const valid = /^[A-Za-z\u0600-\u06FF][A-Za-z\u0600-\u06FF ]*$/.test(value);

      return valid ? null : { invalidName: true };
    };
  }




  currencyValidator(allowed: string[]) {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toUpperCase();
      if (!value) return null;
      return allowed.includes(value) ? null : { invalidCurrency: true };
    };
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
