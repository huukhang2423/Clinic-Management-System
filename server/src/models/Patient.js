import mongoose from 'mongoose';

const visitMedicationSchema = new mongoose.Schema(
  {
    medication: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Medication',
      required: [true, 'Thuốc là bắt buộc'],
    },
    dosage: {
      type: String,
      required: [true, 'Liều dùng là bắt buộc'],
      trim: true,
      maxlength: [500, 'Liều dùng không được quá 500 ký tự'],
    },
  },
  { _id: false }
);

const visitSchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now,
  },
  diagnosis: {
    type: String,
    trim: true,
    maxlength: [2000, 'Chẩn đoán không được quá 2000 ký tự'],
  },
  medications: [visitMedicationSchema],
});

const patientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Tên bệnh nhân là bắt buộc'],
      trim: true,
      maxlength: [200, 'Tên không được quá 200 ký tự'],
    },
    dateOfBirth: {
      type: Date,
      required: [true, 'Ngày sinh là bắt buộc'],
    },
    gender: {
      type: String,
      required: [true, 'Giới tính là bắt buộc'],
      enum: {
        values: ['Nam', 'Nữ', 'Khác'],
        message: 'Giới tính không hợp lệ',
      },
    },
    address: {
      type: String,
      trim: true,
      maxlength: [500, 'Địa chỉ không được quá 500 ký tự'],
    },
    phone: {
      type: String,
      required: [true, 'Số điện thoại là bắt buộc'],
      trim: true,
    },
    visits: [visitSchema],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Patient', patientSchema);
