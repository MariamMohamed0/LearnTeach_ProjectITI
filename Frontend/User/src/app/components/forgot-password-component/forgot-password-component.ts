import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/api/authService';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-forgot-password-component',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './forgot-password-component.html',
})
export class ForgotPasswordComponent {
  form: FormGroup;
  message = '';
  loading = false;

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.message = '';

    this.auth.forgetPassword(this.form.value).subscribe({
      next: (res) => {
        // لو response فيه نص نعرضه، لو فاضي نعتبره نجاح
        this.message = res || 'Verification code sent';
        this.loading = false;

        // الانتقال للصفحة التالية فورًا
        setTimeout(() => {
          this.router.navigate(['/verify-code'], { state: { email: this.form.value.email } });
        }, 500); // ممكن تقصري الوقت لو تحبي
      },
      error: (err) => {
        this.loading = false;
        let msg = '';

        if (err.error) {
          msg = typeof err.error === 'string' ? err.error : JSON.stringify(err.error);
        }

        // شرط محدد: لو الرسالة فيها 'sent' نعتبرها نجاح
        if (msg.toLowerCase().includes('sent')) {
          setTimeout(() => {
            this.router.navigate(['/verify-code'], { state: { email: this.form.value.email } });
          }, 500);
        } else {
          // أي خطأ آخر يظهر للمستخدم
          this.message = msg || 'Failed to send verification code';
        }
      }
    });
  }

}
