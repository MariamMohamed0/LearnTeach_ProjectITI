// export interface Post {
// id: number;
// content: string;
// title: string;
// userId: number;
// categoryId?: number;
// createdAt?: string;
// updatedAt?: string;
// likesCount?: number;
// commentsCount?: number;
// }

// export interface CreatePostRequest {
// title: string;
// content: string;
// categoryId?: number;
// }

// export interface UpdatePostRequest {
// title?: string;
// content?: string;
// categoryId?: number;
// }

// export function mapPostFromApi(data: any): Post {
// return {
// id: data.PostId,
// title: data.Title,
// content: data.Content,
// userId: data.UserId,
// categoryId: data.SkillId,
// createdAt: data.CreatedAt,
// likesCount: data.TotalLiked,
// commentsCount: data.TotalComments
// };
// }



// src/app/models/post.model.ts

// export interface Post {
//   postId: number;
//   content: string;
//   skillName?: string | null;
//   createdAt?: string | null;
//   totalLiked?: number;
//   totalComments?: number;
//   medias?: PostMedia[];
// }

// export interface PostMedia {
//   pmediaId: number;
//   mediaUrl: string;
//   entityType: string;
// }

// /** Request / DTO types for creating/updating posts */
// export interface CreatePostRequest {
//   Content: string;
//   SkillId?: number | null;
//   PostType?: string | null;
//   Medias?: Array<{
//     PmediaId?: number;
//     MediaUrl: string;
//     EntityType?: string;
//   }>;
// }

// export interface UpdatePostRequest {
//   Content?: string;
//   SkillId?: number | null;
//   PostType?: string | null;
//   Medias?: Array<{
//     PmediaId?: number;
//     MediaUrl: string;
//     EntityType?: string;
//   }>;
// }

// /** Generic paginated response used by service */
// export interface PaginatedResponse<T> {
//   items: T[];
//   page: number;
//   pageSize: number;
//   total?: number;
// }

// /** mapper from backend DTO shape -> Post model */
// export function mapPostFromApi(data: any): Post {
//   return {
//     postId: data.PostId,
//     content: data.Content,
//     skillName: data.SkillName ?? null,
//     createdAt: data.CreatedAt ?? null,
//     totalLiked: data.TotalLiked ?? 0,
//     totalComments: data.TotalComments ?? 0,
//     medias: Array.isArray(data.Medias)
//       ? data.Medias.map((m: any) => ({
//           pmediaId: m.PmediaId ?? m.PmediaId ?? 0,
//           mediaUrl: m.MediaUrl ?? m.mediaUrl ?? '',
//           entityType: m.EntityType ?? m.entityType ?? ''
//         }))
//       : [],
//   };
// }





export interface Post {
  postId: number;
  content: string;
  skillName?: string | null;
  createdAt?: string | null;
  totalLiked?: number;
  totalComments?: number;
  medias?: PostMedia[];
}

export interface PostMedia {
  pmediaId: number;
  mediaUrl: string;
  entityType: string;
}

/** DTOs / Requests */
export interface CreatePostRequest {
  Content: string;
  SkillId?: number | null;
  PostType?: string | null;
  Medias?: Array<{ PmediaId?: number; MediaUrl: string; EntityType?: string }>;
}

export interface UpdatePostRequest {
  Content?: string;
  SkillId?: number | null;
  PostType?: string | null;
  Medias?: Array<{ PmediaId?: number; MediaUrl: string; EntityType?: string }>;
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
    postId: data.postId ?? data.PostId,       // حسب JSON من الـ backend
    content: data.content ?? data.Content,
    skillName: data.skillName ?? data.SkillName ?? '',
    createdAt: data.createdAt ?? data.CreatedAt ?? null,
    totalLiked: data.totalLiked ?? data.TotalLiked ?? 0,
    totalComments: data.totalComments ?? data.TotalComments ?? 0,
    medias: Array.isArray(data.medias ?? data.Medias)
      ? (data.medias ?? data.Medias).map((m: any) => ({
          pmediaId: m.pmediaId ?? m.PmediaId ?? 0,
          mediaUrl: m.mediaUrl ?? m.MediaUrl ?? '',
          entityType: m.entityType ?? m.EntityType ?? ''
        }))
      : [],
  };
}
