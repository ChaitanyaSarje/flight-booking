import { Injectable, signal } from '@angular/core';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
}

const USERS_KEY = 'flight-booking-users';
const SESSION_KEY = 'flight-booking-session';
const DEMO_USER: User = { id: 'demo-user', name: 'Demo Traveller', email: 'demo@flightbooking.test', password: 'demo1234' };

@Injectable({ providedIn: 'root' })
export class AuthService {
  readonly currentUser = signal<User | null>(this.readSession());

  register(name: string, email: string, password: string): string | null {
    const users = this.users();
    if (users.some((user) => user.email.toLowerCase() === email.toLowerCase())) return 'An account already exists for this email.';
    const user: User = { id: crypto.randomUUID?.() ?? Date.now().toString(), name: name.trim(), email: email.trim().toLowerCase(), password };
    this.write(USERS_KEY, [...users, user]);
    this.setSession(user);
    return null;
  }

  login(email: string, password: string): string | null {
    const user = this.users().find((item) => item.email === email.trim().toLowerCase() && item.password === password);
    if (!user) return 'Incorrect email or password.';
    this.setSession(user);
    return null;
  }

  logout(): void {
    if (this.browser) localStorage.removeItem(SESSION_KEY);
    this.currentUser.set(null);
  }

  private get browser(): boolean { return typeof localStorage !== 'undefined'; }
  private users(): User[] { return this.read<User[]>(USERS_KEY) ?? [DEMO_USER]; }
  private readSession(): User | null { return this.read<User>(SESSION_KEY); }
  private read<T>(key: string): T | null {
    if (!this.browser) return null;
    try { return JSON.parse(localStorage.getItem(key) ?? 'null') as T | null; } catch { return null; }
  }
  private write(key: string, value: unknown): void { if (this.browser) localStorage.setItem(key, JSON.stringify(value)); }
  private setSession(user: User): void { this.write(SESSION_KEY, user); this.currentUser.set(user); }
}
