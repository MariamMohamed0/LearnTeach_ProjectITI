import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/api/authService';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-forget-password',
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './forget-password.html',
  styleUrl: './forget-password.css',
})
export class ForgetPassword {

forgotForm: FormGroup;
message = '';

constructor(private fb: FormBuilder, private authService: AuthService) {
this.forgotForm = this.fb.group({
email: ['', [Validators.required, Validators.email]]
});
}
sendReset() {
  if (this.forgotForm.invalid) {
    this.message = 'Please enter a valid email';
    return;
  }

  const email = this.forgotForm.value.email.trim();
  console.log("Email being sent:", email);

  // إرسال البريد كـ query string بدلاً من JSON
  this.authService.forgetPassword(email).subscribe({
    next: () => {
      this.message = 'Password reset link has been sent to your email';
    },
    error: (err) => {
      console.log("Full error:", err);
      this.message = err.error?.message || 'User not found';
    }
  });
}







}
