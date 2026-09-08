export interface Flight {
  id: number;
  flightNumber: string;
  airline: string;
  from: string;
  to: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: number;
  stops: number;
  availableSeats: number;
  departureAirport: string;
  arrivalAirport: string;
  aircraft: string;
  aircraftCapacity: number;
  managedBy: string;
}
