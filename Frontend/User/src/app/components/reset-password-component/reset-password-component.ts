import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/api/authService';

@Component({
  selector: 'app-reset-password-component',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reset-password-component.html'
})
export class ResetPasswordComponent {

  form: FormGroup;
  email: string = '';
  message: string = '';
  loading = false;
  showPassword = false;       // للـ password
  showConfirmPassword = false; // للـ confirm password

  constructor(private fb: FormBuilder, private router: Router, private auth: AuthService) {
    this.form = this.fb.group({
      password: ['', [Validators.required]],
      confirmPassword: ['', Validators.required]
    });

    // تحديث الرسالة أثناء الكتابة
    this.form.valueChanges.subscribe(() => this.updateMessage());

    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state && navigation.extras.state['email']) {
      this.email = navigation.extras.state['email'];
    }
  }

  updateMessage() {
    const pwd = this.form.get('password')?.value || '';
    const confirm = this.form.get('confirmPassword')?.value || '';

    // تحقق من شروط الباسورد
    if (pwd && (pwd.length < 8 || !/[A-Z]/.test(pwd) || !/[a-z]/.test(pwd) || !/[0-9!@#$%^&*(),.?":{}|<>]/.test(pwd))) {
      this.message = 'Password must be at least 8 characters, include uppercase, lowercase, and number/symbol';
    }
    // تحقق من الكونفيرم فارغ
    else if (!confirm) {
      this.message = 'Confirm password is required';
    }
    // تحقق من المطابقة
    else if (pwd && confirm && pwd !== confirm) {
      this.message = 'Passwords do not match';
    }
    else {
      this.message = '';
    }
  }

  submit() {
    this.updateMessage();
    if (this.message) return; // إذا في رسالة خطأ، يمنع الإرسال

    const { password, confirmPassword } = this.form.value;
    this.loading = true;

    this.auth.resetPassword({ email: this.email, password, confirmPassword }).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/reset-success']);
      },
      error: (err) => {
        console.error('Reset failed', err);
        this.message = typeof err.error === 'string' ? err.error : 'Reset failed';
        this.loading = false;
      }
    });
  }
}
