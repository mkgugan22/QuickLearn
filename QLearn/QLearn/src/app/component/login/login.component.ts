import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { Login } from '../../model/login.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  signUpForm: FormGroup;
  error = '';
  logo = 'assets/logo.png'; // update this path to match your actual logo

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.signUpForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [
        Validators.required
      ]],
      // Optional: Add role and skill controls if you uncomment them in HTML later
      // role: ['', Validators.required],
      // skill: ['']
    });
  }

  // login.component.ts
submit(): void {
  const loginData = {
    username: this.signUpForm.value.username,
    password: this.signUpForm.value.password
  };
  console.log('Login Data:', loginData);

  this.authService.login(loginData).subscribe({
    next: () => {
      const role = this.authService.getRoleFromToken();
      if (role === 'student') {
        this.router.navigate(['/courses']);
      } else if (role === 'principal') {
        this.router.navigate(['/principal-dashboard']);
      } else {
        this.router.navigate(['/unauthorized']);
      }
    },
    error: (err) => {
      console.error(err);
      this.error = 'Invalid login credentials';
    }
  });
}


  resetForm(): void {
    this.signUpForm.reset();
    this.error = '';
  }
}
