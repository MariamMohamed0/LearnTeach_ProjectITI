export interface Like {
  likeId: number;      // مطابق لـ LikeDto.LikeId
  postId: number;      // مطابق لـ LikeDto.PostId
  userId: number;      // مطابق لـ LikeDto.UserId
  userName: string;    // مطابق لـ LikeDto.UserName
  createdAt: string;   // مطابق لـ LikeDto.CreatedAt
}

// لعملية الـ POST / DELETE ممكن نستخدمهم لطلبات الإدخال
export interface CreateLikeRequest {
  userId: number;
  postId: number;
}

export interface DeleteLikeRequest {
  userId: number;
  postId: number;
}

// للـ GET /likes/count
export interface LikeCountResponse {
  success: boolean;
  likesCount: number;
}

// Mapper من الـ API إلى الـ Like model
export function mapLikeFromApi(data: any): Like {
  return {
    likeId: data.LikeId ?? data.likeId,
    postId: data.PostId ?? data.postId,
    userId: data.UserId ?? data.userId,
    userName: data.UserName ?? data.userName ?? '',
    createdAt: data.CreatedAt ?? data.createdAt ?? ''
  };
}

// Mapper لقائمة Likes
export function mapLikeListFromApi(data: any[]): Like[] {
  return data.map(mapLikeFromApi);
}