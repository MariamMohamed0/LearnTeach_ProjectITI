export interface Project {
  projectId: number;
  userId: number;
  projectName: string;
  projectDesc: string;
  repolink: string;
  username?: string; 
  editing?: boolean; 
}

export interface CreateProjectRequest {
  userId: number;
  projectName: string;
  projectDesc: string;
  repolink: string;
}

export interface UpdateProjectRequest {
  projectName?: string;
  projectDesc?: string;
  repolink?: string;
}

export function mapProjectFromApi(data: any): Project {
  return {
    projectId: data.projectId,
    userId: data.userId,
    projectName: data.projectName,
    projectDesc: data.projectDesc,
    repolink: data.repolink,
  };
}

export function mapProjectListFromApi(data: any[]): Project[] {
  return data.map(mapProjectFromApi);
}

