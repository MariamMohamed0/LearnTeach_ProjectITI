import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RegisterDTO } from '../../models/auth';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/api/authService';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    FormsModule
  ],
  templateUrl: './register.html',
  styleUrls: ['./register.css'],
})
export class Register {

  registerForm: FormGroup;
  message = '';
  loading = false;
  showPassword = false;
  showConfirmPassword = false;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.registerForm = this.fb.group({
      fName: ['', {
        validators: [Validators.required, Validators.minLength(3), Validators.maxLength(12), this.nameValidator],
        updateOn: 'change'
      }],
      lName: ['', {
        validators: [Validators.required, Validators.minLength(3), Validators.maxLength(12), this.nameValidator],
        updateOn: 'change'
      }],
      email: ['', {
        validators: [Validators.required, Validators.email],
        updateOn: 'change'
      }],
      password: ['', {
        validators: [Validators.required, this.passwordValidator],
        updateOn: 'change'
      }],
      confirmedPassword: ['', {
        validators: [Validators.required],
        updateOn: 'change'
      }],
      otp: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(6)]],
      terms: [false, {
        validators: [Validators.requiredTrue],
        updateOn: 'change'
      }]
    }, { validators: this.passwordMatchValidator, updateOn: 'change' });


    this.registerForm.valueChanges.subscribe(() => {
      this.message = ''; 
    });
  }

  nameValidator(control: AbstractControl) {
    const value = control.value;
    if (!value) return null;
    return /^[A-Za-z]/.test(value) ? null : { invalidStart: true };
  }

  passwordValidator(control: AbstractControl) {
    const value = control.value;
    if (!value) return null;

    const errors: any = {};
    if (!/[A-Z]/.test(value)) errors.uppercase = true;
    if (!/[a-z]/.test(value)) errors.lowercase = true;
    if (!/\d/.test(value)) errors.number = true;
    if (!/[@$!%*?&]/.test(value)) errors.symbol = true;
    if (value.length < 8) errors.minLength = true;
    if (value.length > 20) errors.maxLength = true;

    return Object.keys(errors).length ? errors : null;
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmed = form.get('confirmedPassword')?.value;
    return password === confirmed ? null : { mismatch: true };
  }

  register() {
    if (this.loading) return;

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      this.message = 'Please fill in all required fields correctly';
      return;
    }

    this.loading = true;
    this.message = '';

    const formValue = this.registerForm.value;
    const dto: RegisterDTO = {
      FName: formValue.fName,
      LName: formValue.lName,
      Email: formValue.email,
      Password: formValue.password,
      ConfirmedPassword: formValue.confirmedPassword,
      OTP: formValue.otp,
      ProfilePic: null
    };

    this.authService.registerUser(dto).subscribe({
      next: (res) => {
        localStorage.setItem('accessToken', res.accessToken);
        localStorage.setItem('refreshToken', res.refreshToken);
        this.router.navigate(['/login'], { queryParams: { newUser: true } });
        this.loading = false;
      },
      error: (err) => {
        this.message = err.error?.message || 'An error occurred during registration';
        this.loading = false;
      }
    });
  }

  // helpers for template
  get f() { return this.registerForm.controls; }
}
