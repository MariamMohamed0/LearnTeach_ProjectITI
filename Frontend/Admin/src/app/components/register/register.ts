import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RegisterDTO } from '../../models/auth';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/api/authService';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
selector: 'app-register',
standalone: true,
imports: [ReactiveFormsModule, CommonModule, RouterModule,FormsModule],
templateUrl: './register.html',
styleUrl: './register.css',
})
export class Register implements OnInit {
registerForm: FormGroup;
message = '';
 showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  loading: boolean = false;

constructor(private fb: FormBuilder, private authService: AuthService, private router: Router, private http: HttpClient) {
this.registerForm = this.fb.group(
{
fName: ['', Validators.required],
lName: ['', Validators.required],
email: ['', [Validators.required, Validators.email]],
password: [
'',
[
Validators.required,
Validators.minLength(6),
Validators.pattern(/^(?=.*[A-Z])(?=.*\d).+$/),
],
],
confirmedPassword: ['', Validators.required],
otp: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(6)]],
terms: [false, Validators.requiredTrue],
},
{ validators: this.passwordMatchValidator }
);
}

ngOnInit() {
(window as any).handleCredentialResponse = (response: any) => {
this.handleGoogleLogin(response);
};




(window as any).fbAsyncInit = function() {
  (window as any).FB.init({
    appId: 'YOUR_FACEBOOK_APP_ID',
    cookie: true,
    xfbml: true,
    version: 'v17.0'
  });
};

((d, s, id) => {
  let js: HTMLScriptElement;
  const fjs = d.getElementsByTagName(s)[0];
  if (!fjs) return;
  if (d.getElementById(id)) return;

  js = d.createElement('script');
  js.id = id;
  js.src = 'https://connect.facebook.net/en_US/sdk.js';

  fjs.parentNode?.insertBefore(js, fjs); 
})(document, 'script', 'facebook-jssdk');

}

passwordMatchValidator(form: FormGroup) {
const password = form.get('password')?.value;
const confirmed = form.get('confirmedPassword')?.value;
return password === confirmed ? null : { mismatch: true };
}

register() {
if (this.registerForm.invalid) {
      this.loading = true;
this.message = 'Please fill in the information correctly';
this.registerForm.markAllAsTouched();
return;
}


const formValue = this.registerForm.value;
const dto: RegisterDTO = {
  FName: formValue.fName,
  LName: formValue.lName,
  Email: formValue.email,
  Password: formValue.password,
  ConfirmedPassword: formValue.confirmedPassword,
  OTP: formValue.otp,
  ProfilePic: null,
};

this.authService.registerAdmin(dto).subscribe({
  next: (res) => {
    localStorage.setItem('accessToken', res.accessToken);
    localStorage.setItem('refreshToken', res.refreshToken);
    this.router.navigate(['/login']);
  },
  error: (err) => {
    this.message = err.error?.message ||"An error occurred during registration";
  },
});


}

googleSignIn() {
  if ((window as any).google) {
    (window as any).google.accounts.id.initialize({
      client_id: 'YOUR_GOOGLE_CLIENT_ID',
      callback: (response: any) => this.handleGoogleLogin(response)
    });
    (window as any).google.accounts.id.prompt(); 
  }
}

handleGoogleLogin(response: any) {
  const idToken = response.credential;
  this.http.post(`${environment.apiUrl}/Authentication/Google`, { idToken })
    .subscribe((res: any) => {
      localStorage.setItem('accessToken', res.accessToken);
      localStorage.setItem('refreshToken', res.refreshToken);
      this.router.navigate(['/home']); 
    });
}





facebookSignIn() {
  if ((window as any).FB) {
    (window as any).FB.getLoginStatus((response: any) => {
      // الآن SDK جاهز، نفذ login
      (window as any).FB.login((response: any) => {
        if (response.authResponse) {
          const accessToken = response.authResponse.accessToken;
          this.http.post(`${environment.apiUrl}/Authentication/Facebook`, { provider: 'Facebook', accessToken })
            .subscribe(res => console.log('Facebook Logged Successfully', res));
        }
      }, { scope: 'email' });
    });
  } else {
    console.error('Facebook SDK not loaded yet');
  }
}

// helpers for template
  get f() { return this.registerForm.controls; }

}
