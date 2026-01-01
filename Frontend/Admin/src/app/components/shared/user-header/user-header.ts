import { CommonModule, TitleCasePipe } from '@angular/common';
import { Component, ElementRef, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'app-user-header',
  imports: [FontAwesomeModule,TitleCasePipe,CommonModule],
  templateUrl: './user-header.html',
  styleUrl: './user-header.css',
})
export class UserHeader {
 @Input() isDarkMode = false;
  @Input() userAvatar: string | null = null;
  @Output() toggleSidebarEvent = new EventEmitter<void>();
  @Output() toggleDarkModeEvent = new EventEmitter<void>();
  @Output() roleChanged = new EventEmitter<'student' | 'teacher'>(); // للإبلاغ عن الدور المختار

  faSun = faSun;
  faMoon = faMoon;

  isRoleMenuOpen = false;
  userRole: 'student' | 'teacher' = 'student';

  constructor(private elRef: ElementRef) {}

  toggleSidebar() {
    this.toggleSidebarEvent.emit();
  }

  toggleDarkMode() {
    this.toggleDarkModeEvent.emit();
  }

  get avatarUrl(): string {
    return this.userAvatar ? this.userAvatar : 'assets/default-avatar.png';
  }

  toggleRoleMenu() {
    this.isRoleMenuOpen = !this.isRoleMenuOpen;
  }

  switchRole(role: 'student' | 'teacher') {
    this.userRole = role;
    this.isRoleMenuOpen = false;
    this.roleChanged.emit(role); // نرسل الدور للـ parent لتغيير الصفحة/Sidebar
  }

  @HostListener('document:click', ['$event'])
  clickOutside(event: Event) {
    if (!this.elRef.nativeElement.contains(event.target)) {
      this.isRoleMenuOpen = false;
    }
  }
}