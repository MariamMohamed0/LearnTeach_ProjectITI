import { Component, HostListener, OnInit, ViewEncapsulation } from '@angular/core'; 
import { Certificate, mapUserProfileFromApi, UpdateUserProfileRequest, UserProfile } from './../../../models/userProfile'; 
import { SkillService } from '../../../services/api/skillUserService'; 
import { ProjectService } from './../../../services/api/projectService'; 

import { CreateProjectRequest, Project, UpdateProjectRequest } from '../../../models/project'; 
import { UserProfileService } from '../../../services/api/userProfileService'; 
import { environment } from '../../../../environments/environment'; 
import { HttpClient, HttpClientModule } from '@angular/common/http'; 
import { AuthService } from '../../../services/api/authService'; 
import { CommonModule } from '@angular/common'; 
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms'; 


import { Category } from '../../../models/categoryProfile'; 
import { forkJoin } from 'rxjs'; 
import { of } from 'rxjs'; 
import { catchError, take } from 'rxjs/operators'; 
import { SocialMediaService } from '../../../services/api/socialMediaService'; 
import { CreateSocialMediaRequest, SocialMedia, UpdateSocialMediaRequest } from '../../../models/socialMedia'; 
import { Sidebar } from '../../shared/sidebar/sidebar'; 
import { UserHeader } from '../../shared/user-header/user-header'; 
import { Sideteacher } from './../../shared/sideteacher/sideteacher'; 
import { Sidestudent } from './../../shared/sidestudent/sidestudent'; 
import { TranslationService } from '../../../services/translation'; 
import { Skill } from '../../../models/skillUser';
import { CategoryService } from '../../../services/api/categoryProfileService';


@Component({ 
  selector: 'app-my-profile-component', 
  standalone: true, 
  imports: [CommonModule, FormsModule,HttpClientModule, ReactiveFormsModule, Sidestudent, UserHeader], 
  templateUrl: './settings-component.html', 
  styleUrl: './settings-component.css', 
  encapsulation: ViewEncapsulation.None 
}) 
export class SettingsComponent implements OnInit { 
  profile: UserProfile | null = null;
updateData: UpdateUserProfileRequest = {};
skills: Skill[] = [];
categories: Category[] = [];
categorySkills: Skill[] = [];
loading = false;
selectedFile?: File;
showAddSkill = false;
// selectedCategoryId?: number | 'new';
selectedCategoryId: any = "";
selectedSkillId: any = "";
// selectedSkillId?: number | 'new';
newSkillGoodAt?: number;
projects: Project[] = [];
showAddSocialMedia = false;
certificates: Certificate[] = [];
showAddProject = false;
newProject: CreateProjectRequest = { userId: 0, projectName: '', projectDesc: '', repolink: '' };
editingProjectId?: number;
editName = false;
editExperience = false;
isEditing = false;
isSidebarOpen = true;
isDarkMode = false;
screenWidth: number = window.innerWidth;
socialMedia?: SocialMedia;
socialMediaData: UpdateSocialMediaRequest = {};
userId!: number;

newCertificate: Certificate = {
  cerid: 0,
  cername: '',
  instatutionName: '',
  earnedYear: new Date().getFullYear(),
  cerpic: ''
};

showAddCertificate: boolean = false;
selectedCerFile?: File;

constructor(
private profileService: UserProfileService,
private auth: AuthService,
private skillService: SkillService,
private categoryService: CategoryService,
private projectService: ProjectService,
private http: HttpClient,
private socialMediaService: SocialMediaService,
public t: TranslationService
) { }

ngOnInit(): void {
const user = this.auth.currentUser;
if (!user) return;
this.userId = user.userId;
this.loading = true;
this.newProject.userId = user.userId;
this.loadCertificates();
forkJoin({
profile: this.profileService.getById(user.userId),
skills: this.skillService.getByUserId(user.userId).pipe(catchError(err => of([]))),
categories: this.categoryService.getAll(),
projects: this.projectService.getByUserId(user.userId).pipe(catchError(() => of([])))
}).subscribe({
next: ({ profile, skills, categories, projects }) => {
this.profile = profile;
this.skills = (skills || []).map(s => ({ ...s, goodAtIt: s.goodAtIt ?? 5 }));
this.categories = categories || [];
this.projects = projects || [];
this.updateData = { fname: profile.fname ?? '', lname: profile.lname ?? '', experienceText: profile.experienceText ?? '' };
this.loading = false;
this.loadSocialMedia();
},
error: err => {
console.error('Error loading profile data:', err);
this.loading = false;
}
});
}

onCategoryChange(event: Event) {
const value = (event.target as HTMLSelectElement).value;
this.selectedCategoryId = value === 'new' ? 'new' : Number(value);
this.loadCategorySkills();
}

loadCategorySkills() {
if (!this.selectedCategoryId || this.selectedCategoryId === 'new') {
this.categorySkills = [];
return;
}
this.skillService.getAll().subscribe({
next: allSkills => this.categorySkills = allSkills.filter(s => s.cateId === this.selectedCategoryId && !this.skills.some(us => us.id === s.id)).map(s => ({ ...s, goodAtIt: s.goodAtIt ?? 5 })),
error: err => console.error(err)
});
}

addSelectedSkill() {
if (!this.profile || !this.selectedSkillId) return;
const skill = this.categorySkills.find(s => s.id === Number(this.selectedSkillId));
if (!skill) return;
skill.goodAtIt = Math.max(1, Math.min(this.newSkillGoodAt ?? 5, 10));
this.skillService.linkSkillToUser(this.profile.userId, skill).subscribe({
next: () => {
this.skills.push(skill);
this.categorySkills = this.categorySkills.filter(s => s.id !== skill.id);
this.selectedSkillId = undefined;
this.newSkillGoodAt = undefined;
},
error: err => console.error(err)
});
}

editSkill(skill: Skill) { skill.editing = !skill.editing; }
saveSkill(skill: Skill) { skill.editing = false; this.skillService.updateSkill(skill).subscribe({ next: () => { }, error: err => console.error(err) }); }
deleteSkill(skill: Skill) { if (!this.profile) return; this.skillService.deleteUserSkill(this.profile.userId, skill.id).subscribe({ next: () => this.skills = this.skills.filter(s => s.id !== skill.id), error: err => console.error(err) }); }

editProject(proj: Project) { proj.editing = !proj.editing; }
saveProject(proj: Project) { proj.editing = false; this.projectService.update(proj.projectId, { projectName: proj.projectName, projectDesc: proj.projectDesc, repolink: proj.repolink }).subscribe({ next: () => { }, error: err => console.error(err) }); }
addProject() { if (!this.newProject.projectName) return; this.projectService.create(this.newProject).subscribe({ next: res => { this.projects.push(res); this.newProject = { ...this.newProject, projectName: '', projectDesc: '', repolink: '' }; this.showAddProject = false; }, error: err => console.error(err) }); }
deleteProject(id: number) { this.projectService.delete(id).subscribe({ next: () => this.projects = this.projects.filter(p => p.projectId !== id), error: err => console.error(err) }); }

saveChanges() {
if (!this.profile) return;
const formData = new FormData();
formData.append('Fname', this.updateData.fname ?? this.profile.fname ?? '');
formData.append('Lname', this.updateData.lname ?? this.profile.lname ?? '');
formData.append('ExperienceText', this.updateData.experienceText ?? this.profile.experienceText ?? '');
this.profileService.update(this.profile.userId, formData).subscribe({ next: res => { this.profile = { ...this.profile!, ...res }; this.editName = false; this.editExperience = false; this.isEditing = false; }, error: err => console.error(err) });
}

onFileSelected(event: Event) { const input = event.target as HTMLInputElement; if (input.files?.length) this.selectedFile = input.files[0]; }
uploadProfilePicture() { if (!this.selectedFile || !this.profile) return; this.profileService.uploadProfilePicture(this.profile.userId, this.selectedFile).subscribe({ next: res => { if (res.fileUrl) this.profile!.profilePic = res.fileUrl; }, error: err => console.error(err) }); }

loadSocialMedia() { if (!this.profile) return; this.socialMediaService.getByUserId(this.profile.userId).subscribe({ next: res => { this.socialMedia = Array.isArray(res) ? res[0] : res; if (this.socialMedia) { this.socialMediaData = { facebookLink: this.socialMedia.facebookLink ?? '', linkedin: this.socialMedia.linkedin ?? '', personalWebsite: this.socialMedia.personalWebsite ?? '' }; } else { this.socialMediaData = { facebookLink: '', linkedin: '', personalWebsite: '' }; } }, error: err => console.error("Error loading social media:", err) }); }

showAddSocialMediaForm() { if (!this.profile) return; this.socialMediaData = { facebookLink: '', linkedin: '', personalWebsite: '' }; this.showAddSocialMedia = true; }
editExistingSocialMedia() { if (!this.socialMedia) return; this.socialMediaData = { facebookLink: this.socialMedia.facebookLink, linkedin: this.socialMedia.linkedin, personalWebsite: this.socialMedia.personalWebsite }; this.showAddSocialMedia = true; }
cancelSocialMediaEdit() { this.showAddSocialMedia = false; this.socialMediaData = {}; }
deleteSocialMedia() { if (!this.socialMedia?.accountId) return; this.socialMediaService.delete(this.socialMedia.accountId).subscribe({ next: () => { this.socialMedia = undefined; this.socialMediaData = { facebookLink: '', linkedin: '', personalWebsite: '' }; this.showAddSocialMedia = false; }, error: err => console.error("Delete error:", err) }); }
saveSocialMedia() { if (!this.profile) return; const userId = this.profile.userId; if (this.socialMedia?.accountId) { const updateData = { ...this.socialMediaData, accountId: this.socialMedia.accountId, userId }; this.socialMediaService.update(updateData).subscribe({ next: res => { this.socialMedia = res; this.showAddSocialMedia = false; }, error: err => console.error(err) }); } else { const createRequest = { ...this.socialMediaData, userId }; this.socialMediaService.create(createRequest).subscribe({ next: res => { this.socialMedia = res; this.showAddSocialMedia = false; }, error: err => console.error(err) }); } }

toggleTheme() { document.body.classList.toggle('dark'); }
getSkillColor(level?: number) { if (level === undefined) return 'gray'; if (level <= 3) return 'red'; if (level <= 7) return 'orange'; return 'green'; }
getProgressWidth(level?: number) { return Math.min(level ?? 0, 10) * 10; }
toggleSidebar() { this.isSidebarOpen = !this.isSidebarOpen; }
// toggleDarkMode() { this.isDarkMode = !this.isDarkMode; if (this.isDarkMode) document.body.classList.add('dark'); else document.body.classList.remove('dark'); }
@HostListener('window:resize', ['$event']) onResize(event: any) { this.screenWidth = event.target.innerWidth; if (this.screenWidth >= 1024) this.isSidebarOpen = true; }
isMobile(): boolean { return this.screenWidth < 1024; }
tr(key: string) { return this.t.translate(key); }

toggleAddCertificate() {
this.showAddCertificate = !this.showAddCertificate;
this.newCertificate = { cerid: 0, cername: '', instatutionName: '', earnedYear: 0, cerpic: '' };
this.selectedCerFile = undefined;
}

onCerFileChange(event: Event) {
const input = event.target as HTMLInputElement;
if (input.files && input.files.length > 0) this.selectedCerFile = input.files[0];
}

addCertificate() {
if (!this.newCertificate.cername ||
!this.newCertificate.instatutionName ||
this.newCertificate.earnedYear < 1900 ||
this.newCertificate.earnedYear > new Date().getFullYear() ||
!this.selectedCerFile) {
alert("Please enter valid data");
return;
}

const formData = new FormData();
formData.append("Cername", this.newCertificate.cername);
formData.append("InstatutionName", this.newCertificate.instatutionName);
formData.append("EarnedYear", this.newCertificate.earnedYear.toString());
formData.append("Cerpic", this.selectedCerFile);

this.profileService.createCertificate(this.userId, formData).subscribe({
  next: (res: any) => {
    this.loadCertificates();
    this.resetCertificateForm();
    this.showAddCertificate = false;
  },
  error: (err: any) => console.error(err)
});


}

onCertificateFileSelected(event: Event, cer?: Certificate) {
const input = event.target as HTMLInputElement;
if (input.files && input.files.length > 0) {
this.selectedCerFile = input.files[0];
}
}

editCertificate(cer: Certificate) { cer.editing = true; this.selectedCerFile = undefined; }

saveCertificate(cer: Certificate) {
  // التحقق من السنة
  if (cer.earnedYear < 1900 || cer.earnedYear > new Date().getFullYear()) {
    alert("Invalid year");
    return;
  }

  const formData = new FormData();
  formData.append("Cername", cer.cername);
  formData.append("InstatutionName", cer.instatutionName);
  formData.append("EarnedYear", cer.earnedYear.toString());

  // هنا نتحقق إذا فيه ملف جديد
  if (this.selectedCerFile) {
    formData.append("Cerpic", this.selectedCerFile);
  } else if (cer.cerpic) {
    // إذا لم يرفع المستخدم صورة جديدة، نرسل الصورة القديمة بنفس الحقل "Cerpic"
    // بعض السيرفرات تتوقع أن يكون الحقل موجود حتى لو لم يتغير
    formData.append("Cerpic", cer.cerpic);
  }

  this.profileService.updateCertificate(cer.cerid, this.userId, formData)
    .subscribe({
      next: (updated: any) => {
        cer.cerpic = updated.cerpic || cer.cerpic; // تحديث الصورة إذا تم رفع جديدة
        cer.editing = false;
        this.selectedCerFile = undefined;
      },
      error: (err: any) => console.error("Update certificate failed:", err)
    });
}






cancelEdit(cer: Certificate) { cer.editing = false; this.loadCertificates(); this.selectedCerFile = undefined; }
deleteCertificate(cer: Certificate) { this.profileService.deleteCertificate(cer.cerid, this.userId).subscribe({ next: () => { this.certificates = this.certificates.filter(c => c.cerid !== cer.cerid); }, error: (err: any) => console.error(err) }); }

loadCertificates() {
this.profileService.getUserCertificates(this.userId).subscribe({
next: res => {
if (Array.isArray(res)) {
this.certificates = res;
} else if (res) {
this.certificates = [res];
} else {
this.certificates = [];
}
},
error: err => console.error(err)
});
}

resetCertificateForm() {
this.newCertificate = { cerid: 0, cername: '', instatutionName: '', earnedYear: 0, cerpic: '' };
this.selectedCerFile = undefined;
}
toggleDarkMode() {
  this.isDarkMode = !this.isDarkMode;
  if(this.isDarkMode) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}

}