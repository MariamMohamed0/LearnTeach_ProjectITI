import { Component, OnInit, ChangeDetectorRef, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentService } from '../../../services/api/paymentService';
import { PaymentInitiateDto, PaymentHistoryDto } from '../../../models/payment';
import { Package } from '../../../models/package';
import { TranslationService } from '../../../services/translation';
import { NgIf, NgClass, NgFor, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'
import { firstValueFrom } from 'rxjs';
import { UserHeader } from '../../shared/user-header/user-header';

@Component({
  selector: 'app-package-payment-form-component',
  templateUrl: './package-payment-form-component.html',
  standalone: true,
  imports: [NgIf, NgFor, NgClass, FormsModule, UserHeader, CommonModule],
})
export class PremiumPaymentFormComponent implements OnInit {
  pkg!: Package;
  userId!: number;
  amount!: number;
  currency: string = 'EGP';
  visa = false;
  mastercard = false;

  loading = true;
  processing = false;
  paymentHistory!: PaymentHistoryDto;
  successMessage = '';
  screenWidth: number = window.innerWidth;
  isSidebarOpen = true;
  isDarkMode = false;
  // بيانات البطاقة الوهمية
  cardNumber = '';
  cardExpiry = '';
  cardCvv = '';
  cardHolder = '';

  cardErrors = {
    number: '',
    expiry: '',
    cvv: '',
    holder: ''
  };

  validateCardNumber() {
    const value = this.cardNumber?.trim() || '';
    const regex = /^[0-9]{16}$/;

    if (!value) this.cardErrors.number = this.tr('CARD_REQUIRED');
    else if (!regex.test(value.replace(/\s+/g, '')))
      this.cardErrors.number = this.tr('CARD_NUMBER_INVALID');
    else this.cardErrors.number = '';
  }

  validateExpiry() {
    const value = this.cardExpiry?.trim() || '';
    const regex = /^(0[1-9]|1[0-2])\/\d{2}$/;

    if (!value) this.cardErrors.expiry = this.tr('CARD_REQUIRED');
    else if (!regex.test(value))
      this.cardErrors.expiry = this.tr('EXPIRY_INVALID');
    else this.cardErrors.expiry = '';
  }

  validateCVV() {
    const value = this.cardCvv?.trim() || '';
    const regex = /^[0-9]{3}$/;

    if (!value) this.cardErrors.cvv = this.tr('CARD_REQUIRED');
    else if (!regex.test(value))
      this.cardErrors.cvv = this.tr('CVV_INVALID');
    else this.cardErrors.cvv = '';
  }

  validateCardHolder() {
    const value = this.cardHolder?.trim() || '';
    const regex = /^[a-zA-Z ]{3,}$/;

    if (!value) this.cardErrors.holder = this.tr('CARD_REQUIRED');
    else if (!regex.test(value))
      this.cardErrors.holder = this.tr('CARD_HOLDER_INVALID');
    else this.cardErrors.holder = '';
  }


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private paymentService: PaymentService,
    public t: TranslationService,
    private cd: ChangeDetectorRef
  ) { }

  tr(key: string) {
    return this.t.translate(key);
  }
  close() {
    this.router.navigate(['/premium']);
  }


  ngOnInit(): void {
    const state = history.state;
    this.userId = state.userId;
    const packageId = state.packageId;
    this.amount = state.packagePrice;
    this.currency = state.currency || 'EGP';
    this.visa = state.visa || false;
    this.mastercard = state.mastercard || false;

    if (!this.userId || !packageId) {
      alert('Missing user or package data!');
      this.router.navigate(['/premium']);
      return;
    }

    this.paymentService.getPackageById(packageId).subscribe(pkg => {
      this.pkg = pkg;
      this.loading = false;
    });

    // مراقبة تغييرات Dark/Light mode
    const observer = new MutationObserver(() => this.cd.detectChanges());
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
  }

  selectPaymentMethod(method: 'visa' | 'mastercard') {
    this.visa = method === 'visa';
    this.mastercard = method === 'mastercard';
  }

  async pay() {
    if (!this.visa && !this.mastercard) {
      alert('Please select a payment method.');
      return;
    }

    if (!this.cardNumber || !this.cardExpiry || !this.cardCvv || !this.cardHolder) {
      alert('Please fill in all card details.');
      return;
    }

    this.validateCardNumber();
    this.validateExpiry();
    this.validateCVV();
    this.validateCardHolder();

    if (
      this.cardErrors.number ||
      this.cardErrors.expiry ||
      this.cardErrors.cvv ||
      this.cardErrors.holder
    ) {
      this.processing = false;
      return;
    }

    this.processing = true;

    const paymentDto: PaymentInitiateDto = {
      userId: this.userId,
      amount: this.amount,
      currency: this.currency,
      visa: this.visa,
      mastercard: this.mastercard
    };

    try {
      this.paymentHistory = await firstValueFrom(this.paymentService.initiatePayment(paymentDto));
      await firstValueFrom(this.paymentService.purchasePackage({
        userId: this.userId,
        packageId: this.pkg.packageId
      }));

      this.successMessage = this.tr('PURCHASE_SUCCESS');
      this.createPremiumCelebration();


      setTimeout(() => this.router.navigate(['/premium']), 5000);

    } catch (err: any) {
      alert(err?.message || 'Payment failed');
      this.processing = false;
    }
  }

  createPremiumCelebration() {

    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.pointerEvents = 'none';
    container.style.zIndex = '99999';
    document.body.appendChild(container);

    // ---------------------------
    // 1) التيجان - نصف يسار الشاشة
    // ---------------------------
    for (let i = 0; i < 35; i++) {
      const crown = document.createElement('div');
      crown.innerText = '👑';

      crown.style.position = 'absolute';

      // توزيع أفقي محسوب (10vw → 45vw)
      crown.style.left = (10 + Math.random() * 35) + 'vw';

      // توزيع رأسي من فوق (عشان ميبقوش لازقين)
      crown.style.top = (-Math.random() * 200) + 'px';

      crown.style.fontSize = `${28 + Math.random() * 18}px`;
      crown.style.opacity = `${0.85 + Math.random() * 0.15}`;

      crown.style.transition = 'transform 6s linear, top 6s linear';

      container.appendChild(crown);

      setTimeout(() => {
        crown.style.top = '110vh';
        crown.style.transform = `rotate(${Math.random() * 360}deg)`;
      }, Math.random() * 300);
    }

    // ---------------------------
    // 2) النجوم اللامعة - نصف يمين الشاشة
    // ---------------------------
    const stars = ['✨', '⭐', '🌟'];

    for (let i = 0; i < 35; i++) {
      const star = document.createElement('div');
      star.innerText = stars[Math.floor(Math.random() * stars.length)];

      star.style.position = 'absolute';

      // توزيع أفقي محسوب (55vw → 90vw)
      star.style.left = (55 + Math.random() * 35) + 'vw';

      star.style.top = (-Math.random() * 250) + 'px';

      star.style.fontSize = `${20 + Math.random() * 12}px`;
      star.style.opacity = `${0.7 + Math.random() * 0.3}`;

      star.style.transition = 'transform 7s ease-out, top 7s ease-out';

      container.appendChild(star);

      setTimeout(() => {
        star.style.top = '110vh';
        star.style.transform =
          `rotate(${50 + Math.random() * 80}deg) scale(${1 + Math.random() * 0.7})`;
      }, Math.random() * 400);
    }

    // ---------------------------
    // إزالة بعد 10 ثواني
    // ---------------------------
    setTimeout(() => {
      document.body.removeChild(container);
    }, 5000);
  }



  toggleSidebar() { this.isSidebarOpen = !this.isSidebarOpen; }
  toggleDarkMode() { this.isDarkMode = !this.isDarkMode; if (this.isDarkMode) document.body.classList.add('dark'); else document.body.classList.remove('dark'); }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) { this.screenWidth = event.target.innerWidth; if (this.screenWidth >= 1024) this.isSidebarOpen = true; }
  isMobile(): boolean { return this.screenWidth < 1024; }
}
