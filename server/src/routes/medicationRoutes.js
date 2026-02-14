import { Router } from 'express';
import {
  getMedications,
  getMedication,
  createMedication,
  updateMedication,
  deleteMedication,
} from '../controllers/medicationController.js';

const router = Router();

router.route('/').get(getMedications).post(createMedication);
router.route('/:id').get(getMedication).put(updateMedication).delete(deleteMedication);

export default router;
