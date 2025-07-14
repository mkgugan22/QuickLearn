export interface Instructor {
  _id: string;
  instructorId: string;
  name: string;
  email: string;
  department: string;
  coursesTaken: string[]; // Array of course codes
}
