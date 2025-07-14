import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterModule } from '@angular/router';
import { ProfileComponent } from "../profile/profile.component";
import { NotificationsComponent } from "../notifications/notifications.component";

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterModule, RouterLinkActive, CommonModule, ProfileComponent, NotificationsComponent],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  showNotifications = false;
  roles:any;
ngOnInit() {
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && this.showNotifications) {
      this.showNotifications = false;
      document.body.style.overflow = '';
    }
  });
}
  
  dropdownOpen = false;
  studentNameFirstLetter = 'J'; // Replace with actual first letter of logged-in student

  constructor(private router: Router) {}

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  @HostListener('document:click', ['$event'])
  closeDropdownOutside(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.profile-menu')) {
      this.dropdownOpen = false;
    }
  }

  toggleNotifications() {
  this.showNotifications = !this.showNotifications;

  if (this.showNotifications) {
    document.body.style.overflow = 'hidden'; // Prevent background scroll
  } else {
    document.body.style.overflow = ''; // Restore scroll
  }
}

  closeNotifications() {
    this.showNotifications = false;
  }

  logout() {
    // Add your logout logic here
    this.router.navigate(['/login']);
  }
  ngOnDestroy() {
  document.body.style.overflow = ''; // safety restore
}


  
}
