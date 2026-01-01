import { Component, HostListener, OnInit } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { UserProfileService } from '../../../services/api/userProfileService';
import { CategoryService } from '../../../services/api/categoryService';
import { SocialMediaService } from '../../../services/api/socialMediaService';
import { Category } from '../../../models/category';
import { UserProfile } from '../../../models/userProfile';
import { Material } from '../../../models/material';
import { MaterialService } from '../../../services/api/materialService';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Sidebar } from '../../shared/sidebar/sidebar';
import { AdminHeader } from '../../shared/admin-header/admin-header';
import { TranslationService } from '../../../services/translation';

@Component({
  selector: 'app-material-component',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, Sidebar, AdminHeader],
  templateUrl: './material-component.html',
  styleUrl: './material-component.css',
})
export class MaterialComponent implements OnInit {
materials: (Material & { username: string; categoryName: string })[] = [];
filteredMaterials: (Material & { username: string; categoryName: string })[] = [];
users: UserProfile[] = [];
categories: Category[] = [];
usersMap: Record<number, string> = {};
categoriesMap: Record<number, string> = {};

isLoading = true;
searchTerm = '';
selectedMaterial: (Material & { username: string; categoryName: string }) | null = null;
isViewDialogOpen = false;
isDeleteDialogOpen = false;
isSidebarOpen = true;
isDarkMode = false;
screenWidth = window.innerWidth;

constructor(
private userService: UserProfileService,
private categoryService: CategoryService,
private materialService: MaterialService,
public t: TranslationService
) {}

async ngOnInit() {
await this.loadAllData();
}

async loadAllData() {
this.isLoading = true;
try {
this.users = await firstValueFrom(this.userService.getAll());
this.categories = await firstValueFrom(this.categoryService.getAll());

  this.users.forEach(u => (this.usersMap[u.userId] = u.fname + ' ' + u.lname));  
  this.categories.forEach(c => (this.categoriesMap[c.id] = c.name));  

  const data: Material[] = await firstValueFrom(this.materialService.getAll());  
  this.materials = data.map(m => ({  
    ...m,  
    username: this.usersMap[m.uploaderId] || 'Unknown',  
    categoryName: this.categoriesMap[m.categoryId] || 'Unknown'  
  }));  

  this.filteredMaterials = [...this.materials];  
} catch (err: any) {  
  console.error(err);  
} finally {  
  this.isLoading = false;  
}  

}

filter() {
this.filteredMaterials = this.materials.filter(m =>
m.name.toLowerCase().includes(this.searchTerm.toLowerCase())
);
}


openViewDialog(material: Material & { username: string; categoryName: string }) {
this.selectedMaterial = material;
this.isViewDialogOpen = true;
}

closeViewDialog() {
this.isViewDialogOpen = false;
this.selectedMaterial = null;
}


openDeleteDialog(material: Material & { username: string; categoryName: string }) {
this.selectedMaterial = material;
this.isDeleteDialogOpen = true;
}

closeDeleteDialog() {
this.isDeleteDialogOpen = false;
this.selectedMaterial = null;
}

confirmDelete() {
if (!this.selectedMaterial) return;
this.materialService.delete(this.selectedMaterial.id).subscribe({
next: () => {
this.materials = this.materials.filter(m => m.id !== this.selectedMaterial!.id);
this.filteredMaterials = this.filteredMaterials.filter(m => m.id !== this.selectedMaterial!.id);
this.closeViewDialog();
this.closeDeleteDialog();
},
error: (err: any) => console.error(err)
});
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

isMobile() { return this.screenWidth < 1024; }
  tr(key: string) {
    return this.t.translate(key);
  }
}