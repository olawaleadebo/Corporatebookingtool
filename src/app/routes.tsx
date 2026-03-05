import { createBrowserRouter } from 'react-router';
import { Login } from './pages/Login';
import { TravellerDashboard } from './pages/TravellerDashboard';
import { TravelArrangerDashboard } from './pages/TravelArrangerDashboard';
import { BookingFlow } from './pages/BookingFlow';
import { MyBookings } from './pages/MyBookings';
import { ApprovalQueue } from './pages/ApprovalQueue';
import { PaymentConfirmation } from './pages/PaymentConfirmation';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { PolicyManagement } from './pages/admin/PolicyManagement';
import { FlightSearch } from './pages/FlightSearch';
import { FlightResults } from './pages/FlightResults';
import { HotelSearch } from './pages/HotelSearch';
import { CarRental } from './pages/CarRental';
import { BookingSummary } from './pages/BookingSummary';
import { BackendTest } from './pages/BackendTest';
import SystemStatus from './pages/SystemStatus';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Login,
  },
  {
    path: '/backend-test',
    Component: BackendTest,
  },
  {
    path: '/system-status',
    Component: SystemStatus,
  },
  {
    path: '/traveller',
    Component: TravellerDashboard,
  },
  {
    path: '/traveller/search',
    Component: FlightSearch,
  },
  {
    path: '/traveller/flight-results',
    Component: FlightResults,
  },
  {
    path: '/traveller/hotel-search',
    Component: HotelSearch,
  },
  {
    path: '/traveller/car-rental',
    Component: CarRental,
  },
  {
    path: '/traveller/booking-summary',
    Component: BookingSummary,
  },
  {
    path: '/traveller/book',
    Component: BookingFlow,
  },
  {
    path: '/traveller/bookings',
    Component: MyBookings,
  },
  {
    path: '/traveller/payment',
    Component: PaymentConfirmation,
  },
  {
    path: '/arranger',
    Component: TravelArrangerDashboard,
  },
  {
    path: '/arranger/approvals',
    Component: ApprovalQueue,
  },
  {
    path: '/admin',
    Component: AdminDashboard,
  },
  {
    path: '/admin/policies',
    Component: PolicyManagement,
  },
]);