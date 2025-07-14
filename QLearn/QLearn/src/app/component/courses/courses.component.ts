import { Component, OnInit, HostListener } from '@angular/core';
import { Course } from '../../model/course.model';
import { CourseService } from '../../services/courses.service';
import { Router, RouterModule } from '@angular/router';
import { StudentService } from '../../services/student.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';


@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [FormsModule, RouterModule, CommonModule, NavbarComponent],
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css'],
})
export class CoursesComponent implements OnInit {
  // 📦 Data
  courses: Course[] = [];
  
  filteredCourses: Course[] = [];
  searchTerm: string = '';
  selectedDepartment: string = 'All';
  enrolledCourseCodes: string[] = [];
  departments: string[] = ['All'];

  // 🔄 Infinite Scroll
  page: number = 1;
  limit: number = 6;
  loadingMore: boolean = false;
  allLoaded: boolean = false;
  selectedStatus: string = 'all';

  constructor(
    private courseService: CourseService,
    private studentService: StudentService,
    private router: Router,
    private toastr: ToastrService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    // Load current student data
    this.studentService.loadStudent();

    // Fetch enrolled courses
    this.studentService.getCurrentStudent().subscribe({
      next: (student) => {
        this.enrolledCourseCodes = student?.enrolledCourses || [];
      },
      error: (err) => {
        console.error('Error fetching student:', err);
      },
    });

    // Load initial courses
    this.loadMoreCourses();
  }

  // ✅ Check if student is enrolled in a course
  isEnrolled(courseCode: string): boolean {
    return this.enrolledCourseCodes.includes(courseCode);
  }
  
applyFilters(): void {
  this.filteredCourses = this.courses.filter(course =>
    course.courseName.toLowerCase().includes(this.searchTerm.toLowerCase())
  );
}

confirmUnenroll(courseCode: string): void {
  if (confirm('Are you sure you want to unenroll from this course?')) {
    this.studentService.unenrollCourse(courseCode).subscribe({
      next: () => {
        this.enrolledCourseCodes = this.enrolledCourseCodes.filter(code => code !== courseCode);
        this.studentService.updateStudentEnrolledCourses(this.enrolledCourseCodes);
        alert('❎ Unenrolled successfully');
      },
      error: () => {
        alert('Something went wrong while trying to unenroll.');
      }
    });
  }
}



  // ➕ Confirm and enroll in a course
confirmEnroll(courseCode: string): void {
  if (confirm('Are you sure you want to enroll in this course?')) {
    this.studentService.enrollCourse(courseCode).subscribe({
      next: (response) => {
        this.enrolledCourseCodes = response.enrolledCourses;
        this.studentService.updateStudentEnrolledCourses(this.enrolledCourseCodes);
      },
      error: (error) => {
        this.toastr.error('🚫 No seats left in this course.', 'Enrollment Failed');
      }
    });
  }
}


  // 🔄 Refresh courses and reset pagination
  refreshCourses(): void {
    this.page = 1;
    this.courses = [];
    this.allLoaded = false;
    this.loadMoreCourses();
  }

  search(): void {
    this.refreshCourses();
  }

  loadMoreCourses(): void {
  if (this.loadingMore || this.allLoaded) return;

  this.loadingMore = true;
  const departmentParam = this.selectedDepartment === 'All' ? '' : this.selectedDepartment;

  this.courseService
    .getPaginatedCourses(this.page, this.limit, this.searchTerm, departmentParam, this.selectedStatus)
    .subscribe({
      next: (res) => {
        let newCourses = res.courses || [];

        // 🔻 Filter out already enrolled
        newCourses = newCourses.filter(
          (course: Course) => !this.enrolledCourseCodes.includes(course.courseCode)
        );

        const today = new Date().getTime();

        // 🟢 Open Enrollment
        const openCourses = newCourses.filter((course: Course) => {
          const start = new Date(course.enrollPeriod?.startDate).getTime();
          const end = new Date(course.enrollPeriod?.endDate).getTime();
          return start <= today && today <= end;
        }).sort((a: Course, b: Course) =>
          new Date(a.enrollPeriod.startDate).getTime() - new Date(b.enrollPeriod.startDate).getTime()
        );

        // 🟡 Upcoming Enrollment
        const upcomingCourses = newCourses.filter((course: Course) => {
          const start = new Date(course.enrollPeriod?.startDate).getTime();
          return start > today;
        }).sort((a: Course, b: Course) =>
          new Date(a.enrollPeriod.startDate).getTime() - new Date(b.enrollPeriod.startDate).getTime()
        );

        // 🔴 Closed Enrollment
        const closedCourses = newCourses.filter((course: Course) => {
          const end = new Date(course.enrollPeriod?.endDate).getTime();
          return end < today;
        }).sort((a: Course, b: Course) =>
          new Date(a.enrollPeriod.startDate).getTime() - new Date(b.enrollPeriod.startDate).getTime()
        );

        // 📦 Merge all into one list: open → upcoming → closed
        newCourses = [...openCourses, ...upcomingCourses, ...closedCourses];

        // ❌ Stop if no more to load
        if (newCourses.length === 0 || this.page >= res.totalPages) {
          this.allLoaded = true;
        }

        this.courses = [...this.courses, ...newCourses];

        if (this.page === 1) {
          const deptSet = new Set(this.courses.map(c => c.department));
          this.departments = ['All', ...Array.from(deptSet).sort()];
        }

        this.page++;
        this.loadingMore = false;
      },
      error: (err) => {
        console.error('Error loading courses:', err);
        this.loadingMore = false;
      },
    });
}




  // 🧭 Infinite scroll trigger
  @HostListener('window:scroll', [])
  onScroll(): void {
    const scrollTop =
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop ||
      0;

    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;

    if (scrollTop + clientHeight >= scrollHeight - 100) {
      this.loadMoreCourses();
    }
  }

  isEnrollmentOpen(course: Course): boolean {
  const today = new Date();
  const start = new Date(course.enrollPeriod.startDate);
  const end = new Date(course.enrollPeriod.endDate);
  return today >= start && today <= end;
}


  // 🔍 Navigate to course detail page
  viewCourse(courseCode: string): void {
    this.router.navigate(['/courses', courseCode]);
  }
}
