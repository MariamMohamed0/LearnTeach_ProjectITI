export interface Skill {
  skillId: number;
  name: string;
  cateId?: number;
  cate?: { id: number; name?: string };
}


export interface CreateSkillRequest {
  name: string;
  cateId?: number;
}

export interface UpdateSkillRequest {
  name?: string;
  cateId?: number;
}


export function mapSkillFromApi(data: any): Skill {
  return {
    skillId: data.skillId ?? data.SkillId ?? data.id,
    name: data.name ?? data.Name,
    cateId: data.cateId ?? data.CateId,
    cate: data.cate ? { id: data.cate.cateId ?? data.cate.CateId, name: data.cate.name ?? data.cate.Name } : undefined,
  };
}

export function mapSkillListFromApi(data: any[]): Skill[] {
  return data.map(s => mapSkillFromApi(s));
}
