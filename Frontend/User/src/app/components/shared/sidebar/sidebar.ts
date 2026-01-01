import { Component, Input } from '@angular/core';
import { SidebarItem } from '../../../models/menu item';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faHome, faFolder, faFileAlt, faComment, faHeart, faBox, faGem, faCreditCard, faBriefcase, faShareAlt, faIdCard, faCommentDots, faCertificate, faStar } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule, RouterLink, FontAwesomeModule
  ],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  @Input() collapsed: boolean = false;
  faHome = faHome;
  faFolder = faFolder;
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
  faCertificate = faCertificate;
  faStar = faStar;
  //  role = localStorage.getItem('role');



  items: SidebarItem[] = [

    { label: 'Dashboard', icon: faHome, route: '/dashboard' },
    { label: 'Categories', icon: faFolder, route: '/categories' },
    { label: 'Certificate', icon: faCertificate, route: '/certificate' },
    { label: 'Posts', icon: faFileAlt, route: '/posts' },
    { label: 'Comments', icon: faComment, route: '/comments' },
    { label: 'Likes', icon: faHeart, route: '/likes' },
    { label: 'Materials', icon: faBox, route: '/materials' },
    { label: 'Diamond System', icon: faGem, route: '/diamonds' },
    { label: 'Payments', icon: faCreditCard, route: '/payments' },
    { label: 'Projects', icon: faBriefcase, route: '/projects' },
    { label: 'Report', icon: faFileAlt, route: '/report' },
    { label: 'Skill', icon: faStar, route: '/skill' },
    { label: 'Social Media', icon: faShareAlt, route: '/social-media' },
    { label: 'ID Verification', icon: faIdCard, route: '/id-verification' },
    { label: 'Feedback', icon: faCommentDots, route: '/feedback' },
    { label: 'Admin-Approval', icon: faCommentDots, route: '/admin-approval' }
  ];

  // get visibleItems(): SidebarItem[] {
  //   return this.role === 'Admin' ? this.items : [];
  // }
}
