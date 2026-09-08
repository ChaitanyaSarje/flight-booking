import { CurrencyPipe } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Booking } from '../models/booking.model';
import { BookingService } from '../services/booking.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-my-bookings', standalone: true,
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './my-bookings.html', styleUrl: './my-bookings.css'
})
export class MyBookings {
  bookings: Booking[];
  constructor(bookingService: BookingService, auth: AuthService) {
    const currentUser = auth.currentUser();
    this.bookings = bookingService.all().filter((booking) => booking.userId === currentUser?.id);
  }
}
