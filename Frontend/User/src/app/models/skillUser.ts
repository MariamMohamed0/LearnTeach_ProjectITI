export interface Skill {
  id: number;
  name: string;
  goodAtIt?: number;
  cateId?: number;
  categoryName?: string;
  editing?: boolean; 

   selected?: boolean;

}

export interface SkillView extends Skill {
  selected: boolean;
  rating: number;
}


export interface CreateSkillRequest {
  name: string;
  cateId?: number;
}

export interface UpdateSkillRequest {
  name?: string;
  cateId?: number;
}
export interface CategoryBlock {
  id: number;        
  name: string;
  skills: Skill[];
  collapsed?: boolean;  
}


export function mapSkillFromApi(data: any): Skill {
  return {
    id: data.skillId ?? data.SkillId ?? data.id,
    name: data.name ?? data.Name,
    cateId: data.cateId ?? data.CateId,
    categoryName: data.categoryName ?? data.cate?.name ?? data.cate?.Name ?? 'Uncategorized',
    goodAtIt: data.goodAtIt ?? data.GoodAtIt ?? undefined,
  };
}



export function mapSkillListFromApi(data: any[]): Skill[] {
  return data.map(s => mapSkillFromApi(s));
}