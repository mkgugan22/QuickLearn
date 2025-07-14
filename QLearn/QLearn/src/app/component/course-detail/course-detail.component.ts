import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from '../../services/courses.service';
import { CommonModule } from '@angular/common';
import { Course } from '../../model/course.model';
import { NgIf, NgFor } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-course-detail',
  standalone: true,
  imports: [CommonModule, NgIf, NgFor, NavbarComponent],
  templateUrl: './course-detail.component.html',
  styleUrls: ['./course-detail.component.css'],
})
export class CourseDetailComponent implements OnInit {
  courseCode!: string;
  course: Course | null = null;

  constructor(
    private route: ActivatedRoute,
    private courseService: CourseService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // 📥 Get course code from route
    this.courseCode = this.route.snapshot.paramMap.get('id')!;

    // 🔁 Fetch course details by code
    this.courseService.getCourseByCode(this.courseCode).subscribe({
      next: (course) => {
        this.course = course;
      },
      error: (err) => {
        console.error('Error fetching course:', err);
        this.course = null;
      },
    });
  }

  // 🔙 Navigate back to course list
  goToCoursePage(): void {
    this.router.navigate(['/courses']);
  }
}
