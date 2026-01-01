



import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Post } from '../../../models/post';
import { Like } from '../../../models/like';
import { PostService } from '../../../services/api/postService';
import { LikeService } from '../../../services/api/likeService';
import { CommentService } from '../../../services/api/commentService';
import { Comment } from '../../../models/comment';
import { UserHeader } from '../../shared/user-header/user-header';
import { Sidestudent } from './../../shared/sidestudent/sidestudent';
import { MakeReportComponent } from '../../make-report/make-report';
import { UserReportsComponent } from '../../user-reports/user-reports';
import { AuthService } from '../../../services/api/authService';  // أضف ده

@Component({
  selector: 'app-post-detail',
  standalone: true,
  imports: [CommonModule, FormsModule,RouterLink, Sidestudent, UserHeader, MakeReportComponent, UserReportsComponent],
  templateUrl: './post-detail.html'
})
export class PostDetailComponent implements OnInit {
  postId!: number;
  post!: Post;
  likes: Like[] = [];
  comments: Comment[] = [];
  newComment = '';

  loading = false;
  likedByUser = false;
  currentUserId: number | null = null;  // غير من 1 لـ null
  isSidebarOpen = true;
  isDarkMode = false;
  screenWidth: number = window.innerWidth;

  constructor(
    private route: ActivatedRoute,
    private postService: PostService,
    private likeService: LikeService,
    private commentService: CommentService,
    private authService: AuthService  
  ) {}

  ngOnInit(): void {
    this.postId = Number(this.route.snapshot.paramMap.get('postId') || this.route.snapshot.paramMap.get('id'));
    this.currentUserId = this.authService.getCurrentUserId();  
    this.loadAll();
  }

  loadAll() {
    this.loadPost();
    this.loadLikes();
    this.loadComments();
    this.checkIfLiked();
  }

  loadPost() {
    this.postService.getById(this.postId).subscribe({ next: p => this.post = p });
  }

  loadLikes() {
    this.likeService.getLikesByPost(this.postId).subscribe({ next: res => this.likes = res });
  }

  checkIfLiked() {
    if (!this.currentUserId) return;
    this.likeService.isLiked(this.postId, this.currentUserId).subscribe({ next: res => this.likedByUser = !!res, error: () => this.likedByUser = false });
  }

  toggleLike() {
    if (!this.currentUserId) {
      alert('You must be logged in to like posts!');
      return;
    }

    if (this.likedByUser) {
      this.likeService.unlike(this.postId, this.currentUserId).subscribe({
        next: () => {
          this.likedByUser = false;
          // حدث محليًا: أزل اللايك من الـ array
          this.likes = this.likes.filter(like => like.userId !== this.currentUserId);
          // استدعِ loadLikes() كـ backup لو في مشكلة
          this.loadLikes();
        },
        error: () => alert('Unlike failed')
      });
    } else {
      this.likeService.like(this.postId, this.currentUserId).subscribe({
        next: () => {
          this.likedByUser = true;
          this.likes.push({ userId: this.currentUserId, postId: this.postId } as Like);
          this.loadLikes();
        },
        error: () => alert('Like failed')
      });
    }
  }

  loadComments() {
    this.commentService.getByPost(this.postId).subscribe({ next: res => this.comments = res });
  }

  addComment() {
    if (!this.currentUserId) {
      alert('You must be logged in to comment!');
      return;
    }

    if (!this.newComment.trim()) return;
    const body = { commentText: this.newComment, userId: this.currentUserId, postId: this.postId };
    this.commentService.create(this.postId, body).subscribe({
      next: c => {
        this.newComment = '';
        // حدث محليًا: أضف الكومنت الجديد للـ array
        this.comments.push(c);
        // استدعِ loadComments() كـ backup
        this.loadComments();
      },
      error: () => alert('Add comment failed')
    });
  }

  toggleSidebar() { this.isSidebarOpen = !this.isSidebarOpen; }
  toggleDarkMode() { this.isDarkMode = !this.isDarkMode; if (this.isDarkMode) document.body.classList.add('dark'); else document.body.classList.remove('dark'); }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) { this.screenWidth = event.target.innerWidth; if (this.screenWidth >= 1024) this.isSidebarOpen = true; }

  isMobile(): boolean { return this.screenWidth < 1024; }
}