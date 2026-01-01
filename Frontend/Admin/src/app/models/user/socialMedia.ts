export interface SocialMedia {
  accountId: number; 
userId?: number;

facebookLink?: string;
linkedin?: string;
personalWebsite?: string;
  username?: string; 
createdAt?: string;
updatedAt?: string;
}


export interface CreateSocialMediaRequest {
  userId: number;         
  facebookLink?: string;
  linkedin?: string;
  personalWebsite?: string;
}


export interface UpdateSocialMediaRequest {
  accountId?: number;
facebookLink?: string;
linkedin?: string;
personalWebsite?: string;
}
export function mapSocialMediaFromApi(data: any): SocialMedia {
  return {
     accountId: data.accountId ?? data.id, 
    userId: data?.userId ?? null,
    facebookLink: data?.facebookLink ?? null,
    linkedin: data?.linkedin ?? null,
    personalWebsite: data?.personalWebsite ?? null
  };
}







