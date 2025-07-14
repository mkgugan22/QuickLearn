import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { Course } from '../../model/course.model';
import { StudentService } from '../../services/student.service';
import { CourseService } from '../../services/courses.service';
import { NavbarComponent } from '../navbar/navbar.component';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';


@Component({
  selector: 'app-my-learning',
  standalone: true,
  imports: [CommonModule, NavbarComponent, RouterLink, FormsModule],
  templateUrl: './mylearning.component.html',
  styleUrls: ['./mylearning.component.css']
})
export class MyLearningComponent implements OnInit {
  enrolledCourses: Course[] = [];
  filteredCourses: Course[] = [];
  searchTerm: string = '';
  selectedDepartment: string = 'All';
  enrolledCourseCodes: string[] = [];
  departments: string[] = ['All'];

  private studentService = inject(StudentService);
  private courseService = inject(CourseService);
  private router = inject(Router);
  private toastr = inject(ToastrService);
  private modalService = inject(NgbModal);

  ngOnInit(): void {
    this.studentService.getEnrolledCourses().subscribe({
      next: (courseCodes) => {
        if (!courseCodes?.length) return;

        this.enrolledCourseCodes = courseCodes;

        courseCodes.forEach((code) => {
          this.courseService.getCourseByCode(code).subscribe({
            next: (course) => {
              this.enrolledCourses.push(course);
              if (!this.departments.includes(course.department)) {
                this.departments.push(course.department);
              }
              this.filterCourses(); // Update view
            },
            error: (err) =>
              console.error(`❌ Error fetching course (${code}):`, err),
          });
        });
      },
      error: (err) =>
        console.error('❌ Error loading enrolled courses:', err),
    });
  }

  filterCourses(): void {
    const search = this.searchTerm.toLowerCase();

    this.filteredCourses = this.enrolledCourses.filter((course) => {
      const matchesSearch =
        course.courseName.toLowerCase().includes(search) ||
        course.department.toLowerCase().includes(search);
      const matchesDepartment =
        this.selectedDepartment === 'All' ||
        course.department === this.selectedDepartment;

      return matchesSearch && matchesDepartment;
    });
  }

  confirmUnenroll(courseCode: string): void {
    const modalRef = this.modalService.open(ConfirmDialogComponent, {
      centered: true,
      backdrop: 'static',
      keyboard: false,
    });

    modalRef.componentInstance.message =
      'Are you sure you want to unenroll from this course?';

    modalRef.result
      .then((confirmed) => {
        if (!confirmed) return;

        this.studentService.unenrollCourse(courseCode).subscribe({
          next: () => {
            this.enrolledCourses = this.enrolledCourses.filter(
              (course) => course.courseCode !== courseCode
            );
            this.enrolledCourseCodes = this.enrolledCourseCodes.filter(
              (code) => code !== courseCode
            );
            this.studentService.updateStudentEnrolledCourses(this.enrolledCourseCodes);
            this.filterCourses(); // Update filtered view
            this.toastr.warning('✅ Unenrolled successfully!', 'Success');
          },
          error: (err) => {
            console.error('❌ Unenrollment failed:', err);
            this.toastr.error('Something went wrong while unenrolling.', 'Error');
          },
        });
      })
      .catch(() => {});
  }

  goToCourses(): void {
    this.router.navigate(['/courses']);
  }
}

