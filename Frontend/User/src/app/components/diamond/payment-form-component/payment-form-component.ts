import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DiamondService } from '../../../services/api/diamondService';
import { PaymentService } from '../../../services/api/paymentService';
import { PaymentInitiateDto } from '../../../models/payment';

import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslationService } from '../../../services/translation';
import { Sidestudent } from '../../shared/sidestudent/sidestudent';
import { UserHeader } from '../../shared/user-header/user-header';

@Component({
  selector: 'app-payment-form-component',
  standalone: true,
  imports: [FormsModule, CommonModule, Sidestudent, UserHeader],
  templateUrl: './payment-form-component.html'
})
export class PaymentFormComponent implements OnInit {

  userId!: number;
  packageId!: number;
  diamonds!: number;
  priceEGP!: number;
  screenWidth: number = window.innerWidth;

  isSidebarOpen = true;
  isDarkMode = false;

  cardType: 'Visa' | 'Mastercard' | '' = '';
  cardNumber = '';
  cardHolder = '';
  expiry = '';
  cvv = '';

  loading = false;
  successMessage = '';
  errorMessage = '';
  purchaseInProgress = false; // لمنع الضغط المتكرر

  errors = {
    cardNumber: '',
    cardHolder: '',
    expiry: '',
    cvv: ''
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private paymentService: PaymentService,
    private diamondService: DiamondService,
    public t: TranslationService
  ) { }

  tr(key: string) {
    return this.t.translate(key);
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.userId = +params['userId'];
      this.packageId = +params['packageId'];
      this.diamonds = +params['diamonds'];
      this.priceEGP = +params['priceEGP'];
    });
  }

  validateCard() {
    this.errors = { cardNumber: '', cardHolder: '', expiry: '', cvv: '' };

    if (!/^\d{16}$/.test(this.cardNumber.replace(/\s+/g, ''))) {
      this.errors.cardNumber = this.tr('INVALID_CARD_NUMBER');
    }

    if (!/^[a-zA-Z ]{3,}$/.test(this.cardHolder.trim())) {
      this.errors.cardHolder = this.tr('INVALID_CARD_HOLDER');
    }

    if (!/^\d{2}\/\d{2}$/.test(this.expiry)) {
      this.errors.expiry = this.tr('INVALID_EXPIRY');
    } else {
      const [month, year] = this.expiry.split('/').map(Number);
      if (month < 1 || month > 12) {
        this.errors.expiry = this.tr('INVALID_EXPIRY');
      }
    }

    if (!/^\d{3,4}$/.test(this.cvv)) {
      this.errors.cvv = this.tr('INVALID_CVV');
    }

    return Object.values(this.errors).every(e => e === '');
  }

  async purchase() {
    if (!this.validateCard()) return;

    if (!this.cardType) {
      this.errorMessage = this.tr('SELECT_CARD_TYPE');
      return;
    }

    if (this.purchaseInProgress) return;
    this.purchaseInProgress = true;
    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    try {
      const payload: PaymentInitiateDto = {
        userId: this.userId,
        amount: this.priceEGP,
        currency: 'EGP',
        visa: this.cardType === 'Visa',
        mastercard: this.cardType === 'Mastercard'
      };

      await this.paymentService.initiatePayment(payload).toPromise();
      await this.diamondService.purchasePackage({
        userId: this.userId,
        diamondPackageId: this.packageId
      }).toPromise();

      this.successMessage = this.tr('PURCHASE_SUCCESS');

      // توليد الماس مباشرة
      this.createConfetti();

      // الانتقال للصفحة بعد 1.5 ثانية
      setTimeout(() => {
        this.router.navigate(['/diamonds']);
      }, 5000);

    } catch (err: any) {
      console.error(err);
      this.errorMessage = this.tr('PURCHASE_FAILED');
    } finally {
      this.loading = false;
      this.purchaseInProgress = false;
    }
  }

  toggleSidebar() { this.isSidebarOpen = !this.isSidebarOpen; }
  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    if (this.isDarkMode) document.body.classList.add('dark');
    else document.body.classList.remove('dark');
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.screenWidth = event.target.innerWidth;
    if (this.screenWidth >= 1024) this.isSidebarOpen = true;
  }
  isMobile(): boolean { return this.screenWidth < 1024; }

  // -------------------------
  // دالة إنشاء الماس مباشرة في DOM
  // -------------------------
  createConfetti() {
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.pointerEvents = 'none';
    container.style.zIndex = '9999';
    document.body.appendChild(container);

    const totalDiamonds = 50;

    for (let i = 0; i < totalDiamonds; i++) {
      setTimeout(() => {
        const diamond = document.createElement('div');
        diamond.innerText = '💎';
        diamond.style.position = 'absolute';
        diamond.style.top = '-50px';
        diamond.style.left = Math.random() * 100 + 'vw';
        diamond.style.fontSize = (16 + Math.random() * 24) + 'px';
        diamond.style.transition = 'transform 3s linear, top 3s linear, left 3s linear';
        container.appendChild(diamond);

        // حركة عشوائية جانبية أثناء السقوط
        const endLeft = Math.random() * 100; // نسبة من الشاشة
        const rotate = Math.random() * 720 - 360; // دوران عشوائي

        setTimeout(() => {
          diamond.style.top = '100vh';
          diamond.style.left = endLeft + 'vw';
          diamond.style.transform = `rotate(${rotate}deg)`;
        }, 50);
      }, i * 100); // تأخير تدريجي لكل ماسة
    }

    // إزالة كل الماس بعد انتهاء السقوط
    setTimeout(() => {
      document.body.removeChild(container);
    }, 5000 + totalDiamonds * 100);
  }

}
