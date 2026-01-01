import { Component, HostListener, OnInit, ViewEncapsulation } from '@angular/core';
import { ProjectService } from './../../../services/api/projectService';
import { CreateProjectRequest, Project, UpdateProjectRequest } from '../../../models/project';
import { UserProfileService } from '../../../services/api/userProfileService';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../../services/api/authService';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { of } from 'rxjs';
import { catchError, map, take } from 'rxjs/operators';
import { SocialMediaService } from '../../../services/api/socialMediaService';
import { CreateSocialMediaRequest, SocialMedia, UpdateSocialMediaRequest } from '../../../models/socialMedia';
import { Sidebar } from '../../shared/sidebar/sidebar';
import { UserHeader } from '../../shared/user-header/user-header';
import { Sideteacher } from './../../shared/sideteacher/sideteacher';
import { Sidestudent } from './../../shared/sidestudent/sidestudent';
import { TranslationService } from '../../../services/translation';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Certificate, Post, UpdatePostRequest, UpdateUserProfileRequest, UserProfile, UserSessionFeedback, UserSummary } from '../../../models/userProfile';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { SkillService } from '../../../services/api/skillUserService';
import { Skill } from '../../../models/skillUser';
import { Category } from '../../../models/categoryProfile';
import { CategoryService } from '../../../services/api/categoryProfileService';
import { PostService } from '../../../services/api/postService';
import { LikeService } from '../../../services/api/likeService';

interface PostWithState extends Post {
  likedByUser?: boolean;
  totalLiked?: number;
    dropdownOpen?: boolean;
}

@Component({
  selector: 'app-my-profile-component',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    Sidestudent,
    UserHeader,
    RouterLink,
    FontAwesomeModule
  ],
  templateUrl: './my-profile-component.html',
  styleUrl: './my-profile-component.css',
  encapsulation: ViewEncapsulation.None
})
export class MyProfileComponent implements OnInit {

  faStar = faStar;
  profile: UserProfile | null = null;
  updateData: UpdateUserProfileRequest = {};
  skills: Skill[] = [];
  categories: Category[] = [];
  categorySkills: Skill[] = [];
  loading = false;
  selectedFile?: File;
  showAddSkill = false;
  selectedCategoryId?: number | 'new';
  selectedSkillId?: number | 'new';
  newSkillGoodAt?: number;
  projects: Project[] = [];
  showAddProject = false;
  newProject: CreateProjectRequest = { userId: 0, projectName: '', projectDesc: '', repolink: '' };
  editingProjectId?: number;
  editName = false;
  editExperience = false;
  isEditing = false;
  certificates: Certificate[] = [];
  isSidebarOpen = true;
  isDarkMode = false;
  screenWidth: number = window.innerWidth;
  socialMedia?: SocialMedia;
  socialMediaData: UpdateSocialMediaRequest = {};
  showAddSocialMedia = false;

    isEditModalOpen = false;
  editingPost: PostWithState | null = null;
  editContent = '';
  editCategoryId: number | null = null;
  editSkillId: number | null = null;
  editMedias: any[] = [];
  tr(key: string) {
    return this.t.translate(key);
  }

  userId!: number;
  posts: Post[] = [];
  editingPostId: number | null = null;
  updatedContent = '';
  userPoints: number = 0;
  collapsed = false;

  //1.maysoon
  myRating: number = 0;
  myBadge: string = 'NoRating';
  myBadgeUrl: string = 'https://stlearnteach2.blob.core.windows.net/badges/no.svg';

nationalIdStatus: 'Approved' | 'Not Approved Yet' = 'Not Approved Yet';
  constructor(
    private profileService: UserProfileService,
    private postService: PostService,
    private likeService: LikeService,
    private auth: AuthService,
    private skillService: SkillService,
    private categoryService: CategoryService,
    private projectService: ProjectService,
    private http: HttpClient,
    private socialMediaService: SocialMediaService,
    private route: ActivatedRoute,
    public t: TranslationService,
    public post:PostService
  ) { }

  // postsWithState: (Post & { likedByUser?: boolean; totalLiked?: number })[] = [];
  postsWithState: PostWithState[] = [];

  currentUserId!: number;
  feedbacks: UserSessionFeedback[] = [];

  ngOnInit(): void {

    const user = this.auth.currentUser;
    if (!user) return;

    this.userId = user.userId;
    this.currentUserId = user.userId;
    this.loading = true;
    this.newProject.userId = this.userId;

    this.getUserPoints();
    this.loadNationalIdStatus();
    this.profileService.getMyReceivedFeedbacks().subscribe({
      next: res => {
        this.feedbacks = res;
      },
      error: err => console.error(err)
    });

    forkJoin({
      profile: this.profileService.getById(this.userId),
      skills: this.skillService.getByUserId(this.userId).pipe(catchError(() => of([]))),
      categories: this.categoryService.getAll(),
      projects: this.projectService.getByUserId(this.userId).pipe(catchError(() => of([]))),
      certificates: this.profileService.getUserCertificates(this.userId).pipe(catchError(() => of([]))),
posts: this.postService.getByUserId(this.userId).pipe(
  catchError(() => of([] as Post[])),
  map(posts => posts.map(p => ({
    ...p,
    user: p.user 
      ? { 
          userId: p.user.userId, 
          fname: p.user.fname ?? '', 
          lname: p.user.lname ?? '' 
        } 
      : { userId: this.currentUserId, fname: '', lname: '' },
    dropdownOpen: false
  })))
),

    }).subscribe({
      next: async ({ profile, skills, categories, projects, certificates, posts }) => {

        this.profile = profile;
        this.loadSocialMedia();
        this.skills = (skills || []).map(s => ({ ...s, goodAtIt: s.goodAtIt ?? 5 }));
        this.categories = categories || [];
        this.projects = projects || [];
        this.certificates = certificates || [];

const postsWithLikes = await Promise.all(
  posts.map(async (p) => {
    // لو post.user غير موجود أو userId = 0، خليها currentUserId
    const user = p.user && p.user.userId ? p.user : { userId: this.currentUserId, fname: '', lname: '' };

    const [likedByUser, likesCountResponse] = await Promise.all([
      this.likeService.isLiked(p.postId, this.currentUserId).toPromise(),
      this.likeService.getLikesCount(p.postId).toPromise()
    ]);

    return {
      ...p,
      likedByUser: likedByUser ?? false,
      totalLiked: Number(likesCountResponse) || 0,
      dropdownOpen: false,
      user
    } as PostWithState;
  })
);




        this.postsWithState = postsWithLikes;
        this.loading = false;
      },
      error: err => {
        console.error(err);
        this.loading = false;
      }
    });

    this.loadMyRating();
  }

toggleLike(post: PostWithState) {
  if (!this.currentUserId) return;

  const wasLiked = post.likedByUser === true;

  const request = wasLiked
    ? this.profileService.removeLike(post.postId, this.currentUserId)
    : this.profileService.addLike(post.postId, this.currentUserId);

  request.subscribe({
    next: () => {
      post.likedByUser = !wasLiked;
      post.totalLiked = Number(post.totalLiked ?? 0);

      post.totalLiked += wasLiked ? -1 : 1;

      if (post.totalLiked < 0) post.totalLiked = 0;
    },
    error: err => console.error('Like error', err)
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
      next: allSkills =>
        this.categorySkills = allSkills
          .filter(s =>
            s.cateId === this.selectedCategoryId &&
            !this.skills.some(us => us.id === s.id)
          )
          .map(s => ({ ...s, goodAtIt: s.goodAtIt ?? 5 })),
      error: err => console.error(err)
    });
  }

  addSelectedSkill() {
    if (!this.profile || !this.selectedSkillId) return;

    const skill = this.categorySkills.find(s => s.id === Number(this.selectedSkillId));
    if (!skill) return;

    skill.goodAtIt = Math.max(1, Math.min(this.newSkillGoodAt ?? 5, 5));

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

  editSkill(skill: Skill) {
    skill.editing = !skill.editing;
  }

  saveSkill(skill: Skill) {
    skill.editing = false;
    this.skillService.updateSkill(skill).subscribe({
      next: () => { },
      error: err => console.error(err)
    });
  }

  deleteSkill(skill: Skill) {
    if (!this.profile) return;

    this.skillService.deleteUserSkill(this.profile.userId, skill.id).subscribe({
      next: () => this.skills = this.skills.filter(s => s.id !== skill.id),
      error: err => console.error(err)
    });
  }

  editProject(proj: Project) {
    proj.editing = !proj.editing;
  }

  saveProject(proj: Project) {
    proj.editing = false;

    this.projectService.update(
      proj.projectId,
      {
        projectName: proj.projectName,
        projectDesc: proj.projectDesc,
        repolink: proj.repolink
      }
    ).subscribe({
      next: () => { },
      error: err => console.error(err)
    });
  }

  addProject() {
    if (!this.newProject.projectName) return;

    this.projectService.create(this.newProject).subscribe({
      next: res => {
        this.projects.push(res);
        this.newProject = {
          ...this.newProject,
          projectName: '',
          projectDesc: '',
          repolink: ''
        };
        this.showAddProject = false;
      },
      error: err => console.error(err)
    });
  }

  deleteProject(id: number) {
    this.projectService.delete(id).subscribe({
      next: () => this.projects = this.projects.filter(p => p.projectId !== id),
      error: err => console.error(err)
    });
  }

  saveChanges() {
    if (!this.profile) return;

    const formData = new FormData();
    formData.append('Fname', this.updateData.fname ?? this.profile.fname ?? '');
    formData.append('Lname', this.updateData.lname ?? this.profile.lname ?? '');
    formData.append('ExperienceText', this.updateData.experienceText ?? this.profile.experienceText ?? '');

    if (this.selectedFile) {
      formData.append('file', this.selectedFile, this.selectedFile.name);
    }

    this.profileService.update(this.profile.userId, formData).subscribe({
      next: (res: any) => {
        this.profile = { ...this.profile!, ...res };
        this.editName = false;
        this.editExperience = false;
        this.isEditing = false;
        console.log('Profile updated successfully', res);
      },
      error: (err) => {
        console.error('Error updating profile', err);
      }
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length)
      this.selectedFile = input.files[0];
  }

  uploadProfilePicture() {
    if (!this.selectedFile || !this.profile) return;

    this.profileService.uploadProfilePicture(this.profile.userId, this.selectedFile).subscribe({
      next: (res: any) => {
        if (res.profilePic || res.fileUrl) {
          this.profile!.profilePic = res.profilePic ?? res.fileUrl;
        }
      },
      error: err => console.error(err)
    });
  }

  loadSocialMedia() {
    if (!this.profile) return;

    this.socialMediaService.getByUserId(this.profile.userId).subscribe({
      next: res => {
        this.socialMedia = Array.isArray(res) ? res[0] : res;

        if (this.socialMedia) {
          this.socialMediaData = {
            facebookLink: this.socialMedia.facebookLink ?? '',
            linkedin: this.socialMedia.linkedin ?? '',
            personalWebsite: this.socialMedia.personalWebsite ?? ''
          };
        } else {
          this.socialMediaData = {
            facebookLink: '',
            linkedin: '',
            personalWebsite: ''
          };
        }
      },
      error: err => console.error(err)
    });
  }

  showAddSocialMediaForm() {
    if (!this.profile) return;

    this.socialMediaData = {
      facebookLink: '',
      linkedin: '',
      personalWebsite: ''
    };
    this.showAddSocialMedia = true;
  }

  editExistingSocialMedia() {
    if (!this.socialMedia) return;

    this.socialMediaData = {
      facebookLink: this.socialMedia.facebookLink,
      linkedin: this.socialMedia.linkedin,
      personalWebsite: this.socialMedia.personalWebsite
    };
    this.showAddSocialMedia = true;
  }

  cancelSocialMediaEdit() {
    this.showAddSocialMedia = false;
    this.socialMediaData = {};
  }

  deleteSocialMedia() {
    if (!this.socialMedia?.accountId) return;

    this.socialMediaService.delete(this.socialMedia.accountId).subscribe({
      next: () => {
        this.socialMedia = undefined;
        this.socialMediaData = {
          facebookLink: '',
          linkedin: '',
          personalWebsite: ''
        };
        this.showAddSocialMedia = false;
      },
      error: err => console.error(err)
    });
  }

  saveSocialMedia() {
    if (!this.profile) return;

    const userId = this.profile.userId;

    if (this.socialMedia?.accountId) {
      const updateData = {
        ...this.socialMediaData,
        accountId: this.socialMedia.accountId,
        userId
      };

      this.socialMediaService.update(updateData).subscribe({
        next: res => {
          this.socialMedia = res;
          this.showAddSocialMedia = false;
        },
        error: err => console.error(err)
      });

    } else {
      const createRequest = {
        ...this.socialMediaData,
        userId
      };

      this.socialMediaService.create(createRequest).subscribe({
        next: res => {
          this.socialMedia = res;
          this.showAddSocialMedia = false;
        },
        error: err => console.error(err)
      });
    }
  }

  toggleTheme() {
    document.body.classList.toggle('dark');
  }

  getSkillColor(level?: number) {
    if (level === undefined) return 'gray';
    if (level <= 3) return 'red';
    if (level <= 7) return 'orange';
    return 'green';
  }

  getProgressWidth(level?: number) {
    return Math.min(level ?? 0, 10) * 10;
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
    this.collapsed = !this.collapsed;
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;

    if (this.isDarkMode)
      document.body.classList.add('dark');
    else
      document.body.classList.remove('dark');
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.screenWidth = event.target.innerWidth;
    if (this.screenWidth >= 1024)
      this.isSidebarOpen = true;
  }

  isMobile(): boolean {
    return this.screenWidth < 1024;
  }

  startEditing(post: Post) {
    this.editingPostId = post.postId;
    this.updatedContent = post.content;
  }

  cancelEditing() {
    this.editingPostId = null;
    this.updatedContent = '';
  }

  savePost(post: Post) {
    if (!this.updatedContent.trim()) return;

    const dto: UpdatePostRequest = {
      Content: this.updatedContent,
      SkillId: 0,
      PostType: null,
      Medias: (post.medias ?? []).map(m => ({
        PmediaId: m.pmediaId ?? undefined,
        MediaUrl: m.mediaUrl,
        EntityType: m.entityType ?? undefined
      }))
    };

    this.profileService.updatePost(post.postId, dto).subscribe({
      next: () => {
        post.content = this.updatedContent;
        this.cancelEditing();
      },
      error: () => alert('Failed to update post')
    });
  }

  getStarsArray(goodAtIt?: number): ('full' | 'empty')[] {
    const totalStars = 5;
    const stars: ('full' | 'empty')[] = [];
    const value = goodAtIt !== undefined
      ? Math.min(Math.max(goodAtIt, 0), totalStars)
      : 0;

    for (let i = 0; i < totalStars; i++) {
      stars.push(i < value ? 'full' : 'empty');
    }

    return stars;
  }

  getUserPoints() {
    this.http.get<any>(`${environment.apiUrl}/Diamond/user/${this.userId}`)
      .subscribe({
        next: res => {
          this.userPoints = res.totalPoints ?? 0;
        },
        error: err => {
          console.error('Error loading user points', err);
        }
      });
  }

  //2.maysoon
  loadMyRating() {
    this.profileService.getMyRating().subscribe({
      next: (res) => {
        this.myRating = res.rating;
        this.myBadge = res.badge;
        this.myBadgeUrl = res.badgeUrl;
      },
      error: (err) => console.error('Error loading my rating', err)
    });
  }


    openEditModal(post: PostWithState) {
    this.editingPost = post;
    this.editContent = post.content;
    this.editCategoryId = post.categoryId ?? null;
    this.editSkillId = post.skillId ?? null;
    this.editMedias = post.medias || [];
    this.isEditModalOpen = true;
  }

  closeEditModal() {
    this.isEditModalOpen = false;
    this.editingPost = null;
    this.editContent = '';
    this.editCategoryId = null;
    this.editSkillId = null;
    this.editMedias = [];
  }
// Toggle the dropdown menu for a post
toggleDropdown(post: PostWithState) {
  post.dropdownOpen = !post.dropdownOpen;
}

  saveEdit() {
    if (!this.editingPost || !this.editContent.trim()) return;

    const data = {
      Content: this.editContent.trim(),
      CategoryId: this.editCategoryId,
      SkillId: this.editSkillId,
      Medias: this.editMedias
    };

    this.postService.update(this.editingPost.postId, data).subscribe({
      next: (updatedPost) => {
        // تحديث محلي
        // Object.assign(this.editingPost, updatedPost);
        this.closeEditModal();
      },
      error: () => alert('Edit failed')
    });
  }

   // ... باقي الكود زي ما هو

deletePost(p: PostWithState) {
  if (!this.currentUserId) {
    alert('You must be logged in!');
    return;
  }

  if (!confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
    return;
  }

  this.postService.delete(p.postId, this.currentUserId).subscribe({  
    next: () => {
      this.posts = this.posts.filter(post => post.postId !== p.postId);
      alert('Post deleted successfully!');
    },
    error: () => alert('Delete failed')
  });
}

  // --------------------- نهاية edit & delete ---------------------






// Edit
toggleEdit(post: any) {
  this.editingPostId = post.postId;
  this.updatedContent = post.content;
}

// Save edited post

//Maysoon New 
 private getAuthHeaders(): { headers: HttpHeaders } {
  const token = localStorage.getItem("token");
  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`,
  });
  return { headers };
}

loadNationalIdStatus() {
  this.http.get<any>(`${environment.apiUrl}/UserNationalId/status`, this.getAuthHeaders())
    .subscribe({
      next: res => {
        this.nationalIdStatus = res.verificationStatus === 'Approved' ? 'Approved' : 'Not Approved Yet';
      },
      error: err => {
        console.error('Error loading national ID status', err);
        this.nationalIdStatus = 'Not Approved Yet';
      }
    });
}

}