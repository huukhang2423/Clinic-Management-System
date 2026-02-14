import { Link } from 'react-router';
import { formatDate, formatDateTime } from '../../utils/formatDate';

export default function PatientCard({ patient, onDelete }) {
  const visitCount = patient.visits?.length || 0;
  const lastVisit = visitCount > 0 ? patient.visits[visitCount - 1] : null;

  return (
    <div className="bg-white rounded-xl shadow-sm border p-4">
      <div className="flex items-start justify-between mb-2">
        <Link to={`/benh-nhan/${patient._id}`} className="font-semibold text-gray-900 hover:text-blue-600">
          {patient.name}
        </Link>
        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
          {patient.gender}
        </span>
      </div>
      <div className="space-y-1 text-sm text-gray-500 mb-3">
        <div>NS: {formatDate(patient.dateOfBirth)}</div>
        <div>SĐT: {patient.phone}</div>
        <div className="text-xs text-gray-400">
          Tạo: {formatDateTime(patient.createdAt)}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
            {visitCount} lần khám
          </span>
        </div>
        {lastVisit?.diagnosis && (
          <div className="line-clamp-1 text-xs">CĐ gần nhất: {lastVisit.diagnosis}</div>
        )}
      </div>
      <div className="flex gap-2">
        <Link
          to={`/benh-nhan/${patient._id}`}
          className="flex-1 text-center py-2 text-sm font-medium text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
        >
          Xem
        </Link>
        <Link
          to={`/benh-nhan/chinh-sua/${patient._id}`}
          className="flex-1 text-center py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
        >
          Sửa
        </Link>
        <button
          onClick={() => onDelete(patient)}
          className="flex-1 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
        >
          Xóa
        </button>
      </div>
    </div>
  );
}
