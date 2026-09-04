import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { LoginRequest } from '../models/login-request.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  login(loginData: LoginRequest): Observable<string> {

    if (
      loginData.email === 'admin@gmail.com' &&
      loginData.password === 'admin123'
    ) {
      return of('Login successful');
    }

    return throwError(
      () => new Error('Invalid email or password')
    );
  }
}