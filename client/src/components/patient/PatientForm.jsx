import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router';
import patientService from '../../services/patientService';
import PatientMedications from './PatientMedications';
import AutocompleteInput from '../ui/AutocompleteInput';
import { useToast } from '../../context/ToastContext';
import { usePrescription } from '../../context/PrescriptionNotificationContext';
import { GENDER_OPTIONS } from '../../utils/constants';
import { getNameSuggestions } from '../../utils/vietnameseNames';

export default function PatientForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { showPrescription } = usePrescription();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    name: '',
    dateOfBirth: '',
    gender: 'Nam',
    address: '',
    phone: '',
    diagnosis: '',
  });
  const [medications, setMedications] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit) {
      patientService.getById(id).then((res) => {
        const p = res.data.data;
        setForm({
          name: p.name,
          dateOfBirth: p.dateOfBirth ? p.dateOfBirth.substring(0, 10) : '',
          gender: p.gender,
          address: p.address || '',
          phone: p.phone,
          diagnosis: '',
        });
      }).catch(() => {
        showToast('Không tìm thấy bệnh nhân', 'error');
        navigate('/benh-nhan');
      });
    }
  }, [id, isEdit, navigate, showToast]);

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Tên bệnh nhân là bắt buộc';
    if (!form.dateOfBirth) errs.dateOfBirth = 'Ngày sinh là bắt buộc';
    if (!form.phone.trim()) errs.phone = 'Số điện thoại là bắt buộc';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    try {
      if (isEdit) {
        // Only update personal info
        await patientService.update(id, {
          name: form.name,
          dateOfBirth: form.dateOfBirth,
          gender: form.gender,
          address: form.address,
          phone: form.phone,
        });
        showToast('Cập nhật thông tin thành công');
      } else {
        // Create patient with first visit
        const payload = {
          name: form.name,
          dateOfBirth: form.dateOfBirth,
          gender: form.gender,
          address: form.address,
          phone: form.phone,
          diagnosis: form.diagnosis,
          medications: medications.map((m) => ({
            medication: m.medication,
            dosage: m.dosage,
          })),
        };
        await patientService.create(payload);
        showToast('Thêm bệnh nhân thành công');
        showPrescription({
          patientName: form.name,
          diagnosis: form.diagnosis,
          medications: medications.map((m) => ({
            name: m.medicationData?.name || '',
            dosage: m.dosage,
          })),
        });
      }
      navigate('/benh-nhan');
    } catch (err) {
      showToast(err.response?.data?.error || 'Có lỗi xảy ra', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const nameSuggestions = useCallback((query) => {
    return getNameSuggestions(query);
  }, []);

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">
        {isEdit ? 'Sửa thông tin bệnh nhân' : 'Thêm bệnh nhân mới'}
      </h1>
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border p-4 space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Họ tên *</label>
            <AutocompleteInput
              value={form.name}
              onChange={(val) => handleChange('name', val)}
              getSuggestions={nameSuggestions}
              placeholder="Nhập họ tên bệnh nhân"
              className={`w-full px-3 py-2.5 border rounded-lg outline-none text-sm ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              } focus:ring-2 focus:ring-blue-500`}
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ngày sinh *</label>
            <input
              type="date"
              value={form.dateOfBirth}
              onChange={(e) => handleChange('dateOfBirth', e.target.value)}
              className={`w-full px-3 py-2.5 border rounded-lg outline-none text-sm ${
                errors.dateOfBirth ? 'border-red-500' : 'border-gray-300'
              } focus:ring-2 focus:ring-blue-500`}
            />
            {errors.dateOfBirth && <p className="text-red-500 text-xs mt-1">{errors.dateOfBirth}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Giới tính *</label>
            <select
              value={form.gender}
              onChange={(e) => handleChange('gender', e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg outline-none text-sm focus:ring-2 focus:ring-blue-500 bg-white"
            >
              {GENDER_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại *</label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              className={`w-full px-3 py-2.5 border rounded-lg outline-none text-sm ${
                errors.phone ? 'border-red-500' : 'border-gray-300'
              } focus:ring-2 focus:ring-blue-500`}
              placeholder="Nhập số điện thoại"
            />
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ</label>
          <input
            type="text"
            value={form.address}
            onChange={(e) => handleChange('address', e.target.value)}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg outline-none text-sm focus:ring-2 focus:ring-blue-500"
            placeholder="Nhập địa chỉ"
          />
        </div>

        {/* Chỉ hiện chẩn đoán & thuốc khi tạo mới (lần khám đầu tiên) */}
        {!isEdit && (
          <>
            <div className="border-t pt-4">
              <h2 className="text-sm font-semibold text-gray-800 mb-3">Lần khám đầu tiên</h2>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Chẩn đoán</label>
                <textarea
                  value={form.diagnosis}
                  onChange={(e) => handleChange('diagnosis', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg outline-none text-sm resize-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nhập chẩn đoán"
                />
              </div>
              <PatientMedications medications={medications} onChange={setMedications} />
            </div>
          </>
        )}

        {isEdit && (
          <p className="text-xs text-gray-400 italic">
            Để thêm lượt khám mới (chẩn đoán + thuốc), vui lòng vào trang chi tiết bệnh nhân.
          </p>
        )}

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg font-medium text-sm hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Đang lưu...' : isEdit ? 'Cập nhật' : 'Thêm bệnh nhân'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/benh-nhan')}
            className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-lg font-medium text-sm hover:bg-gray-200 transition-colors"
          >
            Hủy
          </button>
        </div>
      </form>
    </div>
  );
}
