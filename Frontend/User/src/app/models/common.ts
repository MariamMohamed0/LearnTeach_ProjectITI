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