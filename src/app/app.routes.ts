import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Auth } from '../auth/auth';
import { MyBookings } from './my-bookings/my-bookings';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: 'login', component: Auth },
  { path: 'register', component: Auth },
  { path: 'flights', component: Home, canActivate: [authGuard] },
  { path: 'my-bookings', component: MyBookings, canActivate: [authGuard] },
  { path: '**', redirectTo: 'login' }
];
