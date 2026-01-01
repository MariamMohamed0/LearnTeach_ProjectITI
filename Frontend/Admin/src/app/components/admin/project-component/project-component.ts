import { Component, HostListener, OnInit } from '@angular/core';
import { Project } from '../../../models/project';

import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AdminHeader } from '../../shared/admin-header/admin-header';
import { Sidebar } from '../../shared/sidebar/sidebar';
import { UserProfileService } from '../../../services/api/userProfileService';
import { UserProfile } from '../../../models/userProfile';
import { firstValueFrom } from 'rxjs';
import { ProjectService } from '../../../services/api/projectService';
import { TranslationService } from '../../../services/translation';
@Component({
  selector: 'app-project-component',
    standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, Sidebar, AdminHeader],
  templateUrl: './project-component.html',
  styleUrl: './project-component.css',
})
export class ProjectComponent implements OnInit {
 
   projects: Project[] = [];
  filteredProjects: Project[] = [];
  users: UserProfile[] = [];
  usersMap: Record<number, string> = {};

  isLoading = true;
  isDeleteDialogOpen = false;
  selectedProject: Project | null = null;
  searchTerm = '';
    isSidebarOpen = true;
  isDarkMode = false;
  screenWidth: number = window.innerWidth;
  constructor(
    private projectService: ProjectService,
    private userService: UserProfileService,
    public t: TranslationService
  ) {}

  async ngOnInit() {
    await this.loadUsersAndProjects();
  }

  async loadUsersAndProjects() {
  this.isLoading = true;

  try {

    this.users = await firstValueFrom(this.userService.getAll());
  this.users.forEach(u => this.usersMap[u.userId] = `${u.fname} ${u.lname}`);

    this.projectService.getAll().subscribe({
  next: data => {
    this.projects = data.map(p => ({
      ...p,
      username: this.usersMap[p.userId] || 'Unknown'
    }));
    this.filteredProjects = [...this.projects];
    this.isLoading = false;
  },
  error: err => {
    console.error("Error loading projects:", err);
    this.isLoading = false;
  }
});


  } catch (err) {
    console.error("Error:", err);
    this.isLoading = false;
  }
}


  filter() {
    this.filteredProjects = this.projects.filter(p =>
      p.projectName.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  openDeleteDialog(project: Project) {
    this.selectedProject = project;
    this.isDeleteDialogOpen = true;
  }

  closeDeleteDialog() {
    this.isDeleteDialogOpen = false;
  }

  async confirmDelete() {
    if (!this.selectedProject) return;
    try {
      await firstValueFrom(this.projectService.delete(this.selectedProject.projectId));
      this.projects = this.projects.filter(p => p.projectId !== this.selectedProject!.projectId);
      this.filteredProjects = [...this.projects];
    } catch (err) {
      console.error(err);
    } finally {
      this.closeDeleteDialog();
      this.selectedProject = null;
    }
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