import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Sidebar } from '../../shared/sidebar/sidebar';

import { LikeService } from '../../../services/api/likeService';
import { Like } from '../../../models/like';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminHeader } from '../../shared/admin-header/admin-header';

@Component({
  selector: 'app-post-likes',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, Sidebar, AdminHeader],
  templateUrl: './likes.html',
  styleUrls: ['./likes.css']
})
export class PostLikesComponent implements OnInit {

  postId!: number;
  likes: Like[] = [];
  loading = false;
  error = '';
  isSidebarOpen = true;
  isDarkMode = false;
  screenWidth: number = window.innerWidth;
  constructor(
    private route: ActivatedRoute,
    private likeService: LikeService
  ) {}

  ngOnInit(): void {
    this.postId = Number(this.route.snapshot.paramMap.get('postId'));
    this.loadLikes();
  }

  loadLikes() {
    this.loading = true;

    this.likeService.getLikesByPost(this.postId).subscribe({
      next: (res) => {
        this.likes = res;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load likes.';
        this.loading = false;
      }
    });
  }

  deleteLike(like: Like) {
    if (!confirm('Delete this like?')) return;

    this.likeService.unlike(like.postId, like.userId).subscribe({
      next: () => this.loadLikes(),
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
}