import { Component, HostListener, OnInit } from '@angular/core';
import { SocialMedia } from '../../../models/socialMedia';
import { UserProfile } from '../../../models/userProfile';
import { SocialMediaService } from '../../../services/api/socialMediaService';
import { UserProfileService } from '../../../services/api/userProfileService';
import { firstValueFrom } from 'rxjs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AdminHeader } from '../../shared/admin-header/admin-header';
import { Sidebar } from '../../shared/sidebar/sidebar';
import { TranslationService } from '../../../services/translation';

@Component({
  selector: 'app-social-media-component',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, Sidebar, AdminHeader],
  templateUrl: './social-media-component.html',
  styleUrl: './social-media-component.css',
})
export class SocialMediaComponent implements OnInit {

socialAccounts: SocialMedia[] = [];
filteredAccounts: SocialMedia[] = [];
users: UserProfile[] = [];
usersMap: Record<number, string> = {};

isLoading = true;
searchTerm = '';
selectedAccount: SocialMedia | null = null;
isDeleteDialogOpen = false;

isSidebarOpen = true;
isDarkMode = false;
  screenWidth: number = window.innerWidth;

constructor(
private socialService: SocialMediaService,
private userService: UserProfileService,
public t: TranslationService
) {}

async ngOnInit() {
await this.loadUsersAndAccounts();
}

async loadUsersAndAccounts() {
this.isLoading = true;

try {
  this.users = await firstValueFrom(this.userService.getAll());
  this.users.forEach(u => this.usersMap[u.userId] = `${u.fname} ${u.lname}`);

  this.socialService.getAll().subscribe({
    next: data => {
      this.socialAccounts = data.map(s => ({
        ...s,
        username: this.usersMap[s.userId] || 'Unknown'
      }));
      this.filteredAccounts = [...this.socialAccounts];
      this.isLoading = false;
    },
    error: err => {
      console.error('Error loading social accounts:', err);
      this.isLoading = false;
    }
  });

} catch (err) {
  console.error('Error:', err);
  this.isLoading = false;
}

}

filter() {
this.filteredAccounts = this.socialAccounts.filter(s =>
(s.username?.toLowerCase().includes(this.searchTerm.toLowerCase()) ?? false)
);
}

openDeleteDialog(account: SocialMedia) {
this.selectedAccount = account;
this.isDeleteDialogOpen = true;
}

closeDeleteDialog() {
this.isDeleteDialogOpen = false;
}

async confirmDelete() {
if (!this.selectedAccount) return;
try {
await firstValueFrom(this.socialService.delete(this.selectedAccount.id));
this.socialAccounts = this.socialAccounts.filter(a => a.id !== this.selectedAccount!.id);
this.filteredAccounts = [...this.socialAccounts];
} catch (err) {
console.error(err);
} finally {
this.closeDeleteDialog();
this.selectedAccount = null;
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