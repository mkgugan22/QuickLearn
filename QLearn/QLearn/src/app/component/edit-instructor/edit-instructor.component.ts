import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PrincipalServiceService } from '../../service/principal-service.service';
import { CommonModule } from '@angular/common';
 
@Component({
  selector: 'app-edit-instructor',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './edit-instructor.component.html',
  styleUrls: ['./edit-instructor.component.css']
})
export class EditInstructorComponent implements OnInit {
  instructorForm!: FormGroup;
  id!: string;
  selectedInstructor: any;
 
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private service: PrincipalServiceService,
    private router: Router
  ) {}
roles:any;
  ngOnInit(): void {
 
   this.roles = localStorage.getItem('role');
    console.log('User Role:', this.roles);
 
      this.instructorForm = this.fb.group({
    instructorId: ['', Validators.required],
    name: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    department: ['', Validators.required],
    coursesTaken: ['', Validators.required],
  });
 
    this.id = this.route.snapshot.paramMap.get('id')!;
 
 
 
    this.service.getInstructorById(this.id).subscribe((data) => {
      if (data) {
        this.selectedInstructor = data;
        this.instructorForm.patchValue({
          instructorId: data.instructorId,
          name: data.name,
          email: data.email,
          department: data.department,
          coursesTaken: data.coursesTaken.join(', ')
        });
      }
    });
  }
 
  onSubmit() {
    if (this.instructorForm.valid) {
      const updatedData = {
        ...this.instructorForm.value,
        coursesTaken: this.instructorForm.value.coursesTaken
          .split(',')
          .map((course: string) => course.trim())
      };
 
      this.service.updateInstructor(this.id, updatedData).subscribe(() => {
        alert('Instructor updated successfully!');
        this.router.navigate(['/trainers']);
      });
    }
  }
 
  close() {
    this.router.navigate(['/trainers']);
  }
}