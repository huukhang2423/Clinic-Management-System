import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router';
import medicationService from '../services/medicationService';
import MedicationCard from '../components/medication/MedicationCard';
import SearchBar from '../components/ui/SearchBar';
import Modal from '../components/ui/Modal';
import { useToast } from '../context/ToastContext';

export default function MedicationPage() {
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const { showToast } = useToast();

  const fetchMedications = useCallback(async (search = '') => {
    setLoading(true);
    try {
      const res = await medicationService.getAll(search);
      setMedications(res.data.data);
    } catch {
      showToast('Không thể tải danh sách thuốc', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchMedications();
  }, [fetchMedications]);

  const handleDelete = async () => {
    try {
      await medicationService.delete(deleteTarget._id);
      setMedications((prev) => prev.filter((m) => m._id !== deleteTarget._id));
      showToast('Đã xóa thuốc');
    } catch {
      showToast('Không thể xóa thuốc', 'error');
    }
    setDeleteTarget(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">Quản lý thuốc</h1>
        <Link
          to="/thuoc/tao-moi"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          + Thêm thuốc
        </Link>
      </div>

      <div className="mb-4">
        <SearchBar onSearch={fetchMedications} placeholder="Tìm thuốc theo tên hoặc tác dụng..." />
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Đang tải...</div>
      ) : medications.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-2">Chưa có thuốc nào</p>
          <Link to="/thuoc/tao-moi" className="text-blue-600 text-sm font-medium">
            Thêm thuốc đầu tiên
          </Link>
        </div>
      ) : (
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {medications.map((med) => (
            <MedicationCard key={med._id} medication={med} onDelete={setDeleteTarget} />
          ))}
        </div>
      )}

      <Modal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Xác nhận xóa">
        <p className="text-sm text-gray-600 mb-4">
          Bạn có chắc chắn muốn xóa thuốc <strong>{deleteTarget?.name}</strong>? Thuốc này cũng sẽ bị xóa khỏi tất cả hồ sơ bệnh nhân.
        </p>
        <div className="flex gap-3">
          <button
            onClick={handleDelete}
            className="flex-1 bg-red-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-red-700"
          >
            Xóa
          </button>
          <button
            onClick={() => setDeleteTarget(null)}
            className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-200"
          >
            Hủy
          </button>
        </div>
      </Modal>
    </div>
  );
}
