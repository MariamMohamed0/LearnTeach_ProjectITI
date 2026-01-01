export interface Certificate {
  cerid: number;
  userId: number;
  cername: string;
  instatutionName: string;
  earnedYear?: number;
  cerpic?: string;
}


export interface CreateCertificateRequest {
  userId: number;
  cername: string;
  instatutionName: string;
  earnedYear?: number;
  cerpic?: string;
}


export interface UpdateCertificateRequest {
  cername?: string;
  instatutionName?: string;
  earnedYear?: number;
  cerpic?: string;
}

