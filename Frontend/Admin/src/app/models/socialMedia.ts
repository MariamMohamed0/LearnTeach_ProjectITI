export interface SocialMedia {
id: number;
userId: number;
facebookLink?: string;
linkedin?: string;
personalWebsite?: string;
  username?: string; 
createdAt?: string;
updatedAt?: string;
}

export interface CreateSocialMediaRequest {
facebookLink?: string;
linkedin?: string;
personalWebsite?: string;
}

export interface UpdateSocialMediaRequest {
facebookLink?: string;
linkedin?: string;
personalWebsite?: string;
}

export function mapSocialMediaFromApi(data: any): SocialMedia {
  return {
    id: data.accountId,       
    userId: data.userId,
    facebookLink: data.facebookLink,
    linkedin: data.linkedin,
    personalWebsite: data.personalWebsite
  };
}


