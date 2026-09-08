import { CurrencyPipe, NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Flight } from './models/flight.model';
import { FlightSearchService } from './services/flight-search.service';
import { BookingService } from '../services/booking.service';
import { AuthService } from '../services/auth.service';

type View = 'search' | 'results' | 'booking' | 'payment' | 'confirmation';
type SortOption = 'price' | 'departure';

@Component({
  selector: 'app-home', standalone: true,
  imports: [FormsModule, CurrencyPipe, NgClass, RouterLink],
  templateUrl: './home.html', styleUrl: './home.css'
})
export class Home {
  readonly cities = ['Pune', 'Mumbai', 'Delhi', 'Bangalore', 'Goa'];
  from = 'Pune'; to = 'Delhi'; departureDate = this.defaultDepartureDate();
  flights: Flight[] = []; selectedFlight?: Flight;
  view: View = 'search'; errorMessage = ''; loading = false;
  airlineFilter = 'All'; maxPrice = 10000; sortBy: SortOption = 'price';
  passenger = { name: '', email: '', phone: '' };
  payment = { cardNumber: '', cardName: '', expiry: '', cvv: '' };
  bookingReference = '';
  selectedSeat = '12A';
  readonly seats = ['12A', '12B', '12C', '13A', '13B', '13C', '14A', '14B', '14C'];

  constructor(
    private readonly flightSearchService: FlightSearchService,
    private readonly bookingService: BookingService,
    private readonly auth: AuthService
  ) {}

  get airlines(): string[] { return [...new Set(this.flights.map((flight) => flight.airline))]; }
  get travellerName(): string { return this.auth.currentUser()?.name ?? 'Traveller'; }
  private defaultDepartureDate(): string { return new Date().toISOString().slice(0, 10); }
  get filteredFlights(): Flight[] {
    return this.flights.filter((flight) => this.airlineFilter === 'All' || flight.airline === this.airlineFilter)
      .filter((flight) => flight.price <= this.maxPrice)
      .sort((a, b) => this.sortBy === 'price' ? a.price - b.price : a.departureTime.localeCompare(b.departureTime));
  }

  searchFlights(): void {
    this.errorMessage = '';
    if (!this.from || !this.to) { this.errorMessage = 'Please select both departure and destination cities.'; return; }
    if (this.from === this.to) { this.errorMessage = 'Departure and destination cannot be the same.'; return; }
    this.loading = true;
    this.flightSearchService.searchFlights(this.from, this.to).subscribe({
      next: (flights) => { this.flights = flights; this.airlineFilter = 'All'; this.maxPrice = Math.max(10000, ...flights.map((f) => f.price)); this.view = 'results'; this.loading = false; },
      error: () => { this.errorMessage = 'Unable to load flight data. Please try again.'; this.loading = false; }
    });
  }
  selectFlight(flight: Flight): void { this.selectedFlight = flight; this.errorMessage = ''; this.view = 'booking'; }
  continueToPayment(): void {
    if (!this.departureDate || !this.passenger.name.trim() || !this.passenger.email.trim() || !this.passenger.phone.trim()) { this.errorMessage = 'Choose a departure date and enter the passenger name, email, and phone number.'; return; }
    this.errorMessage = ''; this.view = 'payment';
  }
  pay(): void {
    const card = this.payment.cardNumber.replace(/\s/g, '');
    if (!this.payment.cardName.trim() || card.length < 12 || !this.payment.expiry.trim() || this.payment.cvv.length < 3) { this.errorMessage = 'Enter valid mock payment details to complete this demo booking.'; return; }
    const uniqueValue = Date.now().toString().slice(-7);
    this.bookingReference = `FB${uniqueValue}`;
    this.bookingService.add({
      reference: this.bookingReference, userId: this.auth.currentUser()!.id, flight: this.selectedFlight!, departureDate: this.departureDate,
      passenger: { ...this.passenger },
      ticket: { number: `TK${uniqueValue}`, seat: this.selectedSeat, fareClass: 'Economy' },
      payment: { reference: `PAY${uniqueValue}`, method: 'Card', status: 'Paid', amount: this.selectedFlight!.price },
      createdAt: new Date().toISOString(), status: 'Confirmed'
    });
    this.errorMessage = ''; this.view = 'confirmation';
  }
  backToResults(): void { this.errorMessage = ''; this.view = 'results'; }
  newSearch(): void {
    this.from = 'Pune'; this.to = 'Delhi'; this.departureDate = this.defaultDepartureDate(); this.flights = []; this.selectedFlight = undefined;
    this.passenger = { name: '', email: '', phone: '' }; this.payment = { cardNumber: '', cardName: '', expiry: '', cvv: '' };
    this.selectedSeat = '12A';
    this.errorMessage = ''; this.view = 'search';
  }
}
