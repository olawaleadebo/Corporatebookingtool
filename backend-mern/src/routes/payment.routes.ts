import { Router } from 'express';
import { PaymentController } from '../controllers/payment.controller';
import { authenticateToken, authorizeRoles } from '../middleware/auth.middleware';
import { UserRole } from '../models/User';

const router = Router();
const paymentController = new PaymentController();

// All payment routes require authentication
router.use(authenticateToken);

router.post('/initialize', (req, res) => paymentController.initializePayment(req, res));
router.get('/verify/:reference', (req, res) => paymentController.verifyPayment(req, res));
router.get('/booking/:bookingId', (req, res) => paymentController.getPaymentsByBooking(req, res));

// Refund - admin only
router.post(
  '/refund/:reference',
  authorizeRoles(UserRole.ADMIN),
  (req, res) => paymentController.refundPayment(req, res)
);

export default router;
