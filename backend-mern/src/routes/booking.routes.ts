import { Router } from 'express';
import { BookingController } from '../controllers/booking.controller';
import { authenticateToken, authorizeRoles } from '../middleware/auth.middleware';
import { UserRole } from '../models/User';

const router = Router();
const bookingController = new BookingController();

// All booking routes require authentication
router.use(authenticateToken);

// Routes accessible by all authenticated users
router.post('/', (req, res) => bookingController.createBooking(req, res));
router.get('/', (req, res) => bookingController.getBookings(req, res));
router.get('/:id', (req, res) => bookingController.getBookingById(req, res));

// Routes for travel arrangers and admins
router.get(
  '/pending/approvals',
  authorizeRoles(UserRole.TRAVEL_ARRANGER, UserRole.ADMIN),
  (req, res) => bookingController.getPendingApprovals(req, res)
);

router.patch(
  '/:id/approve',
  authorizeRoles(UserRole.TRAVEL_ARRANGER, UserRole.ADMIN),
  (req, res) => bookingController.approveBooking(req, res)
);

router.patch(
  '/:id/reject',
  authorizeRoles(UserRole.TRAVEL_ARRANGER, UserRole.ADMIN),
  (req, res) => bookingController.rejectBooking(req, res)
);

router.patch(
  '/:id/confirm',
  (req, res) => bookingController.confirmBooking(req, res)
);

export default router;
