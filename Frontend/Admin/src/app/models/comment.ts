// export interface Comment {
//   id: number;
//   postId: number;
//   userId: number;
//   content: string;
//   createdAt: string;
//   updatedAt?: string;
//   userName?: string;
// }

// export interface CreateCommentRequest {
//   content: string;
// }

// export interface UpdateCommentRequest {
//   content: string;
// }



// export function mapCommentFromApi(data: any): Comment {
//   return {
//     id: data.commentId ?? data.CommentId,
//     postId: data.postId ?? data.PostId,
//     userId: data.userId ?? data.UserId,
//     content: data.commentText ?? data.CommentText,
//     createdAt: data.createdAt ?? data.CreatedAt,
//     updatedAt: data.updatedAt ?? data.UpdatedAt,
//     userName: data.user?.userName || data.User?.UserName || data.userName
//   };
// }

// export function mapCommentListFromApi(data: any[]): Comment[] {
//   return data.map(c => mapCommentFromApi(c));
// }



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
