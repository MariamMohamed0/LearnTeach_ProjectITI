// user model
export interface User {
  userId: number;
  fullName: string;
}

// skill model
export interface Skill {
  skillId: number;
  name: string;
}


export interface Session {
  sessionId: number;
  sessionTitle: string;
  scheduleStartEgypt: string; 
  scheduleEndEgypt: string;   
  status: 'Scheduled' | 'Ongoing' | 'Completed';
  teacher?: User;              
  learner?: User;             
  skill?: Skill;              
  otherUserFullName?: string;  
  skillName?: string;          
  zoomJoinUrl?: string;
}
