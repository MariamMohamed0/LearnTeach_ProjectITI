export interface UserSessionFeedback {
id: number;
rating: number;
comment?: string;
userId?: number;
sessionId?: number;
role?: 'teacher' | 'student';
createdAt?: string;
updatedAt?: string;
}

export interface CreateFeedbackRequest {
sessionId: number;
rating: number;
comment?: string;
role: 'teacher' | 'student';
}

export interface UpdateFeedbackRequest {
rating?: number;
comment?: string;
}

export interface FeedbackStats {
averageRating: number;
totalFeedbacks: number;
ratingBreakdown: {
rating: number;
count: number;
}[];
}

export function mapFeedbackFromApi(data: any): UserSessionFeedback {
return {
id: data.Feedbackid ?? data.FeedbackId ?? data.id,
rating: data.Feedbackrange ?? data.FeedbackRange ?? data.rating,
comment: data.Feedbackdetails ?? data.FeedbackDetails ?? data.comment,
userId: data.UserId ?? data.userId,
sessionId: data.SessionId ?? data.sessionId,
role: data.Role ?? data.role,
createdAt: data.CreatedAt ?? new Date().toISOString(),
updatedAt: data.UpdatedAt ?? new Date().toISOString()
};
}

export function mapFeedbackListFromApi(data: any[]): UserSessionFeedback[] {
return data.map(f => mapFeedbackFromApi(f));
}
