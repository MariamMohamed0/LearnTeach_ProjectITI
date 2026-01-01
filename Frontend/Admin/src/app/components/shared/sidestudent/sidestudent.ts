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
  templateUrl: './sidestudent.html',
  styleUrl: './sidestudent.css',
})
export class Sidestudent {
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
}
