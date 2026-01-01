export interface Certificate {
  Cerid?: number;          
  Cername: string;
  InstatutionName: string;
  EarnedYear?: number;
  Cerpic?: string;         
  file?: File;       
       userId?: number;
}

export interface CreateCertificateRequest {
  Cername: string;
  InstatutionName: string;
  EarnedYear?: number;
  Cerpic?: File;
}

export interface UpdateCertificateRequest {
  Cername?: string;
  InstatutionName?: string;
  EarnedYear?: number;
  Cerpic?: File;
}
