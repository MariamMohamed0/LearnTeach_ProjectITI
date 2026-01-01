import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/api/authService';

@Component({
  selector: 'app-verify-code-component',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './verify-code-component.html',
})

export class VerifyCodeComponent {
  form: FormGroup;
  email: string = '';
  serverError: string = ''; // لإظهار رسالة الخطأ القادمة من السيرفر

  constructor(private fb: FormBuilder, private router: Router, private auth: AuthService) {
    this.form = this.fb.group({
      code: ['', Validators.required]
    });

    if (history.state && history.state.email) {
      this.email = history.state.email;
    } else {
      this.router.navigate(['/login']);
    }
  }


  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const dto = { email: this.email, code: this.form.value.code };

    this.auth.verifyCode(dto).subscribe({
      next: (res) => {
        this.serverError = '';
        this.router.navigate(['/reset-password'], { state: { email: this.email } });
      },
      error: (err) => {
        this.serverError = err.error || 'Invalid or expired code';
      }
    });
  }

}
