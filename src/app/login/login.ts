import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from './services/auth';
import { LoginRequest } from './models/login-request.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  loginData: LoginRequest = {
    email: '',
    password: ''
  };

  errorMessage = '';
  successMessage = '';

  constructor(private authService: AuthService) {}

  login(): void {

    this.errorMessage = '';
    this.successMessage = '';

    this.authService.login(this.loginData).subscribe({
      next: (response: string) => {
        this.successMessage = response;
      },

      error: (error: Error) => {
        this.errorMessage = error.message;
      }
    });
  }
}