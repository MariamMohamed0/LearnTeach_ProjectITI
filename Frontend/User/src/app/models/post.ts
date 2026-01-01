
// export interface UserSummary {
//   userId: number;
//   fname: string;
//   lname: string;
//   profilePic?: string;
// }

// export interface PostMedia {
//   pmediaId: number;
//   mediaUrl: string;
//   entityType: string;
// }

// export interface Post {
//   postId: number;
//   content: string;
//   skillName?: string | null;
//   createdAt?: string | null;
//   totalLiked?: number;
//   totalComments?: number;
//   user?: UserSummary;    // ← تم إضافة الـ user كـ object
//   medias?: PostMedia[];
//   categoryId?: number;
//   CategoryName?: string;

// }


// // export interface CreatePostRequest {
// //   Content: string;
// //   SkillId?: number | null;
// //   PostType?: string | null;
// //   Medias?: Array<{ PmediaId?: number; MediaUrl: string; EntityType?: string }>;
// //     userId: number;   

// // }

// export interface CreatePostDto {
//   content: string;
//   categoryId: number;
//   skillId: number;
//   Medias?: Array<{ PmediaId?: number; MediaUrl: string; EntityType?: string }>;
//   userId: number;   // 👈 أضفناه هنا
// }





// export interface UpdatePostRequest {
//   Content?: string;
//   SkillId?: number | null;
//   PostType?: string | null;
//   Medias?: Array<{ PmediaId?: number; MediaUrl: string; EntityType?: string }>;
// }

// / Paginated response */
// export interface PaginatedResponse<T> {
//   items: T[];
//   page: number;
//   pageSize: number;
//   total?: number;
// }

// /** Mapper */
// export function mapPostFromApi(data: any): Post {
//   return {
//     postId: data.postId ?? data.PostId,
//     content: data.content ?? data.Content,
//     skillName: data.skillName ?? data.SkillName ?? '',
//     createdAt: data.createdAt ?? data.CreatedAt ?? null,
//     totalLiked: data.totalLiked ?? data.TotalLiked ?? 0,
//     totalComments: data.totalComments ?? data.TotalComments ?? 0,
//     CategoryName: data.categoryName ?? data.CategoryName ?? '',
//     categoryId: data.categoryId ?? data.CategoryId ?? 0,
//     user: data.user
//       ? {
//           userId: data.user.userId ?? 0,
//           fname: data.user.fname ?? '',
//           lname: data.user.lname ?? '',
//           profilePic: data.user.profilePic ?? ''
//         }
//       : { userId: 0, fname: '', lname: '', profilePic: '' },  // ← إصلاح: fallback كامل للـ user
//     medias: Array.isArray(data.medias ?? data.Medias)
//       ? (data.medias ?? data.Medias).map((m: any) => ({
//           pmediaId: m.pmediaId ?? m.PmediaId ?? 0,
//           mediaUrl: m.mediaUrl ?? m.MediaUrl ?? '',
//           entityType: m.entityType ?? m.EntityType ?? ''
//         }))
//       : []
//   };
// }











export interface UserSummary {
  userId: number;
  fname: string;
  lname: string;
  profilePic?: string;
}

export interface PostMedia {
  pmediaId: number;
  mediaUrl: string;
  entityType: string;
}

export interface Post {
  postId: number;
  content: string;
  skillName?: string | null;
  createdAt?: string | null;
  totalLiked?: number;
  totalComments?: number;
  user?: UserSummary;    // ← تم إضافة الـ user كـ object
  medias?: PostMedia[];
  categoryId?: number;
  CategoryName?: string;
}

// عدلنا CreatePostDto عشان يتطابق مع رفع الملفات (base64 في MediaUrl و EntityType)
export interface CreatePostDto {
  content: string;
  categoryId: number;
  skillId: number;
  Medias?: Array<{ MediaUrl: string; EntityType: string }>;  // عدلنا: MediaUrl كـ base64، EntityType كـ نوع MIME، مش محتاج PmediaId في الإنشاء
  userId: number;
}

// عدلنا UpdatePostRequest عشان يدعم رفع الملفات الجديدة أو الحفاظ على القديمة
export interface UpdatePostRequest {
  Content?: string;
  SkillId?: number | null;
  CategoryId?: number | null;  // أضفنا ده عشان يكون متاح في الإديت
  Medias?: Array<{ MediaUrl: string; EntityType: string }>;  // عدلنا: نفس الشيء، base64 للملفات الجديدة
}

/** Paginated response */
export interface PaginatedResponse<T> {
  items: T[];
  page: number;
  pageSize: number;
  total?: number;
}

/** Mapper */
export function mapPostFromApi(data: any): Post {
  return {
    postId: data.postId ?? data.PostId,
    content: data.content ?? data.Content,
    skillName: data.skillName ?? data.SkillName ?? '',
    createdAt: data.createdAt ?? data.CreatedAt ?? null,
    totalLiked: data.totalLiked ?? data.TotalLiked ?? 0,
    totalComments: data.totalComments ?? data.TotalComments ?? 0,
    CategoryName: data.categoryName ?? data.CategoryName ?? '',
    categoryId: data.categoryId ?? data.CategoryId ?? 0,
    user: data.user
      ? {
          userId: data.user.userId ?? 0,
          fname: data.user.fname ?? '',
          lname: data.user.lname ?? '',
          profilePic: data.user.profilePic ?? ''
        }
      : { userId: 0, fname: '', lname: '', profilePic: '' },  // ← إصلاح: fallback كامل للـ user
    medias: Array.isArray(data.medias ?? data.Medias)
      ? (data.medias ?? data.Medias).map((m: any) => ({
          pmediaId: m.pmediaId ?? m.PmediaId ?? 0,
          mediaUrl: m.mediaUrl ?? m.MediaUrl ?? '',
          entityType: m.entityType ?? m.EntityType ?? ''
        }))
      : []
  };
}
