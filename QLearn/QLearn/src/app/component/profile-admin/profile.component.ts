import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { PrincipalServiceService } from '../../service/principal-service.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  
   profile= 'assets/images/profile.jpg';
  isLoggedIn!: boolean;
   constructor(private authService: AuthService, private router: Router, private dialog: MatDialog, private service: PrincipalServiceService) {}

   name:any;
   email:any;
   role:any;

roles:any;
   
ngOnInit(){
/*   const userData = localStorage.getItem('user');
  if (userData) {
    const user = JSON.parse(userData); 
    this.name = user.name;
    this.role = user.role;
  }
  this.email = localStorage.getItem('email'); */
   this.roles = localStorage.getItem('role');
   this.name = localStorage.getItem('name');
   this.email = localStorage.getItem('email');
   console.log('User Name:', this.name);
   console.log('User Email:', this.email);
  console.log('User Role:', this.roles);
  
 /* 
   this.service.getLoginData().subscribe((data:any) => {
    this.name = data[0].name;
    console.log("data",data);
    
    this.email = data[0].email;  
    this.role = data[0].role;
    this.isLoggedIn = data.isLoggedIn; 
}) */
}

  logout() {
  // Clear all relevant localStorage data
  sessionStorage.removeItem('token');
  // Optionally reset component variables

  // Close any open dialogs and navigate to login
 this.dialog.closeAll();
  this.router.navigate(['/login']);
}

}
