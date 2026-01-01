// src/app/components/premium-dashboard/premium-dashboard.component.ts
import { Component, OnInit, HostListener } from '@angular/core';


import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Sidebar } from '../../shared/sidebar/sidebar';

import { PremiumDistribution, PremiumSummary, PremiumUser } from '../../../models/premium-statistics';
import { PremiumDashboardService } from '../../../services/api/PremiumStatisticsService';
import { TranslationService } from '../../../services/translation';
import { AdminHeader } from '../../shared/admin-header/admin-header';


@Component({
  selector: 'app-premium-statistics-dashboard-component',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    Sidebar,
    AdminHeader
  ],
  templateUrl: './premium-statistics-dashboard-component.html',
  styleUrls: ['./premium-statistics-dashboard-component.css'],
})
export class PremiumDashboardComponent implements OnInit {
  summary: PremiumSummary = { totalUsers: 0, activeSubscriptions: 0, totalRevenue: 0 };
  distribution: PremiumDistribution = { silverMembers: 0, goldMembers: 0, platinumMembers: 0 };
  users: PremiumUser[] = [];

  isSidebarOpen = true;
  isDarkMode = false;
  screenWidth = window.innerWidth;

  constructor(
    private service: PremiumDashboardService,
    public t: TranslationService
  ) { }

  tr(key: string) {
    return this.t.translate(key);
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.service.getSummary().subscribe(res => this.summary = res);
    this.service.getDistribution().subscribe(res => this.distribution = res);
    this.service.getUsers().subscribe(res => this.users = res);
  }

  toggleSidebar() { this.isSidebarOpen = !this.isSidebarOpen; }
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

  isMobile(): boolean { return this.screenWidth < 1024; }
}
