import asyncHandler from '../middleware/asyncHandler.js';
import Medication from '../models/Medication.js';
import Patient from '../models/Patient.js';

// @desc    Get all medications
// @route   GET /api/medications
export const getMedications = asyncHandler(async (req, res) => {
  const { search } = req.query;
  let filter = {};

  if (search) {
    const regex = new RegExp(search, 'i');
    filter = { $or: [{ name: regex }, { effects: regex }] };
  }

  const medications = await Medication.find(filter).sort({ createdAt: -1 });
  res.json({ success: true, data: medications });
});

// @desc    Get single medication
// @route   GET /api/medications/:id
export const getMedication = asyncHandler(async (req, res) => {
  const medication = await Medication.findById(req.params.id);

  if (!medication) {
    res.status(404);
    throw new Error('Không tìm thấy thuốc');
  }

  res.json({ success: true, data: medication });
});

// @desc    Create medication
// @route   POST /api/medications
export const createMedication = asyncHandler(async (req, res) => {
  const medication = await Medication.create(req.body);
  res.status(201).json({ success: true, data: medication });
});

// @desc    Update medication
// @route   PUT /api/medications/:id
export const updateMedication = asyncHandler(async (req, res) => {
  const medication = await Medication.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!medication) {
    res.status(404);
    throw new Error('Không tìm thấy thuốc');
  }

  res.json({ success: true, data: medication });
});

// @desc    Delete medication
// @route   DELETE /api/medications/:id
export const deleteMedication = asyncHandler(async (req, res) => {
  const medication = await Medication.findByIdAndDelete(req.params.id);

  if (!medication) {
    res.status(404);
    throw new Error('Không tìm thấy thuốc');
  }

  // Remove this medication from all patients
  await Patient.updateMany(
    { 'medications.medication': req.params.id },
    { $pull: { medications: { medication: req.params.id } } }
  );

  res.json({ success: true, data: {} });
});
