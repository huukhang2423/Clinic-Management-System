import asyncHandler from '../middleware/asyncHandler.js';
import Patient from '../models/Patient.js';

const POPULATE_VISITS = 'visits.medications.medication';
const POPULATE_FIELDS = 'name effects';

// @desc    Get all patients
// @route   GET /api/patients
export const getPatients = asyncHandler(async (req, res) => {
  const { search } = req.query;
  let filter = {};

  if (search) {
    const regex = new RegExp(search, 'i');
    filter = {
      $or: [
        { name: regex },
        { phone: regex },
        { 'visits.diagnosis': regex },
      ],
    };
  }

  const patients = await Patient.find(filter)
    .populate(POPULATE_VISITS, POPULATE_FIELDS)
    .sort({ createdAt: -1 });

  res.json({ success: true, data: patients });
});

// @desc    Get single patient
// @route   GET /api/patients/:id
export const getPatient = asyncHandler(async (req, res) => {
  const patient = await Patient.findById(req.params.id).populate(
    POPULATE_VISITS,
    POPULATE_FIELDS
  );

  if (!patient) {
    res.status(404);
    throw new Error('Không tìm thấy bệnh nhân');
  }

  res.json({ success: true, data: patient });
});

// @desc    Create patient
// @route   POST /api/patients
export const createPatient = asyncHandler(async (req, res) => {
  const { name, dateOfBirth, gender, address, phone, cccd, diagnosis, medications } = req.body;

  const patientData = { name, dateOfBirth, gender, address, phone, cccd, visits: [] };

  // If diagnosis or medications provided, create the first visit
  if (diagnosis || (medications && medications.length > 0)) {
    patientData.visits.push({
      date: new Date(),
      diagnosis: diagnosis || '',
      medications: medications || [],
    });
  }

  const patient = await Patient.create(patientData);
  const populated = await patient.populate(POPULATE_VISITS, POPULATE_FIELDS);
  res.status(201).json({ success: true, data: populated });
});

// @desc    Update patient info (name, dob, gender, address, phone)
// @route   PUT /api/patients/:id
export const updatePatient = asyncHandler(async (req, res) => {
  const { name, dateOfBirth, gender, address, phone, cccd } = req.body;

  const patient = await Patient.findByIdAndUpdate(
    req.params.id,
    { name, dateOfBirth, gender, address, phone, cccd },
    { new: true, runValidators: true }
  ).populate(POPULATE_VISITS, POPULATE_FIELDS);

  if (!patient) {
    res.status(404);
    throw new Error('Không tìm thấy bệnh nhân');
  }

  res.json({ success: true, data: patient });
});

// @desc    Add a new visit to patient
// @route   POST /api/patients/:id/visits
export const addVisit = asyncHandler(async (req, res) => {
  const patient = await Patient.findById(req.params.id);

  if (!patient) {
    res.status(404);
    throw new Error('Không tìm thấy bệnh nhân');
  }

  const { diagnosis, medications } = req.body;
  patient.visits.push({
    date: new Date(),
    diagnosis: diagnosis || '',
    medications: medications || [],
  });

  await patient.save();
  const populated = await patient.populate(POPULATE_VISITS, POPULATE_FIELDS);
  res.status(201).json({ success: true, data: populated });
});

// @desc    Delete patient
// @route   DELETE /api/patients/:id
export const deletePatient = asyncHandler(async (req, res) => {
  const patient = await Patient.findByIdAndDelete(req.params.id);

  if (!patient) {
    res.status(404);
    throw new Error('Không tìm thấy bệnh nhân');
  }

  res.json({ success: true, data: {} });
});
