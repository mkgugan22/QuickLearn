export interface Notification {
  message: string;
  date: string; // or Date
  read: boolean;
}
export interface Student {
  progress: any;
  _id?: string;
  name: string;
  email: string;
  studentId: string;
  department: string; 
  enrolledCourses: string[]; 
  notifications: Notification[];
}
