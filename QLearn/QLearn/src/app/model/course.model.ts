import { CourseModule } from './module.model';

export interface EnrollPeriod {
  startDate: string;
  endDate: string;
}

export interface Course {
  code: any;
  _id?: string;
  courseName: string;
  courseDescription: string;
  courseCode: string;
  department: string;
  numberOfSeats: number;
  enrollPeriod: EnrollPeriod;
  modules: CourseModule[];
  instructorId: string;
}
