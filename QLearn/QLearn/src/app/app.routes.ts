import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';
import { LoginGuard } from './guards/login.guard';

export const routes: Routes = [
  {
    path: 'main-page',
    loadComponent: () =>
      import('./component/main-page/main-page.component').then((c) => c.MainPageComponent),
  },
  { path: '', redirectTo: 'main-page', pathMatch: 'full' },

  {
    path: 'login',
    loadComponent: () =>
      import('./component/login/login.component').then((c) => c.LoginComponent),
    canActivate: [LoginGuard],
  },

  {
    path: 'principal-dashboard',
    loadComponent: () =>
      import('./component/principal-dashboard/principal-dashboard.component').then((c) => c.PrincipalDashboardComponent),
    canActivate: [AuthGuard, RoleGuard],
    data: { role: 'principal' },
  },
  {
    path: 'edit-instructor/:id',
    loadComponent: () =>
      import('./component/edit-instructor/edit-instructor.component').then((c) => c.EditInstructorComponent),
    canActivate: [AuthGuard, RoleGuard],
    data: { role: 'principal' },
  },
  {
    path: 'student-data',
    loadComponent: () =>
      import('./component/student-data/student-data.component').then((c) => c.StudentDataComponent),
    canActivate: [AuthGuard, RoleGuard],
    data: { role: 'principal' },
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('./component/profile/profile.component').then((c) => c.ProfileComponent),
    canActivate: [AuthGuard, RoleGuard],
    data: { role: 'principal' },
  },
  {
    path: 'trainers',
    loadComponent: () =>
      import('./component/trainers/trainers.component').then((c) => c.TrainersComponent),
    canActivate: [AuthGuard, RoleGuard],
    data: { role: 'principal' },
  },
  {
    path: 'course',
    loadComponent: () =>
      import('./component/course/course.component').then((c) => c.CourseComponent),
    canActivate: [AuthGuard, RoleGuard],
    data: { role: 'principal' },
  },
  {
    path: 'list/:id',
    loadComponent: () =>
      import('./component/list/list.component').then((c) => c.ListComponent),
    canActivate: [AuthGuard, RoleGuard],
    data: { role: 'principal' },
  },
  {
    path: 'approval-list',
    loadComponent: () =>
      import('./component/approval-list/approval-list.component').then((c) => c.ApprovalListComponent),
    canActivate: [AuthGuard, RoleGuard],
    data: { role: 'principal' },
  },
  {
    path: 'courses',
    loadComponent: () =>
      import('./component/courses/courses.component').then((c) => c.CoursesComponent),
    canActivate: [AuthGuard, RoleGuard],
    data: { role: 'student' },
  },
  {
    path: 'courses/:id',
    loadComponent: () =>
      import('./component/course-detail/course-detail.component').then((c) => c.CourseDetailComponent),
    canActivate: [AuthGuard, RoleGuard],
    data: { role: 'student' },
  },
  {
    path: 'mylearning',
    loadComponent: () =>
      import('./component/mylearning/mylearning.component').then((c) => c.MyLearningComponent),
    canActivate: [AuthGuard, RoleGuard],
    data: { role: 'student' },
  },
  {
    path: 'mylearning/:id',
    loadComponent: () =>
      import('./component/module-detail/module-detail.component').then((c) => c.ModuleDetailComponent),
    canActivate: [AuthGuard, RoleGuard],
    data: { role: 'student' },
  },
  {
    path: 'student-detail',
    loadComponent: () =>
      import('./component/student-detail/student-detail.component').then((c) => c.StudentDetailComponent),
    canActivate: [AuthGuard, RoleGuard],
    data: { role: 'student' },
  },
  {
    path: 'notification',
    loadComponent: () =>
      import('./component/notifications/notifications.component').then((c) => c.NotificationsComponent),
    canActivate: [AuthGuard, RoleGuard],
    data: { role: 'student' },
  }
];
