import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink, RouterModule, Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { 
  faHome, faUser, faComment, faGem, faCrown, faCalendarMinus, faAddressCard, faGears, faSignOut 
} from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../../../services/api/authService';
import Swal from 'sweetalert2';
import { TranslationService } from '../../../services/translation';

@Component({
  selector: 'app-sidestudent',
  standalone: true,
  imports: [CommonModule, RouterLink, FontAwesomeModule, RouterModule],
  templateUrl: './sidestudent.html',
  styleUrls: ['./sidestudent.css'],
})
export class Sidestudent {
  @Input() collapsed: boolean = false;
@Input() isDarkMode = false;
  @Input() isRtl: boolean = false;


  faHome = faHome;
  faUser = faUser;
  faComment = faComment;
  faGem = faGem;
  faCrown = faCrown;
  faCalendarMinus = faCalendarMinus;
  faAddressCard = faAddressCard;
  faGears = faGears;
  faSignOut = faSignOut;

  menuItems = [
    { label: 'HOME', link: '/DashboardComponent', icon: faHome },
    { label: 'PROFILE', link: '/myprofile', icon: faUser },
    { label: 'SESSION', link: '/sessions', icon: faComment },
    { label: 'CHAT', link: '/chat', icon: faComment },
    { label: 'DIAMONDS', link: '/diamonds', icon: faGem },
    { label: 'PREMIUM', link: '/premium', icon: faCrown },
    { label: 'REPORT', link: '/user-reports', icon: faCalendarMinus },
    { label: 'ID_VERIFICATION', link: '/national-id', icon: faAddressCard },
    { label: 'SETTINGS', link: '/settings', icon: faGears },
  ];

  constructor(
    private authService: AuthService,
    private router: Router,
    public t: TranslationService
  ) {}

  ngOnInit() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      this.isDarkMode = true;
      document.documentElement.classList.add('dark');
    }
  }

confirmLogout() {
  Swal.fire({
    title: this.tr('Are you sure?'),
    text: this.tr('Do you want to log out now?'),
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: this.tr('Yes, check out'),
    cancelButtonText: this.tr('Cancel'),
    confirmButtonColor: '#3B82F6',
    cancelButtonColor: '#d33'
  }).then((result) => {
    if (result.isConfirmed) {
      this.authService.logout();
      this.router.navigate(['/login']);
    }
  });
}

toggleDarkMode() {
  this.isDarkMode = !this.isDarkMode;

  const html = document.documentElement;
  if (this.isDarkMode) html.classList.add('dark');
  else html.classList.remove('dark');
}

  tr(key: string) {
    return this.t.translate(key);
  }
}
