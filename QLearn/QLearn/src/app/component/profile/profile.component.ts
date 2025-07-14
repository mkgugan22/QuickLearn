import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  studentNameFirstLetter: string = 'S';  // Default fallback
  isDropdownOpen: boolean = false;
  roles: string | null = null;

  constructor(private router: Router) {
    // Fetch role and student name from local/session storage
    this.roles = localStorage.getItem('role');

    const studentName = localStorage.getItem('username'); // Or 'name' if stored that way
    if (studentName) {
      this.studentNameFirstLetter = studentName.charAt(0).toUpperCase();
    }

    console.log('User Role:', this.roles);
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  closeDropdown(): void {
    this.isDropdownOpen = false;
  }

  goToProfile(): void {
    this.closeDropdown();
    this.router.navigate(['/student-detail']);
  }

  logout(): void {
    sessionStorage.removeItem('token');
    this.closeDropdown();
    this.router.navigate(['/login']);
  }
}
