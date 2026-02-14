import { Link } from 'react-router';

export default function MedicationCard({ medication, onDelete }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border p-4">
      <h3 className="font-semibold text-gray-900 mb-1">{medication.name}</h3>
      <p className="text-sm text-gray-500 line-clamp-2 mb-3">{medication.effects}</p>
      <div className="flex gap-2">
        <Link
          to={`/thuoc/chinh-sua/${medication._id}`}
          className="flex-1 text-center py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
        >
          Sửa
        </Link>
        <button
          onClick={() => onDelete(medication)}
          className="flex-1 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
        >
          Xóa
        </button>
      </div>
    </div>
  );
}
