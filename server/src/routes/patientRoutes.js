import { Router } from 'express';
import {
  getPatients,
  getPatient,
  createPatient,
  updatePatient,
  deletePatient,
  addVisit,
} from '../controllers/patientController.js';

const router = Router();

router.route('/').get(getPatients).post(createPatient);
router.route('/:id').get(getPatient).put(updatePatient).delete(deletePatient);
router.route('/:id/visits').post(addVisit);

export default router;
