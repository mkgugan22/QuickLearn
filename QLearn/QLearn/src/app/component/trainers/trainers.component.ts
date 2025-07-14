import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
  import * as AOS from 'aos';
import { PrincipalServiceService } from '../../service/principal-service.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NavbarComponent } from "../navbar/navbar.component";
import { NavAdminComponent } from "../nav-admin/nav-admin.component";
import { Instructor } from '../../model/instructor.model';
// Import Bootstrap types if you want typing support (optional)
declare var bootstrap: any;
@Component({
  selector: 'app-trainers',
  imports: [CommonModule, FormsModule, ReactiveFormsModule,  NavAdminComponent],
  templateUrl: './trainers.component.html',
  styleUrl: './trainers.component.css'
})
export class TrainersComponent {
  selectedInstructor: any;

    instructorForm!: FormGroup;
  id!: string;
  
  constructor(private service:PrincipalServiceService, private route: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router
){
this.instructorForm = this.fb.group({
      /* instructorId: ['', Validators.required], */
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      coursesTaken: ['', Validators.required],
      department: ['', Validators.required],
    });
}

name:any;
email:any;
department:any;
role:any;
education:any;
instructors: any[] = [];
roles: string | null = null;
showForm = false;
ngOnInit() {
  AOS.init();
  this.roles = localStorage.getItem('role');
  console.log('User Role:', this.roles);
  
this.service.getInstructor().subscribe((data:any)=>{
  this.instructors = data;
    console.log(this.instructors);
})

}

/*   selectedInstructor: any = null;

  viewProfile(instructor: any) {
    this.selectedInstructor = instructor;
    const modalElement = document.getElementById('profileModal');
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
  }
 */


searchTerm: string = '';

filteredInstructors() {
  const term = this.searchTerm.toLowerCase();
  return this.instructors.filter(instructor =>
    instructor.name.toLowerCase().includes(term) ||
    instructor.email.toLowerCase().includes(term) ||
    instructor.department.toLowerCase().includes(term) ||
    instructor.instructorId.toLowerCase().includes(term)
  );
}

viewProfile(instructor: any) {
  this.selectedInstructor = instructor;
  const modal = new bootstrap.Modal(document.getElementById('profileModal')!);
  modal.show();
}
  editProfile(instructor: any) {
    this.router.navigate(['/edit-instructor', instructor._id]);
  }
onDelete(instructorId: string) {
  if (confirm('Are you sure you want to delete this instructor?')) {
    this.service.deleteInstructor(instructorId).subscribe(() => {
      alert('Instructor deleted!');
      this.instructors = this.instructors.filter(inst => inst.instructorId !== instructorId);
    });
  }
}
  toggleForm() {
    this.showForm = !this.showForm;
  }
 onSubmit() {
    if (this.instructorForm.valid) {
         const generatedId = 'INS' + Math.floor(1000 + Math.random() * 9000);

 
    const instructor: Instructor = {
      ...this.instructorForm.value,
      instructorId: generatedId
    };
      this.service.addInstructor(instructor).subscribe({
        next: (res) => {
          alert('Instructor added successfully!');
          this.instructorForm.reset();
          this.showForm = false;
        },
        error: () => {
          alert('Failed to add instructor');
        }
      });
    }
  }

}