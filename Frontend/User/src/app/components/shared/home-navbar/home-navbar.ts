import { Component, HostListener } from '@angular/core';
import { TranslationService } from '../../../services/translation';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-home-navbar',
  imports: [RouterLink, CommonModule, RouterModule],
  templateUrl: './home-navbar.html',
  styleUrl: './home-navbar.css',
})
export class HomeNavbar {
 activeSection: string = 'home';
  mobileMenuOpen = false;
  isDark = false;
  langMenuOpen = false;

  constructor(public t: TranslationService) { }

  ngOnInit(): void {
    const saved = localStorage.getItem('theme');
    this.isDark = saved === 'dark';
    if (this.isDark) {
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

  switchLang(lang: string) {
    this.t.setLanguage(lang);
  }

  tr(key: string) {
    return this.t.translate(key);
  }

  toggleLangMenu() {
    this.langMenuOpen = !this.langMenuOpen;
  }
}
