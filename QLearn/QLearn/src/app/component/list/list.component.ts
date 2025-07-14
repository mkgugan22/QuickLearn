import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PrincipalServiceService } from '../../service/principal-service.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-list',
  imports:[ReactiveFormsModule,CommonModule],
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  courseId: string = '';
  course: any;
  editForm!: FormGroup;
  isEditing = false;

  constructor(
    private route: ActivatedRoute,
    private service: PrincipalServiceService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.courseId = this.route.snapshot.paramMap.get('id') || '';
    if (this.courseId) {
      this.service.getCourse(this.courseId).subscribe((data: any) => {
        this.course = data;
        this.initForm(data);
      });
    }
  }

  initForm(data: any) {
    this.editForm = this.fb.group({
      title: [data.title, [
        Validators.required,
        Validators.minLength(3),
        Validators.pattern(/^[A-Za-z\s]+$/)
      ]],
      description: [data.description, [
        Validators.required,
        Validators.minLength(10)
      ]],
      department: [data.department, [
        Validators.required,
        Validators.pattern(/^[A-Za-z\s]+$/)
      ]],
      instructor: [data.instructor, [
        Validators.required,
        Validators.pattern(/^[A-Za-z\s]+$/)
      ]],
      material: [data.material || ''],
      category: [data.category || '', [
        Validators.pattern(/^[A-Za-z\s]*$/)
      ]],
      duration: [data.duration, [
        Validators.required,
        Validators.pattern(/^[A-Za-z0-9\s]+$/)
      ]],
      rating: [data.rating, [
        Validators.required,
        Validators.min(0),
        Validators.max(5),
        Validators.pattern(/^\d+(\.\d+)?$/)
      ]],
    });
  }

  get f() {
    return this.editForm.controls;
  }

  enableEdit() {
    this.isEditing = true;
  }

  saveCourse() {
    if (this.editForm.invalid) {
      this.editForm.markAllAsTouched();
      return;
    }
    this.service.updateCourse(this.courseId, this.editForm.value).subscribe(() => {
      alert('Course updated successfully');
      this.isEditing = false;
      this.router.navigate(['/course']);
    }, err => {
      console.error('Error updating course:', err);
    });
  }
}
