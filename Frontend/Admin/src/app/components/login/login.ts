import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/api/authService';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
   standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
loginForm: FormGroup;
message = '';
  showPassword: boolean = false;   
  loading: boolean = false;  
constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
this.loginForm = this.fb.group({
email: ['', [Validators.required, Validators.email]],
password: ['', Validators.required]
});
}

login() {
   this.loading = true;
if (this.loginForm.invalid) {
this.message = 'Please complete the form correctly';
return;
}

const formValue = this.loginForm.value;

this.authService.login({ email: formValue.email, password: formValue.password }).subscribe({
  next: (res) => {
    this.message = 'Login successful ✔';
    localStorage.setItem('accessToken', res.accessToken);
    localStorage.setItem('refreshToken', res.refreshToken);
    this.router.navigate(['/dashboard']);
  },
  error: (err) => {
    this.message = err.error?.message || 'An error occurred during login';
  }
});

}
}
