import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Instructor } from '../model/instructor.model';
import { Student } from '../model/student.model';

@Injectable({
  providedIn: 'root'
})
export class PrincipalServiceService {

  constructor(private http:HttpClient) { }

/*   ApiUrl = 'http://localhost:3700/api/dashboard/metrics'; */
ApiUrl = 'https://backend-0x10.onrender.com/api/dashboard/metrics'; 

loginUrl = 'http://localhost:3700/api/login';  /* https://backend-0x10.onrender.com/ */

loginGetUrl = 'http://localhost:3700/api/users';   /* http://localhost:3700/api/users */
insUrl = 'http://localhost:3700/api/instructors';
 private baseUrl = 'http://localhost:3700/api/courses';
  private studentUrl = 'http://localhost:3700/api/students'
  private instructorUrl = 'http://localhost:3700/api/instructors';
  private StuAddUrl = 'http://localhost:3700/api/students';

  getAll(){
    return this.http.get(this.ApiUrl);
  }
   
  login(data:any){
    return this.http.post(this.loginUrl, data);
  }
  getLoginData(){
    return this.http.get(this.loginGetUrl);
  }
  getInstructor(){
    return this.http.get(this.insUrl)
  }
  /* all course */
    getCourses() {
    return this.http.get<any[]>(this.baseUrl);
  }

  getCourse(id: string) {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }

  addCourse(data: any) {
    return this.http.post(this.baseUrl, data);
  }

  updateCourse(id: string, data: any) {
    return this.http.put(`${this.baseUrl}/${id}`, data);
  }

  deleteCourse(courseCode: string) {
    return this.http.delete(`${this.baseUrl}/code/${courseCode}`);
  }
  /* student details */
  getStudents(){
    return this.http.get(this.studentUrl);
  }
  getInstructorById(id: string): Observable<any> {
  return this.http.get(`http://localhost:3700/api/instructors/${id}`);
}
  /* instructor */
 // instructor.service.ts
updateInstructor(id: string, data: any): Observable<any> {
  return this.http.put(`http://localhost:3700/api/instructors/${id}`, data);
}

deleteInstructor(id: string): Observable<any> {
  return this.http.delete(`http://localhost:3700/api/instructors/${id}`);
}

createInstructor(instructor: any) {
  return this.http.post('/api/instructors', instructor);
}
addInstructor(instructor: Instructor): Observable<any> {
  return this.http.post(this.instructorUrl, instructor);
}
addStudent(studentData: Student): Observable<any> {
  return this.http.post(this.StuAddUrl, studentData);
}

/* course */
getHighDurationCourses() {
  return this.http.get<any>(`${this.baseUrl}/course/HighDurationCourses`);
}
 
getMaximumSeatsAvailableCourses() {
  return this.http.get<any>(`${this.baseUrl}/course/MaximumSeatsAvailable`);
}
 
getMinimumSeatsAvailableCourses() {
  return this.http.get<any>(`${this.baseUrl}/course/MinimumSeatsAvailable`);
}
 
getCoursesWithLargeModules() {
  return this.http.get<any>(`${this.baseUrl}/course/LargeModules`);
}
 
getCourseEnrollPeriod(id: string) {
  return this.http.get<any>(`${this.baseUrl}/course/enrollDate/${id}`);
}
/** Get supported languages for audio generation */
  getSupportedLanguages() {
    return this.http.get(`${this.baseUrl}/supported-languages`);
  }

  /** Upload a PDF material with multi-language audio support */
  uploadCourseMaterial(courseId: string, file: File, languages: string[] = ['en-US']) {
    const fd = new FormData();
    fd.append('pdf', file);
    fd.append('languages', JSON.stringify(languages));
    return this.http.post(`${this.baseUrl}/${courseId}/material`, fd);
  }

  /** Delete a specific material from a course */
  deleteCourseMaterial(courseId: string, materialIndex: number) {
    return this.http.delete(`${this.baseUrl}/${courseId}/material/${materialIndex}`);
  }

  /** Get details of a specific material */
  getMaterialDetails(courseId: string, materialIndex: number) {
    return this.http.get(`${this.baseUrl}/${courseId}/material/${materialIndex}`);
  }

}