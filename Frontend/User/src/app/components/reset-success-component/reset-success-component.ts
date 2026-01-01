import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-reset-success-component',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './reset-success-component.html'
})
export class ResetSuccessComponent {
  constructor(private router: Router) { }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
