
import { Component, OnInit } from '@angular/core';
import { UserProfileService } from '../../../services/api/userProfileService';
import { UserProfile } from '../../../models/userProfile';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../services/api/authService';


@Component({
  selector: 'app-home-component',
  imports: [CommonModule,FormsModule,RouterLink],
  templateUrl: './home-component.html',
  styleUrl: './home-component.css',
})
export class HomeComponent implements OnInit {
  users: UserProfile[] = [];
  loading = true;

constructor(
  private userProfileService: UserProfileService,
  public authService: AuthService
) {}


  ngOnInit(): void {
    this.userProfileService.getAll().subscribe({
      next: (res) => {
        this.users = res;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }
}

// import { Component } from '@angular/core';
// import { AuthService } from '../../../services/api/authService';
// import { UserReportsComponent } from '../../user-reports/user-reports';
// import { CommonModule } from '@angular/common';

// @Component({
//   selector: 'app-home-component',
//   imports: [CommonModule, UserReportsComponent],
//   templateUrl: './home-component.html',
//   styleUrl: './home-component.css',
// })
// export class HomeComponent {
//   constructor(public authService: AuthService){}
// }

