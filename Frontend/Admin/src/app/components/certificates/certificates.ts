import { Sidebar } from './../shared/sidebar/sidebar';
import { Navbar } from './../shared/navbar/navbar';
import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { certificateService } from '../../services/api/certificateService';
import { Certificate } from '../../models/certificate';
import { AdminHeader } from '../shared/admin-header/admin-header';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslationService } from '../../services/translation';

@Component({
  selector: 'app-certificates',
  templateUrl: './certificates.html',
  styleUrls: ['./certificates.css'],
  standalone: true,
  imports: [CommonModule,Navbar,Sidebar, ReactiveFormsModule, FormsModule, Sidebar, AdminHeader],
})
export class AdminCertificatesComponent {

  certificates: Certificate[] = [];
  loading = false;
  isSidebarOpen = true;
  isDarkMode = false;
  screenWidth: number = window.innerWidth;
  private certificateService = certificateService;

  constructor(public t: TranslationService) {
    this.loadCertificates();
  }

  async loadCertificates() {
    this.loading = true;
    try {
      this.certificates = await this.certificateService.getAllAdmin();
    } catch (err) {
      console.error('Failed to load certificates', err);
    } finally {
      this.loading = false;
    }
  }

  async deleteCertificate(cert: Certificate) {
    if (!confirm('Are you sure you want to delete this certificate?')) return;
    try {
      await this.certificateService.deleteByAdmin(cert.cerid);
      await this.loadCertificates();
    } catch (err) {
      console.error('Failed to delete certificate', err);
    }
  }

  openImage(url: string) {
    if (url) window.open(url, '_blank');
  }
  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    if (this.isDarkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.screenWidth = event.target.innerWidth;
    if (this.screenWidth >= 1024) this.isSidebarOpen = true;
  }

  isMobile(): boolean {
    return this.screenWidth < 1024;
  }
    tr(key: string) {
    return this.t.translate(key);
  }
}



