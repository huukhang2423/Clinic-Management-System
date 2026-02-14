import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import medicationService from '../../services/medicationService';
import { useToast } from '../../context/ToastContext';

export default function MedicationForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({ name: '', effects: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit) {
      medicationService.getById(id).then((res) => {
        const { name, effects } = res.data.data;
        setForm({ name, effects });
      }).catch(() => {
        showToast('Không tìm thấy thuốc', 'error');
        navigate('/thuoc');
      });
    }
  }, [id, isEdit, navigate, showToast]);

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Tên thuốc là bắt buộc';
    if (!form.effects.trim()) errs.effects = 'Tác dụng là bắt buộc';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      if (isEdit) {
        await medicationService.update(id, form);
        showToast('Cập nhật thuốc thành công');
      } else {
        await medicationService.create(form);
        showToast('Thêm thuốc thành công');
      }
      navigate('/thuoc');
    } catch (err) {
      showToast(err.response?.data?.error || 'Có lỗi xảy ra', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">{isEdit ? 'Sửa thuốc' : 'Thêm thuốc mới'}</h1>
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border p-4 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tên thuốc *</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className={`w-full px-3 py-2.5 border rounded-lg outline-none text-sm ${
              errors.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
            } focus:ring-2`}
            placeholder="Nhập tên thuốc"
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tác dụng *</label>
          <textarea
            value={form.effects}
            onChange={(e) => setForm({ ...form, effects: e.target.value })}
            rows={4}
            className={`w-full px-3 py-2.5 border rounded-lg outline-none text-sm resize-none ${
              errors.effects ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
            } focus:ring-2`}
            placeholder="Nhập tác dụng của thuốc"
          />
          {errors.effects && <p className="text-red-500 text-xs mt-1">{errors.effects}</p>}
        </div>
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg font-medium text-sm hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Đang lưu...' : isEdit ? 'Cập nhật' : 'Thêm thuốc'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/thuoc')}
            className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-lg font-medium text-sm hover:bg-gray-200 transition-colors"
          >
            Hủy
          </button>
        </div>
      </form>
    </div>
  );
}
