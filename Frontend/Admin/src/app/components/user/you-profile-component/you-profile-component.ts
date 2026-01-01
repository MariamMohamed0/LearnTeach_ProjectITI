import { Component, CUSTOM_ELEMENTS_SCHEMA, HostListener, OnInit, ViewEncapsulation } from '@angular/core';


import { CommonModule } from '@angular/common';
import { catchError, forkJoin, of } from 'rxjs';




import { AuthService } from '../../../services/api/authService';
import { environment } from '../../../../environments/environment';
import { TranslationService } from '../../../services/translation';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { faStar,faThumbsUp } from '@fortawesome/free-solid-svg-icons';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Sidestudent } from '../../shared/sidestudent/sidestudent';
import { UserHeader } from '../../shared/user-header/user-header';

import { LanguageService } from '../../../services/language';

import { Skill } from '../../../models/user/skillStart';

import { UserProfile, UserSessionFeedback } from '../../../models/user/userProfile';
import { Project } from '../../../models/user/project';

import { SocialMedia } from '../../../models/user/socialMedia';
import { Category } from '../../../models/user/categoryProfile';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UserProfileService } from '../../../services/api/user/userProfileService';
import { SkillService } from '../../../services/api/user/skillUserService';
import { CategoryService } from '../../../services/api/user/categoryProfileService';
import { ProjectService } from '../../../services/api/user/projectService';
import { SocialMediaService } from '../../../services/api/user/socialMediaService';
import { Certificate } from '../../../models/userProfile';

interface PostWithLikes {
  postId: number;
  totalLiked: number;
  isLikedByMe: boolean;
  content: string;
  createdAt?: string | null;
  skillName?: string | null;
  medias?: any[];
  totalComments?: number;

}



@Component({
  selector: 'app-you-profile-component',
  imports: [CommonModule, FormsModule, HttpClientModule, ReactiveFormsModule, Sidestudent, UserHeader, RouterLink, FontAwesomeModule,FormsModule],
 standalone: true,
  templateUrl: './you-profile-component.html',
  styleUrl: './you-profile-component.css',
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  encapsulation: ViewEncapsulation.None
})
export class YouProfileComponent implements OnInit {
  faStar = faStar;
faThumbsUp = faThumbsUp;
  userId!: number;
  profile: UserProfile | null = null;
  skills: Skill[] = [];
  projects: Project[] = [];
  certificates: Certificate[] = [];
  socialMedia?: SocialMedia;
  // posts: Post[] = [];
  posts: PostWithLikes[] = [];

  categories: Category[] = [];
  loading = false;
  screenWidth: number = window.innerWidth;
  userPoints: number = 0;
  isSidebarOpen = true;
  isDarkMode = false;
  //1.Maysoon
  userRating: number = 0;
  myBadge: string = '';
  myBadgeUrl: string = '';
feedbacks: UserSessionFeedback[] = [];
  receiverId!: number;
isRtl = true;
//maysoon
  nationalIdStatus: 'Approved' | 'Not Approved Yet' = 'Not Approved Yet';
  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private profileService: UserProfileService,
    private skillService: SkillService,
    private categoryService: CategoryService,
    private projectService: ProjectService,
    private socialMediaService: SocialMediaService,
    public t: TranslationService,
    private router:Router,
    private languageService: LanguageService
  ) { }

  ngOnInit(): void {
    this.userId = Number(this.route.snapshot.paramMap.get('id'));
    if (!this.userId) return;

    this.loading = true;
    this.getUserPoints();
          this.loadNationalIdStatus();
  this.languageService.isRtl$.subscribe(value => {
    this.isRtl = value;
  });
  
    forkJoin({
      profile: this.profileService.getById(this.userId),
      skills: this.skillService.getByUserId(this.userId).pipe(catchError(() => of([]))),
      categories: this.categoryService.getAll(),
      projects: this.projectService.getByUserId(this.userId).pipe(catchError(() => of([]))),
      certificates: this.profileService.getUserCertificates(this.userId).pipe(catchError(() => of([]))),
      posts: this.profileService.getUserPosts(this.userId).pipe(catchError(() => of([])))
    }).subscribe({
      next: ({ profile, skills, categories, projects, certificates, posts }) => {
        this.profile = profile;
        this.skills = (skills || []).map(s => ({ ...s, goodAtIt: s.goodAtIt ?? 5 }));
        this.categories = categories || [];
        this.projects = projects || [];
        this.certificates = certificates || [];
        // this.posts = posts || [];
         const userId = Number(localStorage.getItem('userId'));
this.posts = (posts || []).map(p => ({
  postId: p.postId,
  content: p.content,
  skillName: p.skillName,
  createdAt: p.createdAt,
  medias: p.medias,
  totalComments: p.totalComments ?? 0,
  totalLiked: p.totalLiked ?? 0,      
  isLikedByMe: false                  
}));


    this.loadLikesForPosts();
        this.loading = false;
        this.loadSocialMedia();


       this.getUserFeedbacks();
        //2.maysoon
         this.loadUserRating(); 
      },
      error: err => { console.error(err); this.loading = false; }
    });
  }
loadLikesForPosts() {
  const userId = Number(localStorage.getItem('userId'));
  if (!userId) return;

  this.posts.forEach(post => {
    this.profileService.isLiked(post.postId, userId).subscribe({
      next: liked => post.isLikedByMe = liked,
      error: err => console.error('Error loading like status', err)
    });
  });
}

  //3.maysoon
  loadUserRating() {
  this.profileService.getUserRating(this.userId).subscribe({
    next: res => {
      this.userRating = res.rating;
      this.myBadge = res.badge;
      this.myBadgeUrl = res.badgeUrl;
    },
    error: err => console.error('Error loading user rating', err)
  });
}

  loadSocialMedia() {
    if (!this.profile) return;
    this.socialMediaService.getByUserId(this.profile.userId).subscribe({
      next: res => this.socialMedia = Array.isArray(res) ? res[0] : res,
      error: err => console.error(err)
    });
  }

  getStarsArray(goodAtIt?: number): ('full' | 'empty')[] {
    const totalStars = 5;
    const stars: ('full' | 'empty')[] = [];
    const value = goodAtIt !== undefined ? Math.min(Math.max(goodAtIt, 0), totalStars) : 0;
    for (let i = 0; i < totalStars; i++) stars.push(i < value ? 'full' : 'empty');
    return stars;
  }

  getUserPoints() {
    this.http.get<any>(`${environment.apiUrl}/Diamond/user/${this.userId}`).subscribe({
      next: res => this.userPoints = res.totalPoints ?? 0,
      error: err => console.error('Error loading user points', err)
    });
  }

  toggleSidebar() { this.isSidebarOpen = !this.isSidebarOpen; }
  toggleDarkMode() { this.isDarkMode = !this.isDarkMode; if (this.isDarkMode) document.body.classList.add('dark'); else document.body.classList.remove('dark'); }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) { this.screenWidth = event.target.innerWidth; if (this.screenWidth >= 1024) this.isSidebarOpen = true; }
  isMobile(): boolean { return this.screenWidth < 1024; }



getUserFeedbacks() {
  if (!this.userId) return;
  this.profileService.getReceivedFeedbacksuser(this.userId).subscribe({
    next: res => {
      this.feedbacks = res;
      console.log('Feedbacks loaded:', this.feedbacks);
    },
    error: err => console.error('Error loading feedbacks', err)
  });
}
toggleLike(postId: number) {
  const userId = Number(localStorage.getItem('userId'));
  if (!userId) return;

  const post = this.posts.find(p => p.postId === postId);
  if (!post) return;

  if (post.isLikedByMe) {
    this.profileService.removeLike(postId, userId).subscribe({
      next: () => {
        post.isLikedByMe = false;
        post.totalLiked--;
      },
      error: err => console.error('Remove like error', err)
    });
  } else {
    this.profileService.addLike(postId, userId).subscribe({
      next: () => {
        post.isLikedByMe = true;
        post.totalLiked++;
      },
      error: err => console.error('Add like error', err)
    });
  }
}




openChatWithUser(user2Id?: number) {
  if (!user2Id) return;

  const token = localStorage.getItem('token') || '';

  this.http.post<{ chatId: string }>(
    `${environment.apiUrl}/UserChat/create?user2=${user2Id}`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  ).subscribe({
    next: res => {
      const chatId = res.chatId;
      if (chatId) {
        this.router.navigate(
          ['/chat', chatId],
          { queryParams: { receiverId: user2Id } }
        );
      }
    },
    error: err => console.error(err)
  });
}



//Maysoon New 
 private getAuthHeaders(): { headers: HttpHeaders } {
  const token = localStorage.getItem("token");
  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`,
  });
  return { headers };
}

loadNationalIdStatus() {
  this.http.get<any>(`${environment.apiUrl}/UserNationalId/status/${this.userId}`, this.getAuthHeaders())
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





  tr(key: string) { return this.t.translate(key); }
}