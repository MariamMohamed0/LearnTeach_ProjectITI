import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CategoryBlock, Skill } from '../../../models/skillUser';
import { UserProfile } from '../../../models/userProfile';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/api/authService';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SkillService } from '../../../services/api/skillUserService';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-skill-component',
  imports: [CommonModule,FormsModule,RouterLink],
  templateUrl: './skill-component.html',
  styleUrl: './skill-component.css',
   encapsulation: ViewEncapsulation.None 
})

export class SkillComponent implements OnInit {
categories: CategoryBlock[] = [];
  displayedCategories: CategoryBlock[] = [];
  selectedSkills: { [skillId: number]: number } = {};
  selectedCategoryId?: number;
  theme: 'light' | 'dark' = 'light';
  userId?: number;
  loading = true;
  showPage = false;

  constructor(
    private skillService: SkillService,
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}
ngOnInit(): void {
  const userIdFromParam = Number(this.route.snapshot.queryParamMap.get('userId'));
  const newUser = this.route.snapshot.queryParamMap.get('newUser') === 'true';

  const currentUserId = this.auth.getCurrentUserId();
  const userId = userIdFromParam || currentUserId;

  if (!userId) {
    console.error('User ID not found, redirect to login');
    this.router.navigate(['/login']);
    return;
  }

  this.userId = userId;

  this.skillService.getByUserId(this.userId).subscribe({
    next: userSkills => {
      if (!newUser && userSkills && userSkills.length > 0) {
        this.router.navigate(['/dashboard']);
      } else {
        this.showPage = true;
        this.loadAllSkills();
      }
      this.loading = false;
    },
    error: err => {
      console.warn('No skills found, assuming new user.', err);
      this.showPage = true;
      this.loadAllSkills();
      this.loading = false;
    }
  });
}




  loadAllSkills() {
    this.skillService.getAll().subscribe(skills => {
      if (!skills || skills.length === 0) {
        this.categories = [];
        return;
      }

      const categoryMap: { [id: number]: CategoryBlock } = {};
      skills.forEach(s => {
        const catId = s.cateId;
        const catName = s.categoryName || 'Uncategorized';
        if (!catId) return;
        if (!categoryMap[catId]) categoryMap[catId] = { id: catId, name: catName, skills: [], collapsed: false };
        categoryMap[catId].skills.push({ ...s, goodAtIt: Math.min(Math.max(s.goodAtIt ?? 3, 1), 5) });
      });

      this.categories = Object.values(categoryMap);
    }, () => {
      this.categories = [];
    });
  }

  onCategorySelect(catId: number | string) {
    const id = Number(catId);
    if (!id) return;
    if (this.displayedCategories.some(c => c.id === id)) return;
    const cat = this.categories.find(c => c.id === id);
    if (!cat) return;
    this.displayedCategories.push({ ...cat, collapsed: false });
    this.selectedCategoryId = undefined;
  }

  toggleCategory(cat: CategoryBlock) {
    cat.collapsed = !cat.collapsed;
  }

  toggleSkill(skill: Skill) {
    if (!this.selectedSkills[skill.id]) this.selectedSkills[skill.id] = skill.goodAtIt ?? 3;
    else delete this.selectedSkills[skill.id];
  }

  rateSkill(skill: Skill, rating: number) {
    this.selectedSkills[skill.id] = Math.min(Math.max(rating, 1), 5);
  }

  isSelected(skill: Skill): boolean {
    return !!this.selectedSkills[skill.id];
  }

  get selectedSkillCount(): number {
    return Object.keys(this.selectedSkills).length;
  }

  removeSkill(skillId: number | string) {
    delete this.selectedSkills[Number(skillId)];
  }

  removeCategory(cat: CategoryBlock) {
    this.displayedCategories = this.displayedCategories.filter(c => c !== cat);
    cat.skills.forEach(s => this.removeSkill(s.id));
  }

  getSkillName(skillId: number | string): string {
    const id = Number(skillId);
    for (let cat of this.displayedCategories) {
      const skill = cat.skills.find(s => s.id === id);
      if (skill) return skill.name;
    }
    return '';
  }

  proceedNext() {
    if (!this.userId) return;

    const requests = Object.keys(this.selectedSkills).map(id => {
      const skill = this.categories.flatMap(cat => cat.skills).find(s => s.id === Number(id));
      if (!skill) return null;
      const rating = Math.min(Math.max(this.selectedSkills[skill.id], 1), 5);
      return this.skillService.linkSkillToUser(this.userId!, { ...skill, goodAtIt: rating });
    }).filter(r => r !== null);

    if (requests.length === 0) return;

    forkJoin(requests).subscribe({
      next: () => this.router.navigate(['/user-certificates']),
      error: err => console.error('Error saving skills', err)
    });
  }

  toggleTheme() {
    this.theme = this.theme === 'light' ? 'dark' : 'light';
    document.body.setAttribute('data-theme', this.theme);
  }
}