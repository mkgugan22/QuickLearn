import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { Student } from '../model/student.model';
import { Notification } from '../model/student.model';
import { Course } from '../model/course.model';
import { jwtDecode } from 'jwt-decode';

@Injectable({ providedIn: 'root' })
export class StudentService {
  private studentSubject = new BehaviorSubject<Student | null>(null);
  private apiUrl = 'http://localhost:3000/api/students';

  constructor(private http: HttpClient) {}

  // 🔹 Decode token and get studentId from sessionStorage
  private getStudentIdFromToken(): string | null {
    const token = sessionStorage.getItem('token');
    if (!token) return null;
    const decoded: any = jwtDecode(token);
    return decoded.username || decoded.name || null;
  }

  // 🔹 Load and cache student data
  loadStudent(): void {
    const studentId = this.getStudentIdFromToken();
    if (!studentId) return;
    this.http.get<Student>(`${this.apiUrl}/${studentId}`)
      .subscribe(student => this.studentSubject.next(student));
  }

  // 🔹 Fetch student (non-cached)
  getStudent(): Observable<Student> {
    const studentId = this.getStudentIdFromToken();
    return this.http.get<Student>(`${this.apiUrl}/${studentId}`);
  }

  // 🔹 Get BehaviorSubject value
  getStudentValue(): Student | null {
    return this.studentSubject.value;
  }

  // 🔹 Enrolled courses
  getEnrolledCourses(): Observable<string[]> {
    const studentId = this.getStudentIdFromToken();
    return this.http.get<string[]>(`${this.apiUrl}/${studentId}/enrolled-courses`);
  }

  // 🔹 Enroll in course
  enrollCourse(courseCode: string): Observable<any> {
    const studentId = this.getStudentIdFromToken();
    return this.http.post(`${this.apiUrl}/${studentId}/enroll/${courseCode}`, {});
  }

  // 🔹 Unenroll
  unenrollCourse(courseCode: string): Observable<any> {
    const studentId = this.getStudentIdFromToken();
    return this.http.delete(`${this.apiUrl}/${studentId}/unenroll/${courseCode}`);
  }

  // 🔹 Update details
  updateStudent(student: Student): Observable<Student> {
    return this.http.put<Student>(`${this.apiUrl}/${student.studentId}`, student);
  }

  // 🔹 Observable stream
  getCurrentStudent(): Observable<Student> {
    return this.studentSubject.asObservable() as Observable<Student>;
  }

  // 🔹 Logout
  logout(): void {
    this.studentSubject.next(null);
  }

  // 🔹 Update enrolled courses (frontend only)
  updateStudentEnrolledCourses(updatedCourseIds: string[]): void {
    const student = this.studentSubject.value;
    if (student) {
      const updatedStudent = { ...student, enrolledCourses: updatedCourseIds };
      this.studentSubject.next(updatedStudent);
    }
  }
  getNotifications(): Observable<Notification[]> {
  const studentId = this.getStudentIdFromToken();
  return this.http
    .get<Notification[]>(`${this.apiUrl}/${studentId}/notifications`);
  }
}
