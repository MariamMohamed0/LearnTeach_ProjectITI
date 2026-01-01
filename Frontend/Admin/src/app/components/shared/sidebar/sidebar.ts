import { CommonModule, NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink, RouterModule, Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslationService } from '../../../services/translation';
import { AuthService } from '../../../services/api/authService';
import Swal from 'sweetalert2';

import {
  faHome, faUser, faFolder, faFileAlt, faComment, faHeart, faBox, faGem, faCreditCard,
  faBriefcase, faShareAlt, faIdCard, faSignOut, faCommentDots, faCertificate, faStar, faGift, faChartBar
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, FontAwesomeModule, RouterModule, NgIf],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.css'],
})
export class Sidebar {
  @Input() collapsed = false;
  @Input() isDarkMode = false;
  @Input() isMobileOpen = false;
//  currentLang: string = 'en';

  // FontAwesome icons
  faHome = faHome;
  faFolder = faFolder;
  faCertificate = faCertificate;
  faFileAlt = faFileAlt;
  faComment = faComment;
  faHeart = faHeart;
  faBox = faBox;
  faGem = faGem;
  faCreditCard = faCreditCard;
  faBriefcase = faBriefcase;
  faShareAlt = faShareAlt;
  faIdCard = faIdCard;
  faCommentDots = faCommentDots;
  faStar = faStar;
  faSignOut = faSignOut;
  faGift = faGift;
  faChartBar = faChartBar;
  // Menu items
  menuItems = [
    { label: 'Dashboard', link: '/dashboard', icon: this.faHome },
    { label: 'Categories', link: '/categories', icon: this.faFolder },
    { label: 'Certificate', link: '/certificate', icon: this.faCertificate },
    { label: 'Posts', link: '/posts', icon: this.faFileAlt },
    { label: 'Comments', link: '/comments', icon: this.faComment },
    { label: 'Likes', link: '/likes', icon: this.faHeart },
    { label: 'Materials', link: '/materials', icon: this.faBox },

    { label: 'Diamonds Statistics', link: '/admin/diamonds', icon: this.faGem },
    { label: 'Diamonds Offers', link: '/admin/diamonds-offers', icon: this.faGift },
    { label: 'Premium Statistics', link: '/admin/premium-statistics', icon: this.faChartBar },
    { label: 'Premium Offers', link: '/admin/premium-offers', icon: this.faStar },

    { label: 'Projects', link: '/projects', icon: this.faBriefcase },
    { label: 'Report', link: '/report', icon: this.faFileAlt },
    { label: 'Skill', link: '/skill', icon: this.faStar },
    { label: 'Social Media', link: '/social-media', icon: this.faShareAlt },
    { label: 'ID Verification', link: '/id-verification', icon: this.faIdCard },
    { label: 'Feedback', link: '/feedback', icon: this.faCommentDots }
  ];


  constructor(
    private authService: AuthService,
    private router: Router,
    public t: TranslationService
  ) {
  }


  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
  }

  confirmLogout() {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to log out now?',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Cancel',
      confirmButtonText: 'Yes, log out',
      confirmButtonColor: '#3B82F6',
      cancelButtonColor: '#d33'
    }).then((result) => {
      if (result.isConfirmed) {
        this.authService.logout();
        this.router.navigate(['/login']);
      }
    });
  }

  tr(key: string) {
    return this.t.translate(key);
  }
}
