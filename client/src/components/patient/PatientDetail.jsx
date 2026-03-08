import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import patientService from '../../services/patientService';
import { formatDate, formatDateTime } from '../../utils/formatDate';
import Modal from '../ui/Modal';
import PatientMedications from './PatientMedications';
import { useToast } from '../../context/ToastContext';
import { usePrescription } from '../../context/PrescriptionNotificationContext';

export default function PatientDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { showPrescription } = usePrescription();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showVisitForm, setShowVisitForm] = useState(false);
  const [visitDiagnosis, setVisitDiagnosis] = useState('');
  const [visitMedications, setVisitMedications] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    patientService.getById(id).then((res) => {
      setPatient(res.data.data);
      setLoading(false);
    }).catch(() => {
      showToast('Không tìm thấy bệnh nhân', 'error');
      navigate('/benh-nhan');
    });
  }, [id, navigate, showToast]);

  const handleDelete = async () => {
    try {
      await patientService.delete(id);
      showToast('Đã xóa bệnh nhân');
      navigate('/benh-nhan');
    } catch {
      showToast('Không thể xóa bệnh nhân', 'error');
    }
  };

  const handleAddVisit = async () => {
    setSubmitting(true);
    try {
      const res = await patientService.addVisit(id, {
        diagnosis: visitDiagnosis,
        medications: visitMedications.map((m) => ({
          medication: m.medication,
          dosage: m.dosage,
        })),
      });
      setPatient(res.data.data);
      setShowVisitForm(false);
      showPrescription({
        patientName: patient.name,
        diagnosis: visitDiagnosis,
        medications: visitMedications.map((m) => ({
          name: m.medicationData?.name || '',
          dosage: m.dosage,
        })),
      });
      setVisitDiagnosis('');
      setVisitMedications([]);
      showToast('Thêm lượt khám thành công');
    } catch (err) {
      showToast(err.response?.data?.error || 'Có lỗi xảy ra', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="text-center py-12 text-gray-500">Đang tải...</div>;
  if (!patient) return null;

  const visits = patient.visits || [];
  const sortedVisits = [...visits].reverse();

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">Chi tiết bệnh nhân</h1>
        <button
          onClick={() => navigate('/benh-nhan')}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          Quay lại
        </button>
      </div>

      {/* Thông tin cá nhân */}
      <div className="bg-white rounded-xl shadow-sm border p-4 mb-4">
        <div className="grid gap-3 md:grid-cols-2">
          <InfoRow label="Họ tên" value={patient.name} />
          <InfoRow label="Ngày sinh" value={formatDate(patient.dateOfBirth)} />
          <InfoRow label="Giới tính" value={patient.gender} />
          <InfoRow label="Số điện thoại" value={patient.phone} />
          <InfoRow label="Số CCCD" value={patient.cccd || '—'} />
          <InfoRow label="Địa chỉ" value={patient.address || '—'} className="md:col-span-2" />
          <InfoRow label="Ngày tạo hồ sơ" value={formatDateTime(patient.createdAt)} />
          <InfoRow
            label="Số lần khám"
            value={
              <span className="inline-block bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-semibold">
                {visits.length} lần
              </span>
            }
          />
        </div>
      </div>

      {/* Nút thêm lượt khám */}
      <button
        onClick={() => setShowVisitForm(true)}
        className="w-full bg-green-600 text-white py-2.5 rounded-lg font-medium text-sm hover:bg-green-700 transition-colors mb-4"
      >
        + Thêm lượt khám mới
      </button>

      {/* Lịch sử khám */}
      <div className="mb-4">
        <h2 className="font-semibold mb-3">Lịch sử khám bệnh</h2>
        {sortedVisits.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border p-6 text-center text-gray-400 text-sm">
            Chưa có lượt khám nào
          </div>
        ) : (
          <div className="space-y-3">
            {sortedVisits.map((visit, index) => (
              <div key={visit._id} className="bg-white rounded-xl shadow-sm border p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                    Lần {visits.length - index}
                  </span>
                  <span className="text-xs text-gray-400">{formatDateTime(visit.date)}</span>
                </div>
                <div className="mb-2">
                  <div className="text-xs text-gray-500 mb-0.5">Chẩn đoán</div>
                  <div className="text-sm text-gray-900">{visit.diagnosis || '—'}</div>
                </div>
                {visit.medications?.length > 0 && (
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Thuốc</div>
                    <div className="space-y-2">
                      {visit.medications.map((item, idx) => (
                        <div key={idx} className="bg-gray-50 rounded-lg p-2 text-sm">
                          <span className="font-medium">{item.medication?.name}</span>
                          <span className="text-gray-500"> — {item.dosage}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3 mb-4">
        <Link
          to={`/benh-nhan/chinh-sua/${patient._id}`}
          className="flex-1 text-center bg-blue-600 text-white py-2.5 rounded-lg font-medium text-sm hover:bg-blue-700 transition-colors"
        >
          Sửa thông tin
        </Link>
        <button
          onClick={() => setShowDeleteModal(true)}
          className="flex-1 bg-red-50 text-red-600 py-2.5 rounded-lg font-medium text-sm hover:bg-red-100 transition-colors"
        >
          Xóa
        </button>
      </div>

      {/* Modal thêm lượt khám */}
      <Modal isOpen={showVisitForm} onClose={() => setShowVisitForm(false)} title="Thêm lượt khám mới">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Chẩn đoán</label>
            <textarea
              value={visitDiagnosis}
              onChange={(e) => setVisitDiagnosis(e.target.value)}
              rows={3}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg outline-none text-sm resize-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nhập chẩn đoán"
            />
          </div>
          <PatientMedications medications={visitMedications} onChange={setVisitMedications} />
          <div className="flex gap-3">
            <button
              onClick={handleAddVisit}
              disabled={submitting}
              className="flex-1 bg-green-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50"
            >
              {submitting ? 'Đang lưu...' : 'Lưu lượt khám'}
            </button>
            <button
              onClick={() => setShowVisitForm(false)}
              className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-200"
            >
              Hủy
            </button>
          </div>
        </div>
      </Modal>

      {/* Modal xóa */}
      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} title="Xác nhận xóa">
        <p className="text-sm text-gray-600 mb-4">
          Bạn có chắc chắn muốn xóa bệnh nhân <strong>{patient.name}</strong>?
        </p>
        <div className="flex gap-3">
          <button
            onClick={handleDelete}
            className="flex-1 bg-red-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-red-700"
          >
            Xóa
          </button>
          <button
            onClick={() => setShowDeleteModal(false)}
            className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-200"
          >
            Hủy
          </button>
        </div>
      </Modal>
    </div>
  );
}

function InfoRow({ label, value, className = '' }) {
  return (
    <div className={className}>
      <div className="text-xs text-gray-500 mb-0.5">{label}</div>
      <div className="text-sm font-medium text-gray-900">{value}</div>
    </div>
  );
}
