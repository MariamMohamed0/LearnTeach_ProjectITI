import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PostService } from '../../../services/api/postService';
import { CommentService } from '../../../services/api/commentService';

import { Post } from '../../../models/post';
import { Comment } from '../../../models/comment';
import { Sidebar } from '../../shared/sidebar/sidebar';
import { AdminHeader } from '../../shared/admin-header/admin-header';
import { TranslationService } from '../../../services/translation';

@Component({
  selector: 'app-post-view',
  standalone: true,
  imports: [CommonModule, FormsModule,ReactiveFormsModule, FormsModule, Sidebar, AdminHeader],
  templateUrl: './post-view.html',
  styleUrls: ['./post-view.css']
})
export class PostViewComponent implements OnInit {

  postId!: number;
  post!: Post;
  comments: Comment[] = [];

  loading = false;
  error = '';

      isSidebarOpen = true;
  isDarkMode = false;
  screenWidth: number = window.innerWidth;
  constructor(
    private route: ActivatedRoute,
    private postService: PostService,
    private commentService: CommentService,
    public t: TranslationService
  ) {}

  ngOnInit(): void {
    // this.postId = Number(this.route.snapshot.paramMap.get('id'));
    this.postId = Number(this.route.snapshot.paramMap.get('postId'));
     console.log("Loaded Post ID =", this.postId);

    this.loadPost();
    this.loadComments();
  }

  loadPost() {
    this.loading = true;

    this.postService.getById(this.postId).subscribe({
      next: (res) => {
        this.post = res;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load post';
        this.loading = false;
      }
    });
  }

  loadComments() {
    this.commentService.getByPost(this.postId).subscribe({
      next: (res) => (this.comments = res),
      error: () => (this.error = 'Failed to load comments')
    });
  }

  deleteComment(id: number) {
    if (!confirm('Delete this comment?')) return;

    this.commentService.delete(id).subscribe({
      next: () => this.loadComments(),
      error: () => alert('Delete failed')
    });
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
