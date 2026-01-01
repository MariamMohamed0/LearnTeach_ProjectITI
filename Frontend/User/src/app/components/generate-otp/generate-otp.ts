import { Component } from '@angular/core';
import { AuthService } from '../../services/api/authService';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-generate-otp',
  imports: [CommonModule,FormsModule],
  templateUrl: './generate-otp.html',
  styleUrl: './generate-otp.css',
})
export class GenerateOtp {
  email = "";

  constructor(private auth: AuthService, private router: Router) {}

   sendOtp() {
    this.auth.generateOtp(this.email).subscribe({
      next: (res: any) => {
        alert(`OTP sent successfully`);
        this.router.navigate(['/register']); // هنا ضع المسار اللي تحبيه
      },
      error: (err) => alert("Error sending OTP")
    });
  }

}
