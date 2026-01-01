import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CommentService } from '../../../services/api/commentService';
import { Comment } from '../../../models/comment';
import { Sidebar } from '../../shared/sidebar/sidebar';
import { AdminHeader } from '../../shared/admin-header/admin-header';
import { TranslationService } from '../../../services/translation';

@Component({
  selector: 'app-admin-comments',
  standalone: true,
  imports: [CommonModule, FormsModule,ReactiveFormsModule, FormsModule, Sidebar, AdminHeader],
  templateUrl: './comments.html',
  styleUrls: ['./comments.css']
})
export class CommentsComponent implements OnInit {

  comments: Comment[] = [];
  filtered: Comment[] = [];

  postId: number | null = null;

  search = '';
  loading = false;
  error = '';

  page = 1;
  pageSize = 10;

    isSidebarOpen = true;
  isDarkMode = false;
  screenWidth: number = window.innerWidth;
  constructor(
    private commentService: CommentService,
    private route: ActivatedRoute,
        public t: TranslationService
  ) {}

  ngOnInit(): void {
    this.postId = Number(this.route.snapshot.paramMap.get('postId'));
    this.load();
  }

  load() {
    this.loading = true;
    this.error = '';


    if (this.postId) {
      this.commentService.getByPost(this.postId).subscribe({
        next: (res) => {
          this.comments = res;
          this.applyFilter();
          this.loading = false;
        },
        error: () => {
          this.error = 'Failed to load comments.';
          this.loading = false;
        }
      });
      return;
    }

    // Otherwise → load ALL comments
    this.commentService.getAll().subscribe({
      next: (res) => {
        this.comments = res;
        this.applyFilter();
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load comments.';
        this.loading = false;
      }
    });
  }

  applyFilter() {
    const s = this.search.toLowerCase().trim();
    this.filtered = this.comments.filter(c =>
      c.commentText?.toLowerCase().includes(s) ||
      c.userName?.toLowerCase().includes(s) ||
      String(c.postId).includes(s)
    );
  }

  onSearch() {
    this.applyFilter();
    this.page = 1;
  }

  deleteComment(id: number) {
    if (!confirm('Are you sure you want to delete this comment?')) return;

    this.commentService.delete(id).subscribe({
      next: () => this.load(),
      error: () => alert('Delete failed')
    });
  }

  get paginated() {
    const start = (this.page - 1) * this.pageSize;
    return this.filtered.slice(start, start + this.pageSize);
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