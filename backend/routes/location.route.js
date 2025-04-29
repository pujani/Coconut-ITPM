import express from 'express';
import {
  getProvinces,
  getDistricts,
  getDSDivisions
} from '../controllers/location.controller.js';

const router = express.Router();

router.get('/provinces', getProvinces);
router.get('/districts', getDistricts);
router.get('/ds-divisions', getDSDivisions);

export default router;