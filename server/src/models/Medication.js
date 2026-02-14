import mongoose from 'mongoose';

const medicationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Tên thuốc là bắt buộc'],
      trim: true,
      maxlength: [200, 'Tên thuốc không được quá 200 ký tự'],
    },
    effects: {
      type: String,
      required: [true, 'Tác dụng là bắt buộc'],
      trim: true,
      maxlength: [1000, 'Tác dụng không được quá 1000 ký tự'],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Medication', medicationSchema);
