export interface Category {
  id: number;
  name: string;
  createdAt?: string; 
}

export interface CreateCategoryRequest {
  name: string;
}

export interface UpdateCategoryRequest {
  name?: string;
}

export function mapCategoryFromApi(data: any): Category {
  return {
    id: data.cateId ?? data.CateId ?? data.id,
    name: data.name ?? data.Name,
    createdAt: new Date().toISOString(),
  };
}

export function mapCategoryListFromApi(data: any[]): Category[] {
  return data.map(c => mapCategoryFromApi(c));
}
