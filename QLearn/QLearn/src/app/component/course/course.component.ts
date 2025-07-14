import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';

// External Toast Notification Library
import Toastify from 'toastify-js';

// Service and Dialog Component
import { PrincipalServiceService } from '../../service/principal-service.service';
import { DialogComponent } from '../dialog/dialog.component';
import {MaterialUploadComponent} from '../material-upload/material-upload.component'
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { NavAdminComponent } from "../nav-admin/nav-admin.component";
import { MatMenuModule } from '@angular/material/menu';
import * as Highcharts from 'highcharts';
import {CourseChartsComponent} from '../course-charts/course-charts.component';

import { MatDividerModule } from '@angular/material/divider';

// Course Interface Definition
interface Course {
  _id?: string;
  courseName: string;
  courseCode: string;
  courseDescription: string;
  department: string;
  instructorId: string;
  numberOfSeats: number;
  totalSeats: number;
  modules: { title: string; description: string }[];
  enrollStart: Date | null;
  enrollEnd: Date | null;
   pdfMaterials?: {           // ⬅  make it optional
    originalName: string;
    pdfPath:   string;
    audioName: string;
    audioPath: string;
  }[];
  _new?: boolean;
  _editing?: boolean;
}



@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css'],
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    MatFormFieldModule, MatInputModule, MatSortModule,
    MatDatepickerModule, MatNativeDateModule, MatIconModule,
    MatButtonModule, MatTableModule, MatSortModule,
    MatPaginatorModule, MatDialogModule, MatProgressBarModule, MatCardModule, MatSelectModule,
    NavAdminComponent, MatMenuModule, MatDividerModule,CourseChartsComponent
  ],
})
export class CourseComponent implements OnInit {


  readonly DEFAULT_TOTAL_SEATS = 70;

  minDate: Date = new Date(); // Sets today as the minimum selectable date

  roles: string = 'Admin';

  // Column configuration for Material Table
  displayedColumns = [
    'courseName', 'courseCode', 'department', 'instructorId',
    'totalSeats', 'numberOfSeats', 'enrollStart', 'enrollEnd',
    'enrollmentProgress', 'materials','actions',
  ] as const;
chartLibraries: ('highcharts' | 'echarts' | 'chartjs')[] = ['highcharts', 'echarts', 'chartjs'];

  chartBlocks: {
  title: string;
  method: { categories: string[]; values: number[] };
  type: 'bar' | 'pie' | 'line';
}[] = [];

showCharts = false;


toggleCharts(): void {
  this.showCharts = !this.showCharts;
  if (this.showCharts) {
    setTimeout(() => {
      document.getElementById('chartSection')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }
}



  seatOptions = Array.from({ length: 10 }, (_, i) => (i + 1) * 10);
  departments: string[] = [
    'Computer Science', 'Information Technology', 'Electronics',
    'Mechanical', 'Civil', 'Electrical', 'Biotechnology', 'AIDS',
  ];

  newDeptInputVisible = false;
  newDeptName = '';


confirmNewDept(row: any): void {
  const newDept = this.newDeptName.trim();
  if (newDept && !this.departments.includes(newDept)) {
    this.departments.push(newDept);
    row.department = newDept; // auto-select it
    this.showToast(`Department "${newDept}" added!`, { label: "Department" });
  } else {
    this.showToast('Invalid or duplicate department.', { label: "Department" }, false);
  }

  this.newDeptInputVisible = false;  // hide input after adding
  this.newDeptName = '';             // reset input
}

  dataSource = new MatTableDataSource<Course>([]);
  filterValue = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  instructors: Array<{ instructorId: string; name: string }> = [];
  top5Courses: Course[] = [];
  data: any;

  constructor(
    private svc: PrincipalServiceService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
  ) { }
  // Lifecycle hook to load data on component initialization
  ngOnInit(): void {
    this.loadInitialData();
  }




  // Loads both course data and instructor list from backend
  private loadInitialData(): void {
    this.loadCourses();
    this.svc.getInstructor().subscribe((data: any) => this.instructors = data as Array<{ instructorId: string; name: string }>);
  }
  // Utility method to display success/error toast messages
  private showToast(message: string, p0: { label: "Course Name" | "Course Code" | "Department" | "Instructor"; }, success = true): void {
    Toastify({
      text: message,
      duration: 6000,
      close: false,
      gravity: 'top',
      offset: { x: 0, y: 100 },
      position: 'center',
      style: {
        background: success
          ? 'linear-gradient(to right, #00b09b, #96c93d)'
          : 'linear-gradient(to right, #e52d27, #b31217)',
        color: '#fff',
        borderRadius: '8px',
        padding: '12px 20px',
        fontSize: '15px',
        fontFamily: 'Segoe UI, Roboto, sans-serif',
        boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
      },
      stopOnFocus: true,
    }).showToast();
  }
  // Returns the number of students enrolled in a given course
  private calculateEnrolled(row: Course): number {
    return row.totalSeats - row.numberOfSeats;
  }
  // Computes total students enrolled across all filtered courses
  getTotalEnrolled(): number {
    return this.dataSource.filteredData.reduce((sum, row) => {
      const enrolled = (row.totalSeats || 0) - (row.numberOfSeats || 0);
      return sum + enrolled;
    }, 0);
  }
  // Calculates average fill percentage for display in stats
  calculateAverageFillRate(): number {
    const totalCourses = this.dataSource.filteredData.length;
    const totalEnrolled = this.getTotalEnrolled();
    const totalSeats = this.dataSource.filteredData.reduce((sum, row) => sum + (row.totalSeats || 0), 0);
    return totalSeats === 0 ? 0 : Math.round((totalEnrolled / totalSeats) * 100);
  }
  // Added this method to support stats dialogs or dashboard cards
  getAverageFillRate(): number {
    if (!this.dataSource?.data || this.dataSource.data.length === 0) {
      return 0;
    }

    let totalSeats = 0;
    let totalFilled = 0;

    for (let course of this.dataSource.data) {
      const seats = course.totalSeats || 0;
      const seatsLeft = course.numberOfSeats || 0;
      const filled = seats - seatsLeft;

      totalSeats += seats;
      totalFilled += filled;
    }

    const averageFillRate = (totalFilled / totalSeats) * 100;
    return isNaN(averageFillRate) ? 0 : Math.round(averageFillRate);
  }
  // Returns fill percentage for a course to render progress bar
  getFillPercentage(row: Course): number {
    return Math.round((this.calculateEnrolled(row) / row.totalSeats) * 100);
  }
  // Applies a custom filter on courseName, department, or instructor
  applyFilter(): void {
    const filter = this.filterValue.trim().toLowerCase();

    this.dataSource.filterPredicate = (row: Course, f: string) => {
      const nameMatch = row.courseName.toLowerCase().includes(f);
      const deptMatch = row.department.toLowerCase().includes(f);
      const instructorMatch = row.instructorId.toLowerCase().includes(f);
      const codeMatch = row.courseCode.toLowerCase().includes(f);

      // === 🔍 Month-based filter ===
      const monthMatch = (date: Date | null): boolean => {
        if (!date) return false;
        const month = date.toLocaleString('default', { month: 'long' }).toLowerCase(); // e.g. "june"
        return month.includes(f);
      };

      const enrollStartMatch = monthMatch(row.enrollStart);
      const enrollEndMatch = monthMatch(row.enrollEnd);

      return nameMatch || deptMatch || instructorMatch || codeMatch || enrollStartMatch || enrollEndMatch;
    };

    this.dataSource.filter = filter;
    this.paginator?.firstPage();
  }


  // Returns enrolled count for UI display
  getEnrolledCount(row: any): number {
    const total = row.totalSeats || 0;
    const vacant = row.numberOfSeats || 0;
    return total - vacant;
  }
  // Opens stats popup dialog to show course summary
  openStatsDialog(): void {
    Promise.all([
      this.svc.getHighDurationCourses().toPromise(),
      this.svc.getMaximumSeatsAvailableCourses().toPromise(),
      this.svc.getMinimumSeatsAvailableCourses().toPromise(),
      this.svc.getCoursesWithLargeModules().toPromise()
    ]).then(([highDuration, maxSeats, minSeats, largeModules]) => {
      const dialogData = {
        type: 'course-stats',
        activeCourses: this.dataSource.filteredData.length,
        totalEnrolled: this.getTotalEnrolled(),
        averageFillRate: this.calculateAverageFillRate(),
        highDuration,
        maxSeats,
        minSeats,
        largeModules
      };

      this.dialog.open(DialogComponent, {
        width: '90vw',
        maxWidth: '750px',
        autoFocus: false,
        disableClose: false,
        data: dialogData
      });
    }).catch(error => {
      console.error('Failed to fetch course statistics:', error);
      this.snackBar.open('Failed to load statistics.', 'Close', { duration: 3000 });
    });
  }

  //Options

  showSearch = false;

  toggleSearch(): void {
    this.showSearch = !this.showSearch;
  }


  // Adds a new course row to the top of the table in edit mode
  createNew(): void {
    const newCourse: Course = {
      courseName: '', courseCode: '', courseDescription: '',
      department: '', instructorId: '',
      numberOfSeats: this.DEFAULT_TOTAL_SEATS,
      totalSeats: this.DEFAULT_TOTAL_SEATS,
      modules: [],
      enrollStart: null, enrollEnd: null,
      _new: true, _editing: true,
    };

    this.dataSource.data = [newCourse, ...this.dataSource.data];
  }
  // Activates editing mode for a course
  startEdit(course: Course): void {
    course._editing = true;
  }
  // Cancels edit mode and reloads if not a new course
  cancelEdit(course: Course): void {
    course._new
      ? this.dataSource.data = this.dataSource.data.filter(c => c !== course)
      : this.loadCourses();
  }
  // Basic validation for required fields before saving
  private validateCourse(course: Course): boolean {
    const fields = [
      ['Course Name', course.courseName],
      ['Course Code', course.courseCode],
      ['Department', course.department],
      ['Instructor', course.instructorId],
    ] as const;

    for (const [label, value] of fields) {
      if (!value?.trim()) {
        this.showToast(`${label} is required.`, { label }, false);
        return false;
      }
    }
    return true;
  }
  // Validates start and end dates logic (future, gap, etc.)
  private validateDates(start: Date | null, end: Date | null): boolean {
    if (!start || !end) {
      this.showToast('Both start and end dates are required.', { label: "Course Name" }, false);
      return false;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (start < today) {
      this.showToast('Start date cannot be in the past.', { label: "Course Name" }, false);
      return false;
    }
    if (end <= start) {
      this.showToast('End date must be after the start date.', { label: "Course Name" }, false);
      return false;
    }

    const daysDiff = (end.getTime() - start.getTime()) / (1000 * 3600 * 24);
    if (daysDiff < 4) {
      this.showToast('Gap between start and end must be at least 4 days.', { label: "Course Name" }, false);
      return false;
    }

    return true;
  }
  // Validates dates on input change
  handleDateChange(course: Course): void {
    if (course.enrollStart && course.enrollEnd) {
      this.validateDates(course.enrollStart, course.enrollEnd);
    }
  }


  // chart representation dialog box navigation
  openHighChartDialog(): void {
    const dialogData = {
      type: 'highcharts',
      courses: this.dataSource.filteredData
    };

    this.dialog.open(DialogComponent, {

      panelClass: 'wide-dialog',      //  Prevent overflow
      data: dialogData
    });
  }


  // Saves a new or edited course, including module dialog for new
  saveEdit(row: Course): void {
    if (!this.validateCourse(row) || !this.validateDates(row.enrollStart ?? null, row.enrollEnd ?? null)) return;

    const basePayload = {
      ...row,
      totalSeats: this.DEFAULT_TOTAL_SEATS,
      enrollPeriod: {
        startDate: row.enrollStart,
        endDate: row.enrollEnd
      },
      modules: [] // initially empty, to be filled after dialog
    };

    // ✅ Step 1: If it's a new course, first save base info, then open dialog for modules
    if (row._new) {
      basePayload.numberOfSeats = this.DEFAULT_TOTAL_SEATS;

      this.svc.addCourse(basePayload).subscribe({
        next: (savedCourse: any) => {
          // ✅ Step 2: Open module dialog after basic course is saved
          const dialogRef = this.dialog.open(DialogComponent, {
            width: '600px',
            data: {
              type: 'modules',
              modules: []
            }
          });

          dialogRef.afterClosed().subscribe((moduleResult) => {
            if (Array.isArray(moduleResult) && moduleResult.length > 0) {
              // ✅ Step 3: Update the saved course with modules
              const updatedPayload = {
                ...savedCourse,
                modules: moduleResult,
                enrollPeriod: {
                  startDate: row.enrollStart,
                  endDate: row.enrollEnd
                }
              };

              this.svc.updateCourse(savedCourse._id, updatedPayload).subscribe(() => {
                this.loadCourses();
                this.snackBar.open('Course and modules saved successfully!', 'Close', { duration: 3000 });
              });
            } else {
              this.snackBar.open('Modules are required to complete course creation.', 'Close', { duration: 3000 });
            }
          });
        },
        error: () => {
          this.snackBar.open('Failed to add course.', 'Close', { duration: 3000 });
        }
      });

    } else {
      // ✅ Existing course – open module dialog before updating
      const dialogRef = this.dialog.open(DialogComponent, {
        width: '600px',
        data: {
          type: 'modules',
          modules: row.modules || []
        }
      });

      dialogRef.afterClosed().subscribe((updatedModules) => {
        if (Array.isArray(updatedModules) && updatedModules.length > 0) {
          const updatedPayload = {
            ...row,
            modules: updatedModules,
            enrollPeriod: {
              startDate: row.enrollStart,
              endDate: row.enrollEnd
            }
          };

          this.svc.updateCourse(row._id!, updatedPayload).subscribe(() => {
            this.loadCourses();
            this.snackBar.open('Course and modules updated successfully!', 'Close', { duration: 3000 });
          });
        } else {
          this.snackBar.open('Modules are required to save course.', 'Close', { duration: 3000 });
        }
      });
    }
  }


// chart 




getBottom5EnrolledCourses(): { categories: string[], values: number[] } {
  const courses = [...this.dataSource.data];
  const bottom = courses
    .map(c => ({
      name: `${c.department} Course ${c.courseCode?.split('').pop() ?? ''}`,
      enrolled: (c.totalSeats ?? 0) - (c.numberOfSeats ?? 0)
    }))
    .sort((a, b) => a.enrolled - b.enrolled)
    .slice(0, 5);

  return {
    categories: bottom.map(c => c.name),
    values: bottom.map(c => c.enrolled)
  };
}

getTopDurationCourses(): { categories: string[], values: number[] } {
  const courses = this.dataSource.data || [];
  const topDurations = courses
    .map(c => {
      const start = new Date(c.enrollStart ?? '');
      const end = new Date(c.enrollEnd ?? '');
      const days = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
      return { name: c.courseName, duration: Math.round(days) };
    })
    .filter(c => !isNaN(c.duration))
    .sort((a, b) => b.duration - a.duration)
    .slice(0, 5);
  return {
    categories: topDurations.map(c => c.name),
    values: topDurations.map(c => c.duration)
  };
}

getTopDepartmentsFillRates(): { categories: string[], values: number[] } {
  const courses = this.dataSource.data || [];

  const enrichedCourses = courses.map(c => {
    const total = c.totalSeats || 0;
    const vacant = c.numberOfSeats || 0;
    return {
      ...c,
      enrolled: total - vacant,
      department: c.department || 'Unknown'
    };
  });

  const topCourses = enrichedCourses.sort((a, b) => b.enrolled - a.enrolled).slice(0, 10);

  const deptMap: { [key: string]: { total: number, filled: number } } = {};
  topCourses.forEach(course => {
    const dept = course.department;
    if (!deptMap[dept]) deptMap[dept] = { total: 0, filled: 0 };
    deptMap[dept].total += course.totalSeats;
    deptMap[dept].filled += course.enrolled;
  });

  const categories = Object.keys(deptMap);
  const values = categories.map(dept => {
    const { total, filled } = deptMap[dept];
    return total === 0 ? 0 : Math.round((filled / total) * 100);
  });

  return { categories, values };
}

getTop5EnrolledCourses(): { categories: string[], values: number[] } {
  const courses = [...this.dataSource.data];
  const top = courses
    .map(c => ({
      name: `${c.department} Course ${c.courseCode?.split('').pop() ?? ''}`,
      enrolled: (c.totalSeats ?? 0) - (c.numberOfSeats ?? 0)
    }))
    .sort((a, b) => b.enrolled - a.enrolled)
    .slice(0, 5);

  return {
    categories: top.map(c => c.name),
    values: top.map(c => c.enrolled)
  };
}


  // Deletes a course after confirmation dialog
  deleteCourse(course: Course): void {
    const enrolledCount = this.calculateEnrolled(course);
    const message = enrolledCount > 0
      ? `${enrolledCount} student(s) enrolled – Are you sure you want to delete this ${course.courseName} ?`
      : `Delete "${course.courseName}"?`;

    const dialogRef = this.dialog.open(DialogComponent, {
      width: '400px',
      data: { type: 'delete', course, message },
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.svc.deleteCourse(course.courseCode!).subscribe(() => {
          this.loadCourses();
          this.showToast('Course deleted!', { label: "Course Name" }, true);
        });
      }
    });
  }
  // Opens read-only dialog for module view
  viewModules(course: Course): void {
    this.dialog.open(DialogComponent, {
      width: '600px',
      data: { type: 'modules', modules: course.modules, viewOnly: true },
    });
  }
   /* ─────────────── NEW: PDF material upload dialog ─────────────── */
  openMaterialDialog(course: Course): void {
    const dialogRef = this.dialog.open(MaterialUploadComponent, {
      width: '600px',
      data: { course }          // send the whole course row to the dialog
    });

    /* Refresh the row when user uploads a file */
    dialogRef.afterClosed().subscribe((updated: any) => {
      if (updated?.pdfMaterials) {
        course.pdfMaterials = updated.pdfMaterials;   // update table count
      }
    });
  }
  /* ─────────────────────────────────────────────────────────────── */
  // Loads all courses from backend and applies transformation
private loadCourses(): void {
  this.svc.getCourses().subscribe((rawCourses: any[]) => {
    const processed: Course[] = rawCourses.map((c: any) => ({
      ...c,
      totalSeats: c.totalSeats ?? this.DEFAULT_TOTAL_SEATS,
      numberOfSeats: c.numberOfSeats ?? 0,
      enrollStart: c.enrollPeriod?.startDate ? new Date(c.enrollPeriod.startDate) : null,
      enrollEnd: c.enrollPeriod?.endDate ? new Date(c.enrollPeriod.endDate) : null,
    }));

    this.dataSource.data = processed;
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.top5Courses = processed
      .map(c => ({ ...c, _editing: false }))
      .sort((a, b) => this.calculateEnrolled(b) - this.calculateEnrolled(a))
      .slice(0, 6);
      this.chartBlocks = [
        {
    title: 'Top Departments – Avg Fill Rate (%)',
    method: this.getTopDepartmentsFillRates(),
    type: 'bar' as const,
  },
  {
    title: 'Top 5 Enrolled Courses',
    method: this.getTop5EnrolledCourses(),
    type: 'pie' as const,
  },
  {
    title: 'Top 5 Longest Duration Courses',
    method: this.getTopDurationCourses(),
    type: 'line' as const,
  },
  {
    title: 'Bottom 5 Enrolled Courses',
    method: this.getBottom5EnrolledCourses(),
    type: 'pie' as const,
  }
];
});

}

  // Returns formatted instructor name based on ID
  getInstructorName(course: Course): string {
    const inst = this.instructors.find(i => i.instructorId === course.instructorId);
    return inst ? `${inst.instructorId} – ${inst.name}` : course.instructorId;
  }
  // Validates courseCode for presence of at least one letter
  hasOnlySymbolsOrNumbers(val: string): boolean {
    return !/[a-zA-Z]/.test(val);
  }

  //validate dept for presence of at least one letter and not contains any symbols
      
}


