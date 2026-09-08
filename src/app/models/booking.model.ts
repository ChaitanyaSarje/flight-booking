import { Flight } from '../home/models/flight.model';

export interface Passenger {
  name: string;
  email: string;
  phone: string;
}

export interface Ticket {
  number: string;
  seat: string;
  fareClass: 'Economy';
}

export interface Payment {
  reference: string;
  method: 'Card';
  status: 'Paid';
  amount: number;
}

export interface Booking {
  reference: string;
  userId: string;
  flight: Flight;
  departureDate: string;
  passenger: Passenger;
  ticket: Ticket;
  payment: Payment;
  createdAt: string;
  status: 'Confirmed';
}
