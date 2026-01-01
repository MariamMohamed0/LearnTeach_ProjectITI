import { Component, HostListener, OnInit } from '@angular/core';
import { Category, CreateCategoryRequest, UpdateCategoryRequest } from '../../../models/category';
import { CategoryService } from '../../../services/api/categoryService';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Sidebar } from '../../shared/sidebar/sidebar';
import { AdminHeader } from '../../shared/admin-header/admin-header';
import { firstValueFrom } from 'rxjs';
import { TranslationService } from '../../../services/translation';
@Component({
  selector: 'app-category-component',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, Sidebar, AdminHeader],
  templateUrl: './category-component.html',
  styleUrl: './category-component.css',
})
export class CategoryComponent implements OnInit {

  categories: Category[] = [];
  filteredCategories: Category[] = [];
  isLoading = true;
  isDialogOpen = false;
  isDeleteDialogOpen = false;
  selectedCategory: Category | null = null;
  searchTerm = '';
  formData = { name: '' };
  isSidebarOpen = true;
  isDarkMode = false;
  screenWidth: number = window.innerWidth;

  constructor(private categoryService: CategoryService,    public t: TranslationService) { }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories() {
    this.isLoading = true;
    this.categoryService.getAll().subscribe({
      next: (data) => {
        this.categories = data;
        this.filteredCategories = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading categories:', err);
        this.isLoading = false;
      }
    });
  }

  filter() {
    this.filteredCategories = this.categories.filter(c =>
      c.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  openCreateDialog() {
    this.selectedCategory = null;
    this.formData = { name: '' };
    this.isDialogOpen = true;
  }

  openEditDialog(category: Category) {
  this.selectedCategory = category;
  this.formData = { name: category.name };
  this.isDialogOpen = true;
}


  closeDialog() {
    this.isDialogOpen = false;
  }

 async submit() {
  if (!this.formData.name.trim()) return;

  try {
    if (this.selectedCategory) {
      const updated = await firstValueFrom(
        this.categoryService.update(this.selectedCategory.id, { name: this.formData.name })
      );

      const idx = this.categories.findIndex(c => c.id === updated.id);
      if (idx >= 0) this.categories[idx] = updated;

    } else {

      const created = await firstValueFrom(
        this.categoryService.create({ name: this.formData.name })
      );

      this.categories.push(created);
    }

    this.filteredCategories = [...this.categories];

  } catch (err) {
    console.error(err);
  } finally {
    this.closeDialog();
    this.selectedCategory = null;
  }
}


openDeleteDialog(category: Category) {
  this.selectedCategory = category;
  this.isDeleteDialogOpen = true;
}


  closeDeleteDialog() {
    this.isDeleteDialogOpen = false;
  }

 async confirmDelete() {
  if (!this.selectedCategory) return;

  try {
    await firstValueFrom(
      this.categoryService.delete(this.selectedCategory.id)
    );

    this.categories = this.categories.filter(c => c.id !== this.selectedCategory!.id);
    this.filteredCategories = [...this.categories];

  } catch (err) {
    console.error(err);
  } finally {
    this.closeDeleteDialog();
    this.selectedCategory = null;
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