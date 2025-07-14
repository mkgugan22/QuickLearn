import { Component } from '@angular/core';
import { ProfileComponent } from '../profile-admin/profile.component';
import {MatDialog} from '@angular/material/dialog';
import { Router, RouterLink, RouterModule } from '@angular/router';
@Component({
  selector: 'app-nav-admin',
  imports: [RouterLink, RouterModule],
  templateUrl: './nav-admin.component.html',
  styleUrl: './nav-admin.component.css'
})
export class NavAdminComponent {
url: any;
  constructor(private dialog: MatDialog, private router: Router){

  }
   logout() {
    sessionStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
