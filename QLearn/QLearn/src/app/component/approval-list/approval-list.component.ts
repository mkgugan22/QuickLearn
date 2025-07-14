import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { PrincipalServiceService } from '../../service/principal-service.service';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { NavAdminComponent } from "../nav-admin/nav-admin.component";

@Component({
  selector: 'app-approval-list',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, NavAdminComponent],
  templateUrl: './approval-list.component.html',
  styleUrls: ['./approval-list.component.css']
})
export class ApprovalListComponent implements OnInit {
  courseForm!: FormGroup;
  materialFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private service: PrincipalServiceService,
    private dialog: MatDialog
  ) {}

  roles:any;
  ngOnInit(): void {

     this.roles = localStorage.getItem('role');
  console.log('User Role:', this.roles);
  

    this.courseForm = this.fb.group({
      title: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.pattern(/^[A-Za-z\s]+$/)
      ]],
      description: ['', [
        Validators.required,
        Validators.minLength(10)
      ]],
      department: ['', [
        Validators.required,
        Validators.pattern(/^[A-Za-z\s]+$/)
      ]],
      instructor: ['', [
        Validators.required,
        Validators.pattern(/^[A-Za-z\s]+$/)
      ]],
      material: [''],
      category: ['', [
        Validators.pattern(/^[A-Za-z\s]+$/)
      ]],
      duration: ['', [
        Validators.required,
        Validators.pattern(/^[A-Za-z0-9\s]+$/)
      ]],
      rating: ['', [
        Validators.required,
        Validators.min(0),
        Validators.max(5),
        Validators.pattern(/^\d+(\.\d+)?$/)
      ]],
      modules: this.fb.array([
        this.fb.control('', Validators.required)
      ])
    });
  }

  get f() {
    return this.courseForm.controls;
  }

  get modules() {
    return this.courseForm.get('modules') as FormArray;
  }

  addModule() {
    this.modules.push(this.fb.control('', Validators.required));
  }

  removeModule(index: number) {
    if (this.modules.length > 1) {
      this.modules.removeAt(index);
    }
  }

  // onMaterialSelected(event: any) {
  //   const file: File = event.target.files[0];
  //   if (file) {
  //     this.materialFile = file;
  //     console.log('Selected material file:', file.name);
  //   }
  // }

  onSubmit() {
    if (this.courseForm.invalid) {
      this.courseForm.markAllAsTouched();
      return;
    }

    this.service.addCourse(this.courseForm.value).subscribe(() => {
      alert('Course added successfully');
      this.courseForm.reset();
      this.modules.clear();
      this.modules.push(this.fb.control('', Validators.required));
    }, err => {
      console.error('Error adding course:', err);
    });
  }

  close() {
    this.dialog.closeAll();
  }
}