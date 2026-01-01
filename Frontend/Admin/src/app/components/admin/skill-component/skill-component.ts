import { Component, HostListener, OnInit } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { CreateSkillRequest, Skill, UpdateSkillRequest } from '../../../models/skill';
import { SkillService } from '../../../services/api/skillService';
import { CategoryService } from '../../../services/api/categoryService';
import { Category } from '../../../models/category';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminHeader } from '../../shared/admin-header/admin-header';
import { Sidebar } from '../../shared/sidebar/sidebar';
import { TranslationService } from '../../../services/translation';

@Component({
  selector: 'app-skill-component',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, Sidebar, AdminHeader],
  templateUrl: './skill-component.html',
  styleUrl: './skill-component.css',
})
export class SkillComponent implements OnInit {
skills: Skill[] = [];
  filteredSkills: Skill[] = [];
  categories: Category[] = [];
  userSkills: any[] = [];

  isLoading = true;
  searchTerm = '';
  selectedSkill: Skill | null = null;
  isDeleteDialogOpen = false;
  isAddEditDialogOpen = false;
  newSkill: Partial<CreateSkillRequest | UpdateSkillRequest> = {};
  isSidebarOpen = true;
  isDarkMode = false;
  screenWidth: number = window.innerWidth;

  constructor(private skillService: SkillService, private categoryService: CategoryService,public t: TranslationService) {}

  async ngOnInit() {
    await this.loadSkillsAndCategories();
  this.loadAllUserSkills();
  }

  async loadSkillsAndCategories() {
    this.isLoading = true;
    this.categories = await firstValueFrom(this.categoryService.getAll());
    this.skillService.getAll().subscribe({
      next: data => {
        this.skills = data;
        this.filteredSkills = [...this.skills];
        this.isLoading = false;
      },
      error: err => {
        console.error(err);
        this.isLoading = false;
      }
    });
  }

deleteUserSkill(us: any) {
  if (!confirm(`Are you sure you want to delete skill ${us.name} for ${us.userName}?`)) return;

  this.skillService.deleteUserSkill(us.userId, us.id).subscribe({
    next: () => {
      this.loadAllUserSkills(); 
    },
    error: (err) => console.error(err)
  });
}


  getCategoryName(cateId?: number): string {
    return this.categories.find(c => c.id === cateId)?.name || 'N/A';
  }

  filter() {
    this.filteredSkills = this.skills.filter(s =>
      (s.name?.toLowerCase().includes(this.searchTerm.toLowerCase()) ?? false)
    );
  }

openAddEditDialog(skill?: Skill) {
  if (skill) {
    this.selectedSkill = skill;
    this.newSkill = { name: skill.name, cateId: skill.cateId }; 
  } else {
    this.selectedSkill = null;
    this.newSkill = {};
  }
  this.isAddEditDialogOpen = true;
}


  closeAddEditDialog() {
    this.isAddEditDialogOpen = false;
    this.newSkill = {};
    this.selectedSkill = null;
  }

  async saveSkill() {
    try {
      if (this.selectedSkill) {
        const updated = await firstValueFrom(
          this.skillService.update(this.selectedSkill.skillId, this.newSkill as UpdateSkillRequest)
        );
        const idx = this.skills.findIndex(s => s.skillId === updated.skillId);
        if (idx >= 0) this.skills[idx] = updated;
      } else {
        const created = await firstValueFrom(
          this.skillService.create(this.newSkill as CreateSkillRequest)
        );
        this.skills.push(created);
      }
      this.filteredSkills = [...this.skills];
    } catch (err) {
      console.error(err);
    } finally {
      this.closeAddEditDialog();
    }
  }

  openDeleteDialog(skill: Skill) {
    this.selectedSkill = skill;
    this.isDeleteDialogOpen = true;
  }

  closeDeleteDialog() {
    this.isDeleteDialogOpen = false;
  }

  async confirmDelete() {
    if (!this.selectedSkill) return;
    try {
      await firstValueFrom(this.skillService.delete(this.selectedSkill.skillId));
      this.skills = this.skills.filter(s => s.skillId !== this.selectedSkill!.skillId);
      this.filteredSkills = [...this.skills];
    } catch (err) {
      console.error(err);
    } finally {
      this.closeDeleteDialog();
      this.selectedSkill = null;
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
  searchUserSkillTerm = '';
filteredUserSkills: any[] = [];

loadAllUserSkills() {
  this.skillService.getAllUserSkills().subscribe((res: any) => {
    this.userSkills = res;
    this.filteredUserSkills = [...this.userSkills];
  });
}

filterUserSkills() {
  const term = this.searchUserSkillTerm.toLowerCase();
  this.filteredUserSkills = this.userSkills.filter(us =>
    (us.name?.toLowerCase().includes(term) ?? false) ||
    (us.userName?.toLowerCase().includes(term) ?? false)
  );
}
  tr(key: string) {
    return this.t.translate(key);
  }
}