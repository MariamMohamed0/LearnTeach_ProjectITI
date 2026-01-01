import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/api/authService';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Navbar } from '../shared/navbar/navbar';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule, Navbar],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class Login {
  loginForm: FormGroup;
  message = '';
  loading = false;
  showPassword = false;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

login() {
  if (this.loginForm.invalid) {
    this.loginForm.markAllAsTouched();
    this.message = 'Please complete the form correctly';
    return;
  }


  this.loading = true;
  this.message = '';
  const formValue = this.loginForm.value;

  this.authService.loginuser({
    Email: formValue.email,
    Password: formValue.password
  }).subscribe({
    next: (res) => {

console.log('Login response:', res);

// لو بتخزن حاجة في localStorage
console.log('localStorage token:', localStorage.getItem('token'));
console.log('localStorage user info:', localStorage.getItem('user')); 

      localStorage.setItem("token", res.token);
      localStorage.setItem('refreshToken', res.refreshToken);

      this.authService.saveCurrentUser(res);

const decoded: any = this.authService.decodeToken(res.token);
const userId = decoded.ProfileId; 
 localStorage.setItem('userId', userId.toString());
const token = localStorage.getItem('token');
if (token) {
  const decoded: any = this.authService.decodeToken(token);
  console.log('Decoded Token:', decoded);
}


this.authService.getUserSkills(userId).subscribe({
  next: (skills) => {
     console.log("User Skills:", skills);
    if (!skills || skills.length === 0) {
       this.router.navigate(['/skillstart'], { queryParams: { newUser: true } });
    } else {
      this.router.navigate(['/DashboardComponent']);
    }
    this.loading = false;
  },
  error: (err) => {
    console.log("Skills Error:", err);
    this.router.navigate(['/skillstart'], { queryParams: { newUser: true } });
    this.loading = false;
  }
});

    },
    error: (err: any) => {  
      this.message = err.error?.message || 'An error occurred during login';
      this.loading = false;
    }
  });
}


  }



