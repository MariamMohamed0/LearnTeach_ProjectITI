export interface CurrentUser {
  userId: number;
  role: 'Teacher' | 'Student';
  fname: string;
  lname: string;
}