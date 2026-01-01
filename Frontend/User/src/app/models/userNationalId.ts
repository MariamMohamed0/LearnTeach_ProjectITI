export interface UserNationalId {
id: number;
userId: number;
frontImageUrl?: string;
backImageUrl?: string;
selfieWithId?: string;
status: 'pending' | 'approved' | 'rejected';
rejectionReason?: string;
submittedAt?: string;
reviewedAt?: string;
createdAt?: string;
updatedAt?: string;
}

export interface CreateUserNationalIdRequest {
frontImageUrl?: string;
backImageUrl?: string;
selfieWithId?: string;
}

export interface UpdateUserNationalIdRequest {
frontImageUrl?: string;
backImageUrl?: string;
selfieWithId?: string;
}

export interface VerifyNationalIdRequest {
approved: boolean;
rejectionReason?: string;
}

export function mapUserNationalIdFromApi(data: any): UserNationalId {
return {
id: data.Id,
userId: data.UserId,
frontImageUrl: data.FrontPic,
backImageUrl: data.BackPic,
selfieWithId: data.SelfieWithId,
status: data.VerificationStatus.toLowerCase() as 'pending' | 'approved' | 'rejected',
rejectionReason: data.RejectionReason,
submittedAt: data.SubmittedAt,
reviewedAt: data.ReviewedAt
};
}
