import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class LoginGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthService) {}

  canActivate(): boolean {
    const token = sessionStorage.getItem('token');
    const role = this.authService.getRoleFromToken();

    if (token && role) {
      if (role === 'student') {
        this.router.navigate(['/courses']);
      } else if (role === 'principal') {
        this.router.navigate(['/principal-dashboard']);
      }
      return false;
    }

    return true;
  }
}
