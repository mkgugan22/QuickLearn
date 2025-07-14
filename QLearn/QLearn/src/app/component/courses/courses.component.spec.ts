/* import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CoursesComponent } from './courses.component';
import { CourseService } from '../../services/courses.service';
import { StudentService } from '../../services/student.service';
import { of, throwError } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

// Sample mock data
const mockCourses = [
  {
    courseCode: 'CS101',
    courseName: 'Intro to CS',
    department: 'Computer Science',
    noOfSeats: 50,
    modules: []
  },
  {
    courseCode: 'BUS201',
    courseName: 'Marketing',
    department: 'Business',
    noOfSeats: 30,
    modules: []
  }
];

const mockStudent = {
  studentId: 's123',
  name: 'John Doe',
  email: 'john@example.com',
  department: 'Computer Science',
  phone: '1234567890',
  enrolledCourses: ['CS101'],
  progress: []
};

// Mocks
const mockCourseService = {
  getAllCourses: jasmine.createSpy().and.returnValue(of(mockCourses))
};

const mockStudentService = {
  loadStudent: jasmine.createSpy(),
  getCurrentStudent: jasmine.createSpy().and.returnValue(of(mockStudent)),
  enrollCourse: jasmine.createSpy().and.returnValue(of({ enrolledCourses: ['CS101', 'BUS201'] })),
  unenrollCourse: jasmine.createSpy().and.returnValue(of({})),
  updateStudentEnrolledCourses: jasmine.createSpy()
};

describe('CoursesComponent', () => {
  let component: CoursesComponent;
  let fixture: ComponentFixture<CoursesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoursesComponent, RouterTestingModule, FormsModule, CommonModule],
      providers: [
        { provide: CourseService, useValue: mockCourseService },
        { provide: StudentService, useValue: mockStudentService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CoursesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should load courses and apply filters', () => {
    expect(component.courses.length).toBe(2);
    expect(component.filteredCourses.length).toBe(2);
  });

  it('should filter courses based on search term', () => {
    component.searchTerm = 'Marketing';
    component.applyFilters();
    expect(component.filteredCourses.length).toBe(1);
    expect(component.filteredCourses[0].courseCode).toBe('BUS201');
  });

  it('should return true if student is enrolled in a course', () => {
    expect(component.isEnrolled('CS101')).toBeTrue();
  });

  it('should return false if student is not enrolled in a course', () => {
    expect(component.isEnrolled('BUS201')).toBeFalse();
  });

  it('should enroll in a new course after confirmation', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    component.confirmEnroll('BUS201');
    expect(mockStudentService.enrollCourse).toHaveBeenCalledWith('BUS201');
  });

  it('should not enroll if user cancels confirmation', () => {
    spyOn(window, 'confirm').and.returnValue(false);
    component.confirmEnroll('BUS201');
    expect(mockStudentService.enrollCourse).not.toHaveBeenCalled();
  });

  it('should handle enrollment errors gracefully', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    mockStudentService.enrollCourse.and.returnValue(
      throwError(() => ({ error: { error: 'No seats available' } }))
    );
    spyOn(window, 'alert');
    component.confirmEnroll('BUS201');
    expect(window.alert).toHaveBeenCalledWith('🚫 No seats left in this course.');
  });

  it('should unenroll a course after confirmation', () => {
    component.enrolledCourseCodes = ['CS101', 'BUS201'];
    spyOn(window, 'confirm').and.returnValue(true);
    spyOn(window, 'alert');
    component.confirmUnenroll('CS101');
    expect(mockStudentService.unenrollCourse).toHaveBeenCalledWith('CS101');
    expect(mockStudentService.updateStudentEnrolledCourses).toHaveBeenCalledWith(['BUS201']);
  });

  it('should not unenroll if user cancels confirmation', () => {
    spyOn(window, 'confirm').and.returnValue(false);
    component.confirmUnenroll('CS101');
    expect(mockStudentService.unenrollCourse).not.toHaveBeenCalled();
  });
});
 */


import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CoursesComponent } from './courses.component';
import { ToastrModule } from 'ngx-toastr';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('CoursesComponent', () => {
  let component: CoursesComponent;
  let fixture: ComponentFixture<CoursesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CoursesComponent, // because it's standalone
        HttpClientTestingModule,
        ToastrModule.forRoot()
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            // Customize these based on what your component actually uses
            params: of({ id: '123' }), 
            queryParams: of({}),
            snapshot: { data: {} }
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CoursesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
