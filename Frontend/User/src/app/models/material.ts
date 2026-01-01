export interface Material {
  id: number;
  name: string;
  description?: string;
  categoryId: number;
  uploaderId: number;
  type?: string;
  url?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateMaterialRequest {
  name: string;
  description?: string;
  categoryId: number;
  uploaderId: number;
  type?: string;
  url?: string;
}

export interface UpdateMaterialRequest {
  name?: string;
  description?: string;
  categoryId?: number;
  uploaderId?: number;
  type?: string;
  url?: string;
}

export function mapMaterialFromApi(data: any): Material {
  return {
    id: data.materialid ?? data.Materialid,
    name: data.title ?? data.Title,
    description: data.description ?? data.Description,
    categoryId: data.cateid ?? data.Cateid,
    uploaderId: data.uploaderid ?? data.Uploaderid,
    url: data.fileUrl ?? data.FileUrl,
    type: data.type,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt
  };
}

export function mapMaterialListFromApi(data: any[]): Material[] {
  return data.map(mapMaterialFromApi);
}
