import { Component } from '@angular/core';
import { PrincipalServiceService } from '../../service/principal-service.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
  import * as AOS from 'aos';
import { NavAdminComponent } from "../nav-admin/nav-admin.component";
import { Student } from '../../model/student.model';
import { HttpClient, HttpClientModule } from '@angular/common/http';
@Component({
  selector: 'app-student-data',
  imports: [CommonModule, FormsModule, NavAdminComponent, ReactiveFormsModule, HttpClientModule],
  templateUrl: './student-data.component.html',
  styleUrl: './student-data.component.css'
})
export class StudentDataComponent {
  totalStudents: any[] = [];
  filterOption: string = 'all';
  studentForm!: FormGroup;
  showForm = false;
  studentData: any[] = [];
  constructor(private service: PrincipalServiceService, private fb: FormBuilder, private http:HttpClient) {
    this.studentForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
/*       studentId: ['', Validators.required], */
      department: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }

roles:any;
  
  ngOnInit() {
      AOS.init();
  this.roles = localStorage.getItem('role');


    this.service.getStudents().subscribe((data: any) => {
      this.totalStudents = data;
    });
  }
  searchTerm: string = '';
filteredStudents() {
  const term = this.searchTerm.toLowerCase();

  return this.totalStudents
    .filter(student => {
      // 1. Dropdown filter (enrolled/all)
      if (this.filterOption === 'enrolled') {
        return student.enrolledCourses?.length > 0;
      }
      return true;
    })
    .filter(student => {
      // 2. Search term filter
      return (
        student.name?.toLowerCase().includes(term) ||
        student.email?.toLowerCase().includes(term) ||
        student.department?.toLowerCase().includes(term) ||
        student.studentId?.toLowerCase().includes(term) ||
        student.enrolledCourses?.some((course: string) => course.toLowerCase().includes(term))
      );
    });
}

onSubmit(): void {
  if (this.studentForm.invalid) {
    this.studentForm.markAllAsTouched();
    return;
  }

 
  const newStudent: Student = this.studentForm.value;

  // Generate student ID like: STU168956282
/*   const timestamp = Date.now();
  newStudent.studentId = 'STU' + timestamp; */
newStudent.studentId = 'STU' + Math.floor(1000 + Math.random() * 9000);

  console.log("register",newStudent);
  this.service.addStudent(newStudent).subscribe({
    next: () => {
      alert('Student added successfully');
      this.studentForm.reset();
      this.showForm = false;
    },
    error: () => {
      alert('Failed to add student');
    }
  });
}
/* Edit data */
editIndex: number | null = null;

editStudent(index: number) {
  this.editIndex = index;
  const student = this.filteredStudents()[index];
  student.coursesTemp = student.enrolledCourses.join(', ');
}

saveStudent(student: any) {
  student.enrolledCourses = student.coursesTemp.split(',').map((c: string) => c.trim());

  this.http.put(`http://localhost:3700/api/students/${student._id}`, student).subscribe(() => {
    alert('Updated!');
    this.editIndex = null;
  });
}

}