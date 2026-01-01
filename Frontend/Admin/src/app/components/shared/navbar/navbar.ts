import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterModule } from '@angular/router';
import { TranslationService } from '../../../services/translation';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink,CommonModule,RouterModule,RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit {
    activeSection: string = 'home';
  mobileMenuOpen = false;
  isDark = false;

  ngOnInit(): void {
    const saved = localStorage.getItem('theme');
    this.isDark = saved === 'dark';
    if (saved === 'dark') {
      document.documentElement.classList.add('dark');
    }
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  toggleDarkMode(): void {
    this.isDark = !this.isDark;
    if (this.isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }
 @HostListener('window:scroll', [])
  onScroll(): void {
    const scrollPosition = window.pageYOffset + window.innerHeight / 2;

    const sections = ['home', 'about', 'section', 'contact'];

    for (let i = sections.length - 1; i >= 0; i--) {
      const el = document.getElementById(sections[i]);
      if (el && scrollPosition >= el.offsetTop) {
        this.activeSection = sections[i];
        break;
      }
    }
  }
  constructor(public t: TranslationService) {}

  switchLang(lang: string) {
    this.t.setLanguage(lang);
  }

  tr(key: string) {
    return this.t.translate(key);
  }
  langMenuOpen = false;

toggleLangMenu() {
  this.langMenuOpen = !this.langMenuOpen;
}

}
