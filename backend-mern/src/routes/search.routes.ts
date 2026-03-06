import { Router } from 'express';
import { SearchController } from '../controllers/search.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();
const searchController = new SearchController();

// All search routes require authentication
router.use(authenticateToken);

router.get('/flights', (req, res) => searchController.searchFlights(req, res));
router.get('/hotels', (req, res) => searchController.searchHotels(req, res));
router.get('/cars', (req, res) => searchController.searchCars(req, res));

export default router;
