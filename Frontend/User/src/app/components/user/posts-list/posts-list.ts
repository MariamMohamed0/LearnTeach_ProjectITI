




// import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { RouterModule } from '@angular/router';
// import { Post } from '../../../models/post';
// import { PostService } from '../../../services/api/postService';
// import { LikeService } from '../../../services/api/likeService';
// import { CommentService } from '../../../services/api/commentService';
// import { Subscription } from 'rxjs';
// import { Comment } from '../../../models/comment';
// import { AuthService } from '../../../services/api/authService';
// import { CategoryService } from '../../../services/api/categoryService';  // أضف ده لو مش موجود
// import { SkillService } from '../../../services/api/skillUserService';  // أضف ده لو مش موجود
// import { Category } from '../../../models/category';  // أضف ده لو مش موجود
// import { Skill } from '../../../models/skillStart';  // أضف ده لو مش موجود

// interface PostWithState extends Post {
//   likedByUser?: boolean;
//   totalLiked?: number;
//   skillId?: number;  // أضفنا ده عشان نقدر نستخدمه في الإديت
//   dropdownOpen?: boolean;
// }

// @Component({
//   selector: 'app-posts-list',
//   standalone: true,
//   imports: [CommonModule, FormsModule, RouterModule],
//   templateUrl: './posts-list.html'
// })
// export class PostsListComponent implements OnInit, OnChanges {
//   @Input() selectedCategoryId: number | null = null;
//   posts: PostWithState[] = [];
//   loading = false;
//   search = '';
//   page = 1;
//   pageSize = 10;
//   total = 0;
//   private subs = new Subscription();

//   currentUserId: number | null = null;
//   comments: Comment[] = [];

//   // متغيرات جديدة للإديت
//   isEditModalOpen = false;
//   editingPost: PostWithState | null = null;
//   editContent = '';
//   editCategoryId: number | null = null;
//   editSkillId: number | null = null;
//   editMedias: any[] = [];
//   categories: Category[] = [];  
//   skills: Skill[] = [];  

//   constructor(
//     private postService: PostService,
//     private likeService: LikeService,
//     private commentService: CommentService,
//     private authService: AuthService,
//     private categoryService: CategoryService,  
//     private skillService: SkillService  
//   ) {}

//   ngOnInit(): void {
//     this.currentUserId = this.authService.getCurrentUserId();
//     this.loadPosts();
//     this.loadCategories();  // أضف ده لو مش موجود
//     this.loadSkills();  // أضف ده لو مش موجود
//     const s = this.postService.postsUpdated$.subscribe(post => {
//       this.posts = [post, ...this.posts];
//     });
//     this.subs.add(s);
//   }

//   ngOnChanges(changes: SimpleChanges): void {
//     if (changes['selectedCategoryId']) {
//       this.page = 1;
//       this.loadPosts();
//     }
//   }

//   loadPosts() {
//     this.loading = true;

//     this.postService.getAll(this.page, this.pageSize, this.search, this.selectedCategoryId).subscribe({
//       next: (res: any) => {
//         this.posts = (res.items || res).map((p: Post) => ({
//           ...p,
//           totalLiked: p.totalLiked ?? 0,
//           likedByUser: false
//         }));

//         this.total = res.total ?? this.posts.length;

//         this.posts.forEach(p => {
//           this.likeService.getLikesByPost(p.postId).subscribe(likes => {
//             p.totalLiked = likes.length;
//             p.likedByUser = likes.some(like => like.userId === this.currentUserId);
//           });
//         });

//         this.loading = false;
//       },
//       error: () => { this.loading = false; }
//     });
//   }

//   loadCategories() {  // أضف ده لو مش موجود
//     this.categoryService.getAll().subscribe({
//       next: (cats) => (this.categories = cats),
//       error: () => (this.categories = [])
//     });
//   }

//   loadSkills() {  // أضف ده لو مش موجود
//     this.skillService.getAll().subscribe({
//       next: (res) => (this.skills = res),
//       error: () => (this.skills = [])
//     });
//   }

//   onSearch() {
//     this.page = 1;
//     this.loadPosts();
//   }

//   toggleLike(p: PostWithState) {
//     if (!this.currentUserId) {
//       alert('You must be logged in to like posts!');
//       return;
//     }

//     if (p.likedByUser) {
//       this.likeService.unlike(p.postId, this.currentUserId).subscribe(() => {
//         p.likedByUser = false;
//         p.totalLiked = (p.totalLiked ?? 1) - 1;
//       });
//     } else {
//       this.likeService.like(p.postId, this.currentUserId).subscribe(() => {
//         p.likedByUser = true;
//         p.totalLiked = (p.totalLiked ?? 0) + 1;
//       });
//     }
//   }

//   addComment(p: PostWithState, commentText: string) {
//     if (!this.currentUserId) {
//       alert('You must be logged in to comment!');
//       return;
//     }

//     if (!commentText.trim()) return;

//     const body = { commentText, userId: this.currentUserId, postId: p.postId };
//     this.commentService.create(p.postId, body).subscribe({
//       next: () => {
//         this.commentService.getByPost(p.postId).subscribe(res => { this.comments = res; });
//       },
//       error: () => alert('Add comment failed')
//     });
//   }



//    toggleDropdown(p: PostWithState) {
//     p.dropdownOpen = !p.dropdownOpen;
//   }

//   // دوال جديدة للإديت
//   openEditModal(post: PostWithState) {
//     this.editingPost = post;
//     this.editContent = post.content;
//     this.editCategoryId = post.categoryId ?? null;
//     this.editSkillId = post.skillId ?? null;
//     this.editMedias = post.medias || [];
//     this.isEditModalOpen = true;
//   }

//   closeEditModal() {
//     this.isEditModalOpen = false;
//     this.editingPost = null;
//     this.editContent = '';
//     this.editCategoryId = null;
//     this.editSkillId = null;
//     this.editMedias = [];
//   }

//   saveEdit() {
//     if (!this.editingPost || !this.editContent.trim()) return;

//     const data = {
//       Content: this.editContent.trim(),
//       CategoryId: this.editCategoryId,
//       SkillId: this.editSkillId,
//       Medias: this.editMedias
//     };

//     this.postService.update(this.editingPost.postId, data).subscribe({
//       next: (updatedPost) => {
//         // تحديث محلي
//         // Object.assign(this.editingPost, updatedPost);
//         this.closeEditModal();
//       },
//       error: () => alert('Edit failed')
//     });
//   }


  
// deletePost(p: PostWithState) {
//   if (!this.currentUserId) {
//     alert('You must be logged in!');
//     return;
//   }

//   if (!confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
//     return;
//   }

//   // الخطوة 1: جيب اللايكس وامسحها لو موجودة
//   this.likeService.getLikesByPost(p.postId).subscribe({
//     next: (likes) => {
//       if (likes.length > 0) {
//         // امسح كل اللايكس
//         const deleteLikePromises = likes.map(like => 
//           this.likeService.unlike(p.postId, like.userId).toPromise()  // استخدم unlike عشان تحذف اللايك
//         );
//         Promise.all(deleteLikePromises).then(() => {
//           // بعد ما تمسح اللايكس، امسح الكومنتات
//           this.deleteCommentsThenPost(p);
//         }).catch(() => {
//           alert('Failed to delete likes');
//         });
//       } else {
//         // لو مش فيه لايكس، امسح الكومنتات مباشرة
//         this.deleteCommentsThenPost(p);
//       }
//     },
//     error: () => alert('Failed to check likes')
//   });
// }

// private deleteCommentsThenPost(p: PostWithState) {
//   // الخطوة 2: جيب الكومنتات وامسحها لو موجودة
//   this.commentService.getByPost(p.postId).subscribe({
//     next: (comments) => {
//       if (comments.length > 0) {
//         // امسح كل الكومنتات
//         const deleteCommentPromises = comments.map(comment => 
//           this.commentService.delete(comment.commentId).toPromise()  // افترض إن delete موجودة
//         );
//         Promise.all(deleteCommentPromises).then(() => {
//           // بعد ما تمسح الكومنتات، امسح البوست
//           this.performDelete(p);
//         }).catch(() => {
//           alert('Failed to delete comments');
//         });
//       } else {
//         // لو مش فيه كومنتات، امسح البوست مباشرة
//         this.performDelete(p);
//       }
//     },
//     error: () => alert('Failed to check comments')
//   });
// }

// private performDelete(p: PostWithState) {
//   if (!this.currentUserId) {
//     alert('User not authenticated');
//     return;
//   }

//   this.postService.delete(p.postId, this.currentUserId).subscribe({
//     next: () => {
//       this.posts = this.posts.filter(post => post.postId !== p.postId);
//       alert('Post deleted successfully!');
//     },
//     error: (err) => {
//       console.error('Delete error details:', err);
//       alert('Delete failed. Please try again or contact support.');
//     }
//   });
// }

// // ... باقي الكود زي ما هو



//   prevPage() {
//     if (this.page > 1) {
//       this.page--;
//       this.loadPosts();
//     }
//   }

  
// }











import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Post } from '../../../models/post';
import { PostService } from '../../../services/api/postService';
import { LikeService } from '../../../services/api/likeService';
import { CommentService } from '../../../services/api/commentService';
import { Subscription } from 'rxjs';
import { Comment } from '../../../models/comment';
import { AuthService } from '../../../services/api/authService';
import { CategoryService } from '../../../services/api/categoryService';  // أضف ده لو مش موجود
import { SkillService } from '../../../services/api/skillUserService';  // أضف ده لو مش موجود
import { Category } from '../../../models/category';  // أضف ده لو مش موجود
import { Skill } from '../../../models/skillStart'; 



interface PostWithState extends Post {
  likedByUser?: boolean;
  totalLiked?: number;
  skillId?: number;  // أضفنا ده عشان نقدر نستخدمه في الإديت
  dropdownOpen?: boolean;
}

@Component({
  selector: 'app-posts-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule ],
  templateUrl: './posts-list.html'
})
export class PostsListComponent implements OnInit, OnChanges {
  @Input() selectedCategoryId: number | null = null;
  posts: PostWithState[] = [];
  loading = false;
  search = '';
  page = 1;
  pageSize = 10;
  total = 0;
  private subs = new Subscription();

  currentUserId: number | null = null;
  comments: Comment[] = [];

  // متغيرات جديدة للإديت
  isEditModalOpen = false;
  editingPost: PostWithState | null = null;
  editContent = '';
  editCategoryId: number | null = null;
  editSkillId: number | null = null;
  editMedias: { mediaUrl: string; entityType: string; fileName?: string }[] = []; // عدلنا ده عشان يدعم رفع الملفات
  categories: Category[] = [];  
  skills: Skill[] = [];  
environment: any;

  constructor(
    private postService: PostService,
    private likeService: LikeService,
    private commentService: CommentService,
    private authService: AuthService,
    private categoryService: CategoryService,  
    private skillService: SkillService  
  ) {}

  ngOnInit(): void {
    this.currentUserId = this.authService.getCurrentUserId();
    this.loadPosts();
    this.loadCategories();  // أضف ده لو مش موجود
    this.loadSkills();  // أضف ده لو مش موجود
    const s = this.postService.postsUpdated$.subscribe(post => {
      this.posts = [post, ...this.posts];
    });
    this.subs.add(s);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedCategoryId']) {
      this.page = 1;
      this.loadPosts();
    }
  }

  loadPosts() {
    this.loading = true;

    this.postService.getAll(this.page, this.pageSize, this.search, this.selectedCategoryId).subscribe({
      next: (res: any) => {
        this.posts = (res.items || res).map((p: Post) => ({
          ...p,
          totalLiked: p.totalLiked ?? 0,
          likedByUser: false
        }));

        this.total = res.total ?? this.posts.length;

        this.posts.forEach(p => {
          this.likeService.getLikesByPost(p.postId).subscribe(likes => {
            p.totalLiked = likes.length;
            p.likedByUser = likes.some(like => like.userId === this.currentUserId);
          });
        });

        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  loadCategories() {  // أضف ده لو مش موجود
    this.categoryService.getAll().subscribe({
      next: (cats) => (this.categories = cats),
      error: () => (this.categories = [])
    });
  }

  loadSkills() {  // أضف ده لو مش موجود
    this.skillService.getAll().subscribe({
      next: (res) => (this.skills = res),
      error: () => (this.skills = [])
    });
  }

  onSearch() {
    this.page = 1;
    this.loadPosts();
  }

  toggleLike(p: PostWithState) {
    if (!this.currentUserId) {
      alert('You must be logged in to like posts!');
      return;
    }

    if (p.likedByUser) {
      this.likeService.unlike(p.postId, this.currentUserId).subscribe(() => {
        p.likedByUser = false;
        p.totalLiked = (p.totalLiked ?? 1) - 1;
      });
    } else {
      this.likeService.like(p.postId, this.currentUserId).subscribe(() => {
        p.likedByUser = true;
        p.totalLiked = (p.totalLiked ?? 0) + 1;
      });
    }
  }

  addComment(p: PostWithState, commentText: string) {
    if (!this.currentUserId) {
      alert('You must be logged in to comment!');
      return;
    }

    if (!commentText.trim()) return;

    const body = { commentText, userId: this.currentUserId, postId: p.postId };
    this.commentService.create(p.postId, body).subscribe({
      next: () => {
        this.commentService.getByPost(p.postId).subscribe(res => { this.comments = res; });
      },
      error: () => alert('Add comment failed')
    });
  }

  toggleDropdown(p: PostWithState) {
    p.dropdownOpen = !p.dropdownOpen;
  }

  // دالة جديدة لمعالجة رفع الملفات في الإديت
  onEditFileChange(event: any) {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    if (this.editMedias.length + files.length > 5) {
      alert('You can upload a maximum of 5 files.');
      return;
    }

    for (let file of files) {
      if (file.size > 10 * 1024 * 1024) { // 10MB
        alert(`File "${file.name}" is too large. Maximum size is 10MB.`);
        continue;
      }

      const reader = new FileReader();
      reader.onload = () => {
        this.editMedias.push({
          mediaUrl: reader.result as string, // base64
          entityType: file.type,
          fileName: file.name
        });
      };
      reader.readAsDataURL(file);
    }
  }

  // دالة لحذف ملف من الإديت
  removeEditMedia(index: number) {
    this.editMedias.splice(index, 1);
  }

  // دوال جديدة للإديت
  openEditModal(post: PostWithState) {
    this.editingPost = post;
    this.editContent = post.content;
    this.editCategoryId = post.categoryId ?? null;
    this.editSkillId = post.skillId ?? null;
    // تحميل الميديا الحالية كـ base64 افتراضي (لو عايز تحميل حقيقي، عدل API)
    this.editMedias = (post.medias || []).map(m => ({
      mediaUrl: m.mediaUrl, // افترض إن API يرجع base64
      entityType: m.entityType,
      fileName: 'Existing File' // افتراضي، لو عايز اسم حقيقي، غيره من API
    }));
    this.isEditModalOpen = true;
  }

  closeEditModal() {
    this.isEditModalOpen = false;
    this.editingPost = null;
    this.editContent = '';
    this.editCategoryId = null;
    this.editSkillId = null;
    this.editMedias = []; // إعادة تعيين
  }

  saveEdit() {
    if (!this.editingPost || !this.editContent.trim()) return;

    const data = {
      Content: this.editContent.trim(),
      CategoryId: this.editCategoryId,
      SkillId: this.editSkillId,
      Medias: this.editMedias.map(m => ({ mediaUrl: m.mediaUrl, entityType: m.entityType })) // إرسال الميديا المحدثة
    };

    this.postService.update(this.editingPost.postId, data).subscribe({
      next: (updatedPost) => {
        // تحديث محلي
        Object.assign(this.editingPost!, updatedPost);
        this.closeEditModal();
        alert('Post updated successfully!');
      },
      error: (err) => {
        console.error(err);
        alert('Edit failed. Please try again.');
      }
    });
  }

  deletePost(p: PostWithState) {
    if (!this.currentUserId) {
      alert('You must be logged in!');
      return;
    }

    if (!confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      return;
    }

    // الخطوة 1: جيب اللايكس وامسحها لو موجودة
    this.likeService.getLikesByPost(p.postId).subscribe({
      next: (likes) => {
        if (likes.length > 0) {
          // امسح كل اللايكس
          const deleteLikePromises = likes.map(like => 
            this.likeService.unlike(p.postId, like.userId).toPromise()  // استخدم unlike عشان تحذف اللايك
          );
          Promise.all(deleteLikePromises).then(() => {
            // بعد ما تمسح اللايكس، امسح الكومنتات
            this.deleteCommentsThenPost(p);
          }).catch(() => {
            alert('Failed to delete likes');
          });
        } else {
          // لو مش فيه لايكس، امسح الكومنتات مباشرة
          this.deleteCommentsThenPost(p);
        }
      },
      error: () => alert('Failed to check likes')
    });
  }

  private deleteCommentsThenPost(p: PostWithState) {
    // الخطوة 2: جيب الكومنتات وامسحها لو موجودة
    this.commentService.getByPost(p.postId).subscribe({
      next: (comments) => {
        if (comments.length > 0) {
          // امسح كل الكومنتات
          const deleteCommentPromises = comments.map(comment => 
            this.commentService.delete(comment.commentId).toPromise()  // افترض إن delete موجودة
          );
          Promise.all(deleteCommentPromises).then(() => {
            // بعد ما تمسح الكومنتات، امسح البوست
            this.performDelete(p);
          }).catch(() => {
            alert('Failed to delete comments');
          });
        } else {
          // لو مش فيه كومنتات، امسح البوست مباشرة
          this.performDelete(p);
        }
      },
      error: () => alert('Failed to check comments')
    });
  }

  private performDelete(p: PostWithState) {
    if (!this.currentUserId) {
      alert('User not authenticated');
      return;
    }

    this.postService.delete(p.postId, this.currentUserId).subscribe({
      next: () => {
        this.posts = this.posts.filter(post => post.postId !== p.postId);
        alert('Post deleted successfully!');
      },
      error: (err) => {
        console.error('Delete error details:', err);
        alert('Delete failed. Please try again or contact support.');
      }
    });
  }

  prevPage() {
    if (this.page > 1) {
      this.page--;
      this.loadPosts();
    }
  }
}


