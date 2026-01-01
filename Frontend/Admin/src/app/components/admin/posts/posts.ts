import { Component, HostListener, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { PostService } from '../../../services/api/postService';
import { Post } from '../../../models/post';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Sidebar } from '../../shared/sidebar/sidebar';
import { AdminHeader } from '../../shared/admin-header/admin-header';
import { TranslationService } from '../../../services/translation';

@Component({
  selector: 'app-admin-posts',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule ,ReactiveFormsModule, FormsModule, Sidebar, AdminHeader],
  templateUrl: './posts.html',
  styleUrls: ['./posts.css']
})
export class PostsComponent implements OnInit {
  posts: Post[] = [];
  loading = false;
  error: string | null = null;
  page = 1;
  pageSize = 10;
  total = 0;
  search = '';

      isSidebarOpen = true;
  isDarkMode = false;
  screenWidth: number = window.innerWidth;
  constructor(private postService: PostService,public t: TranslationService) {}

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.loading = true;
    this.error = null;
    this.postService.getAll(this.page, this.pageSize, this.search)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (res) => {
          this.posts = res.items;
          this.page = res.page ?? this.page;
          this.pageSize = res.pageSize ?? this.pageSize;
          this.total = res.total ?? this.posts.length;
          console.log('Mapped posts:', this.posts);
        },
        error: (err) => {
          console.error(err);
          this.error = err?.message ?? 'Failed to load posts';
        }
      });
  }

  onSearch() {
    this.page = 1;
    this.load();
  }

  onPageChange(newPage: number) {
    this.page = newPage;
    this.load();
  }

  onDelete(id: number) {
    if (!confirm('Are you sure you want to delete this post?')) return;
    this.loading = true;
    this.postService.delete(id).pipe(finalize(() => this.loading = false)).subscribe({
      next: () => this.load(),
      error: (err) => alert('Delete failed')
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
