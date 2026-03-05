import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { useEffect } from 'react';
import { Toaster } from './components/ui/sonner';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { TravellerDashboard } from './pages/TravellerDashboard';
import { TravelArrangerDashboard } from './pages/TravelArrangerDashboard';
import { BookingFlow } from './pages/BookingFlow';
import { MyBookings } from './pages/MyBookings';
import { ApprovalQueue } from './pages/ApprovalQueue';
import { PaymentConfirmation } from './pages/PaymentConfirmation';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { UserManagement } from './pages/admin/UserManagement';
import { PolicyManagement } from './pages/admin/PolicyManagement';
import { BudgetManagement } from './pages/admin/BudgetManagement';
import { Reports } from './pages/admin/Reports';
import { CompanySettings } from './pages/admin/CompanySettings';
import { FlightSearch } from './pages/FlightSearch';
import { FlightResults } from './pages/FlightResults';
import { HotelSearch } from './pages/HotelSearch';
import { CarRental } from './pages/CarRental';
import { BookingSummary } from './pages/BookingSummary';
import { authService } from '../services/auth.service';
import { connectWebSocket, disconnectWebSocket } from '../lib/websocket';

function App() {
  useEffect(() => {
    // Initialize WebSocket connection if user is logged in
    const user = authService.getCurrentUser();
    if (user) {
      connectWebSocket(user.id);

      // Cleanup on unmount
      return () => {
        disconnectWebSocket();
      };
    }
  }, []);

  return (
    <div className="w-full min-h-screen overflow-x-hidden">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/traveller" element={<TravellerDashboard />} />
          <Route path="/traveller/search" element={<FlightSearch />} />
          <Route path="/traveller/flight-results" element={<FlightResults />} />
          <Route path="/traveller/hotel-search" element={<HotelSearch />} />
          <Route path="/traveller/car-rental" element={<CarRental />} />
          <Route path="/traveller/booking-summary" element={<BookingSummary />} />
          <Route path="/traveller/book" element={<BookingFlow />} />
          <Route path="/traveller/bookings" element={<MyBookings />} />
          <Route path="/traveller/payment" element={<PaymentConfirmation />} />
          <Route path="/arranger" element={<TravelArrangerDashboard />} />
          <Route path="/arranger/approvals" element={<ApprovalQueue />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<UserManagement />} />
          <Route path="/admin/policies" element={<PolicyManagement />} />
          <Route path="/admin/budgets" element={<BudgetManagement />} />
          <Route path="/admin/reports" element={<Reports />} />
          <Route path="/admin/settings" element={<CompanySettings />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </div>
  );
}

export default App;