import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../app/services/auth.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './auth.html',
  styleUrl: './auth.css'
})
export class Auth {
  mode: 'login' | 'register' = 'login';
  name = ''; email = ''; password = ''; error = '';

  constructor(private readonly auth: AuthService, private readonly router: Router, route: ActivatedRoute) {
    this.mode = route.snapshot.routeConfig?.path === 'register' ? 'register' : 'login';
  }

  submit(): void {
    this.error = '';
    if (!this.email.trim() || !this.password.trim() || (this.mode === 'register' && !this.name.trim())) {
      this.error = 'Please complete all required fields.'; return;
    }
    if (this.password.length < 6) { this.error = 'Password must contain at least 6 characters.'; return; }
    const problem = this.mode === 'login'
      ? this.auth.login(this.email, this.password)
      : this.auth.register(this.name, this.email, this.password);
    if (problem) { this.error = problem; return; }
    this.router.navigateByUrl('/flights');
  }
}
