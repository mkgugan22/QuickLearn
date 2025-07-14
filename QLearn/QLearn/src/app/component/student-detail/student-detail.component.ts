import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Student } from '../../model/student.model';
import { StudentService } from '../../services/student.service';

@Component({
  selector: 'app-student-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './student-detail.component.html',
  styleUrls: ['./student-detail.component.css']
})
export class StudentDetailComponent implements OnInit {
  student: Student | null = null;           // Holds original student data
  editableStudent: Student | null = null;   // Holds temporary data for editing
  isEditing = false;                        // Toggle edit mode

  constructor(private studentService: StudentService) {}

  // Load student data on component initialization
  ngOnInit(): void {
    this.loadStudentData();
  }

  // Fetch student data from service and subscribe to observable
  loadStudentData(): void {
    this.studentService.loadStudent(); // Optional call to trigger API load
    this.studentService.getCurrentStudent().subscribe({
      next: (data) => {
        this.student = data;
      },
      error: (err) => console.error('Error fetching student:', err)
    });
  }

  // Toggle between edit and view modes
  toggleEdit(): void {
    this.isEditing = !this.isEditing;

    if (this.isEditing && this.student) {
      // Create a shallow copy to allow editing without affecting original data
      this.editableStudent = { ...this.student };
    } else {
      // Cancel edit
      this.editableStudent = null;
    }
  }

  // Check if any data has been modified
  hasChanges(): boolean {
    return !!(
      this.student &&
      this.editableStudent &&
      (this.student.name !== this.editableStudent.name ||
        this.student.department !== this.editableStudent.department)
    );
  }

  // Save edited data back to the server
  saveChanges(): void {
    if (!this.editableStudent || !this.hasChanges()) return;

    this.studentService.updateStudent(this.editableStudent).subscribe({
      next: (updatedStudent) => {
        this.student = updatedStudent;      // Update local student
        this.isEditing = false;             // Exit edit mode
        this.editableStudent = null;        // Clear temporary data
        this.studentService.loadStudent();  // Refresh state if needed
      },
      error: (err) => console.error('Error saving student:', err)
    });
  }
}
