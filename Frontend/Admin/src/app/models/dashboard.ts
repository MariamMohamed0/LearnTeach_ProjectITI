// src/app/models/user.model.ts
export interface UserProfile {
  userId: number;
  fname: string;
  lname: string;
  profilePic?: string;
}

// src/app/models/post.model.ts
export interface PostDto {
  postId: number;
  content?: string;
  createdAt?: string;
}

// src/app/models/comment.model.ts
export interface CommentDto {
  commentId: number;
}

// src/app/models/like.model.ts
export interface LikeDto {
  likeId: number;
}

// src/app/models/skill.model.ts
export interface SkillDto {
  skillId: number;
  name?: string;
}

// src/app/models/session.model.ts
export interface SessionDto {
  sessionId: number;
}

// src/app/models/category.model.ts
export interface CategoryDto {
  categoryId: number;
  name?: string;
}

// src/app/models/package.model.ts
export interface PackageDto {
  packageId: number;
  name?: string;
}

// src/app/models/user-session-feedback.model.ts
export interface UserSessionFeedback {
  feedbackId: number;
  ratingValue: number;
  comment: string;
  ratedByUserId: number;
  ratedToUserId: number;
  sessionId: number;
  createdAt?: string; // optional because it can be null
  ratedByUserName?: string; // optional, يمكن نضيف اسم المستخدم إذا الـ API رجعها
  ratedToUserName?: string;
}


