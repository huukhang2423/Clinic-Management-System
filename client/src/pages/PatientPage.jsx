import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router';
import patientService from '../services/patientService';
import PatientCard from '../components/patient/PatientCard';
import SearchBar from '../components/ui/SearchBar';
import Modal from '../components/ui/Modal';
import { useToast } from '../context/ToastContext';

export default function PatientPage() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const { showToast } = useToast();

  const fetchPatients = useCallback(async (search = '') => {
    setLoading(true);
    try {
      const res = await patientService.getAll(search);
      setPatients(res.data.data);
    } catch {
      showToast('Không thể tải danh sách bệnh nhân', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  const handleDelete = async () => {
    try {
      await patientService.delete(deleteTarget._id);
      setPatients((prev) => prev.filter((p) => p._id !== deleteTarget._id));
      showToast('Đã xóa bệnh nhân');
    } catch {
      showToast('Không thể xóa bệnh nhân', 'error');
    }
    setDeleteTarget(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">Quản lý bệnh nhân</h1>
        <Link
          to="/benh-nhan/tao-moi"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          + Thêm mới
        </Link>
      </div>

      <div className="mb-4">
        <SearchBar onSearch={fetchPatients} placeholder="Tìm theo tên, SĐT, chẩn đoán..." />
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Đang tải...</div>
      ) : patients.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-2">Chưa có bệnh nhân nào</p>
          <Link to="/benh-nhan/tao-moi" className="text-blue-600 text-sm font-medium">
            Thêm bệnh nhân đầu tiên
          </Link>
        </div>
      ) : (
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {patients.map((patient) => (
            <PatientCard key={patient._id} patient={patient} onDelete={setDeleteTarget} />
          ))}
        </div>
      )}

      <Modal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Xác nhận xóa">
        <p className="text-sm text-gray-600 mb-4">
          Bạn có chắc chắn muốn xóa bệnh nhân <strong>{deleteTarget?.name}</strong>?
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
