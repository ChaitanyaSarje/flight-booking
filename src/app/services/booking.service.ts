import { Injectable } from '@angular/core';
import { Booking } from '../models/booking.model';

const BOOKINGS_KEY = 'flight-booking-bookings';

@Injectable({ providedIn: 'root' })
export class BookingService {
  add(booking: Booking): void {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify([booking, ...this.all()]));
  }

  all(): Booking[] {
    if (typeof localStorage === 'undefined') return [];
    try { return JSON.parse(localStorage.getItem(BOOKINGS_KEY) ?? '[]') as Booking[]; } catch { return []; }
  }
}
