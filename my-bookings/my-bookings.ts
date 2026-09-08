import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Booking } from '../models/booking.model';
import { BookingService } from '../services/booking.service';

@Component({
  selector: 'app-my-bookings', standalone: true,
  imports: [CurrencyPipe, DatePipe, RouterLink],
  templateUrl: './my-bookings.html', styleUrl: './my-bookings.css'
})
export class MyBookings {
  bookings: Booking[];
  constructor(bookingService: BookingService) { this.bookings = bookingService.all(); }
}
