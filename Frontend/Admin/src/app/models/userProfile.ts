/** ===================== User Profiles ===================== */
export interface UserProfile {
  userId: number;
  fname: string;
  lname: string;
  experienceText: string;
  profilePic: string;
  authuserid: string;
}

export interface UpdateUserProfileRequest {
  userId?: number;
  fname?: string;
  lname?: string;
  experienceText?: string;
  profilePic?: string;
  authuserid?: string | null;
}

/** Mapper */
export function mapUserProfileFromApi(data: any): UserProfile {
  return {
    userId: data.userId,
    fname: data.fname ?? '',
    lname: data.lname ?? '',
    experienceText: data.experienceText ?? '',
    profilePic: data.profilePic ?? '',
    authuserid: data.authuserid ?? ''
  };
}

/** ===================== Certificates ===================== */
export interface Certificate {
  cerid: number;
  cername: string;
  instatutionName: string;
  earnedYear: number;
  cerpic?: string;
  userId?: number;
  editing?: boolean;
}




export interface CertificateUpdateRequest {
  cername?: string;
  instatutionName?: string;
  earnedYear?: number;
  cerpic?: string;
}

/** Mapper */
export function mapCertificateFromApi(res: any): Certificate {
  return {
    cerid: res.cerid,
    cername: res.cername,
    instatutionName: res.instatutionName, 
    earnedYear: res.earnedYear,
    cerpic: res.cerpic,
    userId: res.userId ?? res.userid ?? res.UserId ?? null,
    editing: false
  };
}

/** ===================== User & Social ===================== */
export interface UserSummary {
  userId: number;
  fname: string;
  lname: string;
  profilePic?: string;
}

/** ===================== Post ===================== */
export interface PostMedia {
  pmediaId: number;
  mediaUrl: string;
  entityType: string;
}

export interface Post {
  postId: number;
  content: string;
  skillName?: string | null;
  skillId?: number;
  postType?: string;
  createdAt?: string | null;
  totalLiked?: number;
  totalComments?: number;
  categoryId?: number;       
  categoryName?: string;        
  user?: UserSummary;
  medias?: PostMedia[];
      isLikedByMe?: boolean;
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

export function mapPostFromApi(data: any): Post {
  return {
    postId: data.postId ?? data.PostId,
    content: data.content ?? data.Content,
    skillName: data.skillName ?? data.SkillName ?? '',
    skillId: data.skillId ?? data.SkillId ?? null,
    postType: data.postType ?? data.PostType ?? null,
    categoryId: data.categoryId ?? data.CategoryId ?? null,
    categoryName: data.categoryName ?? data.CategoryName ?? '',
    createdAt: data.createdAt ?? data.CreatedAt ?? null,
    totalLiked: data.totalLiked ?? data.TotalLiked ?? 0,
    totalComments: data.totalComments ?? data.TotalComments ?? 0,
    user: data.user
      ? {
          userId: data.user.userId ?? data.UserId ?? 0,
          fname: data.user.fname ?? '',
          lname: data.user.lname ?? '',
          profilePic: data.user.profilePic ?? ''
        }
      : { userId: 0, fname: '', lname: '', profilePic: '' },
    medias: Array.isArray(data.medias ?? data.Medias)
      ? (data.medias ?? data.Medias).map((m: any) => ({
          pmediaId: m.pmediaId ?? m.PmediaId ?? 0,
          mediaUrl: m.mediaUrl ?? m.MediaUrl ?? '',
          entityType: m.entityType ?? m.EntityType ?? ''
        }))
      : []
  };
}

/** ===================== Comment ===================== */
export interface Comment {
  commentId: number;
  commentText: string;
  createdAt: string;
  userId: number;
  userName: string;
  postId: number;
}

export interface CreateCommentRequest {
  commentText: string;
  userId: number;
  postId: number;
}

export interface UpdateCommentRequest {
  commentText: string;
}

export function mapCommentFromApi(data: any): Comment {
  return {
    commentId: data.commentId ?? data.CommentId,
    commentText: data.commentText ?? data.CommentText,
    createdAt: data.createdAt ?? data.CreatedAt,
    userId: data.userId ?? data.UserId,
    userName: data.userName ?? data.UserName,
    postId: data.postId ?? data.PostId
  };
}

export function mapCommentListFromApi(data: any[]): Comment[] {
  return data.map(c => mapCommentFromApi(c));
}

/** ===================== Like ===================== */
export interface Like {
  likeId: number;
  postId: number;
  userId: number;
  userName: string;
  createdAt: string;

}

export interface CreateLikeRequest {
  userId: number;
  postId: number;
}

export interface DeleteLikeRequest {
  userId: number;
  postId: number;
}

export interface LikeCountResponse {
  success: boolean;
  likesCount: number;
}

export function mapLikeFromApi(data: any): Like {
  return {
    likeId: data.LikeId ?? data.likeId,
    postId: data.PostId ?? data.postId,
    userId: data.UserId ?? data.userId,
    userName: data.UserName ?? data.userName ?? '',
    createdAt: data.CreatedAt ?? data.createdAt ?? ''
  };
}

export function mapLikeListFromApi(data: any[]): Like[] {
  return data.map(mapLikeFromApi);
}
export interface Diamond {
  userId: number;
  totalPoints: number;
  lastUpdated: string | null;
}


export interface UserSessionFeedback {
  feedbackId: number;
  ratingValue: number;
  comment: string;
  ratedByUserId: number;
  ratedToUserId: number;
  sessionId: number;
  createdAt?: string;
    ratedByUserName?: string;
  ratedByUser?: {
    userId: number;
    fname: string;
    lname: string;
    profilePic?: string;
  };
  ratedToUser?: {
    userId: number;
    fname: string;
    lname: string;
    profilePic?: string;
  };
    sessionName?: string; 
}
export function mapUserSessionFeedbackFromApi(data: any): UserSessionFeedback {
  return {
    feedbackId: data.feedbackId ?? 0,
    ratingValue: data.ratingValue ?? 0,
    comment: data.comment ?? '',
    ratedByUserId: data.ratedByUserId ?? 0,
    ratedToUserId: data.ratedToUserId ?? 0,
    sessionId: data.sessionId ?? 0,
    createdAt: data.createdAt ?? new Date().toISOString(), // لو مش موجود، حط تاريخ اليوم
    ratedByUserName: data.ratedByUserName ?? 'Unknown',
    sessionName: data.sessionInfo ?? 'N/A',
    ratedByUser: data.ratedByUser ?? undefined,
    ratedToUser: data.ratedToUser ?? undefined
  };
}


