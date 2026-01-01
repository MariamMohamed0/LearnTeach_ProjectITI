







// import { Component, HostListener, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { RouterModule } from '@angular/router';

// import { Navbar } from '../../shared/navbar/navbar';
// import { PostsListComponent } from '../posts-list/posts-list';

// import { PostService } from '../../../services/api/postService';
// import { CategoryService } from '../../../services/api/categoryService';

// import { Category } from '../../../models/category';
// import { Skill } from '../../../models/skillStart';
// import { SkillService } from '../../../services/api/skillUserService';

// import { Sidestudent } from './../../shared/sidestudent/sidestudent';
// import { UserHeader } from '../../shared/user-header/user-header';// ... باقي الـ imports زي ما هي
// import { AuthService } from '../../../services/api/authService';

// @Component({
//   selector: 'app-student-dashboard',
//   standalone: true,
//   imports: [
//     CommonModule,
//     FormsModule,
//     RouterModule,
//     Navbar,
//     PostsListComponent,  // تأكد إن ده موجود
//     Sidestudent,
//     UserHeader
//   ],
//   templateUrl: './student-dashboard.html',
//   styleUrls: ['./student-dashboard.css']
// })
// export class DashboardComponent implements OnInit {
//   // ... باقي المتغيرات زي ما هي

//   selectedCategory: number | null = null;  // غير من 0 لـ null عشان يبدأ بـ "All"
// isModalOpen = false;

//   createContent = '';
//   createCategoryId: number | null = null;
//   createSkillId: number | null = null;
//   createMedias: any[] = [];

//   categories: Category[] = [];
//   skills: Skill[] = [];
  
//   isSidebarOpen = true;
//   isDarkMode = false;
//   screenWidth: number = window.innerWidth;

//   constructor(
//     private postService: PostService,
//     private categoryService: CategoryService,
//     private skillService: SkillService,
//     private authService: AuthService
//   ) {}

//   // ... constructor زي ما هو

//   ngOnInit() {
//     this.loadCategories();
//     this.loadSkills();
    
//     // استرجاع الفلتر من localStorage عشان يستمر بعد refresh
//     const savedCategory = localStorage.getItem('filterCategoryId');
//     this.selectedCategory = savedCategory ? parseInt(savedCategory, 10) : null;
//   }


//   loadCategories() {
//     this.categoryService.getAll().subscribe({
//       next: (cats) => (this.categories = cats),
//       error: () => (this.categories = [])
//     });
//   }

//   loadSkills() {
//     this.skillService.getAll().subscribe({
//       next: (res) => (this.skills = res),
//       error: () => (this.skills = [])
//     });
//   }

//   // الفلترة: حفظ الكاتيجوري المختار في LocalStorage
//   filterByCategory(categoryId: number | null) {
//     this.selectedCategory = categoryId;
    
//     if (categoryId === null) {
//       localStorage.removeItem('filterCategoryId');
//     } else {
//       localStorage.setItem('filterCategoryId', categoryId.toString());
//     }
//   }

//   // publishPost() {
//   //  const userId = Number(localStorage.getItem("userId")); 

//   //   const userId = 1; 

//   //   if (!this.createContent.trim()) {
//   //     alert('Please write something');
//   //     return;
//   //   }

//   //   const body = {
//   //     Content: this.createContent.trim(),
//   //     SkillId: this.createSkillId ?? 3,   // ← حطيتي SkillId = 3 مؤقت
//   //     CategoryId: this.createCategoryId,
//   //     Medias: this.createMedias,
//   //     userId: userId
//   //   };

//   //   this.postService.create(body).subscribe({
//   //     next: () => {
//   //       this.createContent = '';
//   //       this.createCategoryId = null;
//   //       this.createSkillId = 3;
//   //       this.createMedias = [];
//   //       this.closeModal();
//   //     },
//   //     error: () => alert('Failed to create post')
//   //   });
//   // }

//    publishPost() {
//     const currentUserId = this.authService.getCurrentUserId();  // جيب اليوزر الحالي
//       if (!currentUserId) {
//       alert('You must be logged in to post!');
//       return;
//     }
//     if (!this.createContent.trim()) {
//       alert('Please write something');
//       return;
//     }
//     const body = {
//       Content: this.createContent.trim(),
//       SkillId: this.createSkillId ?? 3,
//       CategoryId: this.createCategoryId,
//       Medias: this.createMedias,
//       userId: currentUserId  // استخدم اليوزر الحالي هنا
//     };
//     this.postService.create(body).subscribe({
//       next: () => {
//         this.createContent = '';
//         this.createCategoryId = null;
//         this.createSkillId = 3;
//         this.createMedias = [];
//         this.closeModal();
//       },
//       error: () => alert('Failed to create post')
//     });
//   }

//   openModal() { this.isModalOpen = true; }
//   closeModal() { this.isModalOpen = false; }

//   toggleSidebar() { this.isSidebarOpen = !this.isSidebarOpen; }
//   toggleDarkMode() {
//     this.isDarkMode = !this.isDarkMode;
//     if (this.isDarkMode) document.body.classList.add('dark');
//     else document.body.classList.remove('dark');
//   }

//   @HostListener('window:resize', ['$event'])
//   onResize(event: any) {
//     this.screenWidth = event.target.innerWidth;
//     if (this.screenWidth >= 1024) this.isSidebarOpen = true;
//   }

//   isMobile(): boolean {
//     return this.screenWidth < 1024;
//   }
// }








import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { Navbar } from '../../shared/navbar/navbar';
import { PostsListComponent } from '../posts-list/posts-list';

import { PostService } from '../../../services/api/postService';
import { CategoryService } from '../../../services/api/categoryService';

import { Category } from '../../../models/category';
import { Skill } from '../../../models/skillStart';
import { SkillService } from '../../../services/api/skillUserService';

import { Sidestudent } from './../../shared/sidestudent/sidestudent';
import { UserHeader } from '../../shared/user-header/user-header';
import { AuthService } from '../../../services/api/authService';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    Navbar,
    PostsListComponent,
    Sidestudent,
    UserHeader
  ],
  templateUrl: './student-dashboard.html',
  styleUrls: ['./student-dashboard.css']
})
export class DashboardComponent implements OnInit {
  selectedCategory: number | null = null;
  isModalOpen = false;

  createContent = '';
  createCategoryId: number | null = null;
  createSkillId: number | null = null;
  createMedias: any[] = [];  // Array of { mediaUrl: string, entityType: string }

  categories: Category[] = [];
  skills: Skill[] = [];
  
  isSidebarOpen = true;
  isDarkMode = false;
  screenWidth: number = window.innerWidth;
    selectedFiles: File[] = [];  // الملفات المختارة


  constructor(
    private postService: PostService,
    private categoryService: CategoryService,
    private skillService: SkillService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadCategories();
    this.loadSkills();
    const savedCategory = localStorage.getItem('filterCategoryId');
    this.selectedCategory = savedCategory ? parseInt(savedCategory, 10) : null;
  }

  loadCategories() {
    this.categoryService.getAll().subscribe({
      next: (cats) => (this.categories = cats),
      error: () => (this.categories = [])
    });
  }

  loadSkills() {
    this.skillService.getAll().subscribe({
      next: (res) => (this.skills = res),
      error: () => (this.skills = [])
    });
  }

  filterByCategory(categoryId: number | null) {
    this.selectedCategory = categoryId;
    if (categoryId === null) {
      localStorage.removeItem('filterCategoryId');
    } else {
      localStorage.setItem('filterCategoryId', categoryId.toString());
    }
  }

  // دالة جديدة لمعالجة رفع الملفات
  onFileSelected(event: any) {
    const files = event.target.files;
    if (files) {
      this.selectedFiles = Array.from(files);
      // فحص بسيط للحجم (مثال: حد أقصى 10MB لكل ملف)
      const maxSize = 10 * 1024 * 1024; // 10MB
      const invalidFiles = this.selectedFiles.filter(file => file.size > maxSize);
      if (invalidFiles.length > 0) {
        alert('Some files are too large (max 10MB per file).');
        this.selectedFiles = this.selectedFiles.filter(file => file.size <= maxSize);
      }
    }
  }

   getTotalFileSize(): string {
    const totalSize = this.selectedFiles.reduce((sum, file) => sum + file.size, 0);
    return (totalSize / (1024 * 1024)).toFixed(2);
  }


  // publishPost() {
  //   const currentUserId = this.authService.getCurrentUserId();
  //   if (!currentUserId) {
  //     alert('You must be logged in to post!');
  //     return;
  //   }
  //   if (!this.createContent.trim()) {
  //     alert('Please write something');
  //     return;
  //   }
  //   const body = {
  //     Content: this.createContent.trim(),
  //     SkillId: this.createSkillId ?? 3,
  //     CategoryId: this.createCategoryId,
  //     Medias: this.createMedias,  // إرسال الميديا
  //     userId: currentUserId
  //   };
  //   this.postService.create(body).subscribe({
  //     next: () => {
  //       this.createContent = '';
  //       this.createCategoryId = null;
  //       this.createSkillId = null;
  //       this.createMedias = [];
  //       this.closeModal();
  //       // إعادة تحميل البوستات لو محتاج (أو استخدم postsUpdated$)
  //     },
  //     error: () => alert('Failed to create post')
  //   });
  // }
publishPost() {
    const currentUserId = this.authService.getCurrentUserId();
    if (!currentUserId) {
      alert('You must be logged in to post!');
      return;
    }
    if (!this.createContent.trim()) {
      alert('Please write something');
      return;
    }
    // إنشاء FormData
    const formData = new FormData();
    formData.append('Content', this.createContent.trim());
    if (this.createSkillId) formData.append('SkillId', this.createSkillId.toString());
    if (this.createCategoryId) formData.append('CategoryId', this.createCategoryId.toString());
    formData.append('UserId', currentUserId.toString());
    // إضافة الملفات
    this.selectedFiles.forEach((file, index) => {
      formData.append(`Medias`, file);  // الـ key ده هيكون array في الـ backend
    });
    this.postService.create(formData).subscribe({
      next: () => {
        this.createContent = '';
        this.createCategoryId = null;
        this.createSkillId = null;
        this.selectedFiles = [];  // مسح الملفات بعد النجاح
        this.closeModal();
        alert('Post created successfully!');
      },
      error: (err) => {
        console.error('Error creating post:', err);
        alert('Failed to create post. Please try again.');
      }
    });
  }




  openModal() { this.isModalOpen = true; }
  closeModal() { this.isModalOpen = false; }

  toggleSidebar() { this.isSidebarOpen = !this.isSidebarOpen; }
  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    if (this.isDarkMode) document.body.classList.add('dark');
    else document.body.classList.remove('dark');
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


