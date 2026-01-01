// src/app/components/admin/diamond-dashboard/diamond-dashboard.component.ts

import { Component, OnInit, HostListener } from '@angular/core';

import { CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';
import { Sidebar } from '../../shared/sidebar/sidebar';
import { AdminHeader } from '../../shared/admin-header/admin-header';
import { DiamondAverage, DiamondBuyersCount, TotalUsd, UserDiamondDetail } from '../../../models/diamond';
import { AdminDiamondService } from '../../../services/api/AdminDiamondService';
import { TranslationService } from '../../../services/translation';

@Component({
  selector: 'app-diamond-dashboard-component',
  standalone: true,
  imports: [CommonModule, RouterModule, Sidebar, AdminHeader],
  templateUrl: './diamond-dashboard-component.html',
  styleUrls: ['./diamond-dashboard-component.css'],
})
export class DiamondDashboardComponent implements OnInit {
  isSidebarOpen = true;
  isDarkMode = false;
  screenWidth = window.innerWidth;

  average: DiamondAverage | null = null;
  buyersCount: DiamondBuyersCount | null = null;
  totalUsd: TotalUsd | null = null;
  usersDetails: UserDiamondDetail[] = [];

  constructor(private diamondService: AdminDiamondService, public t: TranslationService
  ) { }


  tr(key: string) {
    return this.t.translate(key);
  }

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard() {
    this.diamondService.getAverageDiamonds().subscribe(data => this.average = data);
    this.diamondService.getBuyersCount().subscribe(data => this.buyersCount = data);
    this.diamondService.getTotalUsd().subscribe(data => this.totalUsd = data);
    this.diamondService.getAllUsersDetails().subscribe(data => this.usersDetails = data);
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
}
